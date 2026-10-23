/**
 * Foodsphere Nutritio Intelligence - Budget-Aware AI Meal Planner
 * Core rule-based recommendation & calculation engine.
 *
 * IMPORTANT (honesty note): this is a transparent, deterministic, RULE-BASED planner.
 * No AI model or external API is connected. See `README.md` ("Adding a real AI later")
 * for the single place where a real model could be plugged in.
 *
 * Provides:
 *  1. Budget validation (empty / invalid / negative / zero / excessive)
 *  2. Pantry matching (whole-word aliases, so "eggplant" is NOT "egg")
 *  3. Recipe cost & nutrition from ingredient quantities
 *  4. Daily AND 7-day weekly plan generation within a budget
 *  5. Shopping-list aggregation (excludes pantry items, combines duplicates)
 *  6. Computed (not hard-coded) cheaper alternatives and saving tips
 *
 * Requires the globals from data/foods.js, data/recipes.js and js/i18n.js (English/Bangla text).
 */

const MealPlannerEngine = (() => {

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const LIMITS = { dailyMax: 5000, weeklyMax: 35000 };   // BDT, "realistic personal food budget"
  const PERIOD_DAYS = { daily: 1, weekly: 7 };
  const SLOTS = ['breakfast', 'lunch', 'dinner'];
  const SLOT_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
  const PREFERENCES = ['standard', 'high-protein', 'vegetarian', 'diabetic-friendly', 'budget-saver'];

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------
  function round2(val) { return Math.round((val + Number.EPSILON) * 100) / 100; }
  function round1(val) { return Math.round((val + Number.EPSILON) * 10) / 10; }
  function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
  function fmt(n) { const v = round2(n); return '৳' + v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); }

  // Language support: every sentence the engine produces comes from js/i18n.js (English or Bangla).
  const tx = (key, params) => I18N.t(key, params);
  const isBn = () => I18N.lang === 'bn';
  /** Food name in the current language. */
  const foodName = food => (isBn() ? (food.bengaliName || food.shortName) : (food.shortName || food.name));
  const joinNames = names => {
    const and = isBn() ? ' ও ' : ' and ';
    return names.length <= 2 ? names.join(and) : names.slice(0, -1).join(', ') + and + names[names.length - 1];
  };
  const slotLabel = slot => tx('slot_' + slot);

  // ---------------------------------------------------------------------------
  // 1. Budget validation
  // ---------------------------------------------------------------------------
  /**
   * Validates a raw budget value (string or number) for the chosen timeframe.
   * @returns {{valid:boolean, value?:number, errorType?:string, message?:string}}
   */
  function validateBudget(raw, timeframe) {
    const tf = timeframe === 'weekly' ? 'weekly' : 'daily';
    const fail = (errorType, message) => ({ valid: false, errorType, message });

    if (raw === undefined || raw === null) {
      return fail('EMPTY_BUDGET', tx('e_budget_empty'));
    }
    if (typeof raw === 'number' && !Number.isFinite(raw)) {
      return fail('INVALID_BUDGET', tx('e_budget_invalid'));
    }

    let s = I18N.toEnDigits(String(raw).trim());          // Bangla digits (২৫০) are accepted too
    if (s === '') {
      return fail('EMPTY_BUDGET', tx('e_budget_empty'));
    }

    s = s.replace(/^৳\s*/, '').replace(/,/g, '').replace(/\s*(bdt|tk|taka)\s*$/i, '').trim();

    if (/^-\s*\d/.test(s)) {
      return fail('NEGATIVE_OR_ZERO_BUDGET', tx('e_budget_negative'));
    }
    if (!/^\d+(\.\d+)?$/.test(s)) {
      return fail('INVALID_BUDGET', tx('e_budget_invalid'));
    }

    const value = round2(Number(s));
    if (!(value > 0)) {
      return fail('NEGATIVE_OR_ZERO_BUDGET', tx('e_budget_zero'));
    }

    const max = tf === 'weekly' ? LIMITS.weeklyMax : LIMITS.dailyMax;
    if (value > max) {
      return fail('UNREALISTIC_BUDGET',
        tx('e_budget_toolarge', { max: max.toLocaleString('en-US'), period: tx(tf === 'weekly' ? 'period_week' : 'period_day') }));
    }
    return { valid: true, value };
  }

  // ---------------------------------------------------------------------------
  // 2. Pantry matching (whole-word aliases)
  // ---------------------------------------------------------------------------
  let aliasIndex = null;

  function tokenize(str) {
    return String(str).toLowerCase().normalize('NFC')
      .split(/[^\p{L}\p{M}\p{N}]+/u)
      .filter(Boolean);
  }

  function getAliasIndex() {
    if (aliasIndex) return aliasIndex;
    aliasIndex = new Map();
    BANGLADESHI_FOOD_DATABASE.forEach(food => {
      (food.aliases || []).forEach(a => {
        tokenize(a).forEach(tok => { if (!aliasIndex.has(tok)) aliasIndex.set(tok, food.id); });
      });
    });
    return aliasIndex;
  }

  /** Returns every canonical foodId mentioned in a free-text pantry entry (whole words only). */
  function matchAllInText(raw) {
    const found = [];
    if (typeof raw !== 'string') return found;
    const idx = getAliasIndex();
    tokenize(raw).forEach(tok => {
      const id = idx.get(tok);
      if (id && !found.includes(id)) found.push(id);
    });
    return found;
  }

  /** First canonical food ID for a single pantry entry, or null if it is not in the database. */
  function matchPantryItem(raw) {
    const all = matchAllInText(raw);
    return all.length ? all[0] : null;
  }

  /** @returns {Set<string>} canonical food IDs found in the user's pantry entries */
  function normalizePantryList(rawPantryList) {
    const set = new Set();
    if (!Array.isArray(rawPantryList)) return set;
    rawPantryList.forEach(item => matchAllInText(item).forEach(id => set.add(id)));
    return set;
  }

  // ---------------------------------------------------------------------------
  // 2b. Units and home inventory quantities
  // ---------------------------------------------------------------------------
  // Every food in data/foods.js has ONE base unit (g, ml or piece). Users may enter stock in
  // g, kg, ml, L or pieces; it is converted to the food's base unit.
  const UNIT_INFO = {
    g:     { type: 'weight', factor: 1 },
    kg:    { type: 'weight', factor: 1000 },
    ml:    { type: 'volume', factor: 1 },
    l:     { type: 'volume', factor: 1000 },
    piece: { type: 'count',  factor: 1 }
  };
  const BASE_TYPE = { g: 'weight', ml: 'volume', piece: 'count' };
  const MAX_BASE_QUANTITY = 1000000;   // 1,000 kg / 1,000 L / 1,000,000 pieces: anything above is rejected

  /** Units a user may choose for a food, most natural first. */
  function allowedUnitsFor(foodId) {
    const food = getFoodItemById(foodId);
    if (!food) return ['g', 'kg', 'ml', 'l', 'piece'];
    const type = BASE_TYPE[food.unit];
    let units = type === 'weight' ? ['kg', 'g'] : type === 'volume' ? ['l', 'ml'] : ['piece'];
    if (food.unit === 'piece' && food.gramsPerPiece) units = ['piece', 'kg', 'g'];   // roti/atta: weight is an ESTIMATE
    return units;
  }

  /**
   * Converts a user's stock amount into the food's base unit.
   * @returns {{ok:true, base:number, estimated:boolean}|{ok:false, error:'invalid'|'negative'|'unit'|'whole'|'toolarge'}}
   */
  function toBaseQuantity(foodId, quantity, unit) {
    const food = getFoodItemById(foodId);
    if (!food) return { ok: false, error: 'invalid' };
    let str = typeof quantity === 'number' ? (Number.isFinite(quantity) ? String(quantity) : '') : I18N.toEnDigits(String(quantity === undefined || quantity === null ? '' : quantity).trim()).replace(/,/g, '');
    if (/^-/.test(str) && /\d/.test(str)) return { ok: false, error: 'negative' };
    if (!/^\d+(\.\d+)?$/.test(str)) return { ok: false, error: 'invalid' };
    const q = Number(str);
    const u = unit && UNIT_INFO[unit] ? unit : food.unit;
    if (!allowedUnitsFor(foodId).includes(u)) return { ok: false, error: 'unit' };
    let base, estimated = false;
    if (UNIT_INFO[u].type === BASE_TYPE[food.unit]) {
      base = q * UNIT_INFO[u].factor;
      if (food.unit === 'piece' && !Number.isInteger(base)) return { ok: false, error: 'whole' };
    } else {
      // weight entered for a counted food (roti/atta): rough, clearly-labelled estimate
      base = Math.floor((q * UNIT_INFO[u].factor) / food.gramsPerPiece);
      estimated = true;
    }
    base = food.unit === 'piece' ? Math.round(base) : Math.round(base * 10) / 10;
    if (base > MAX_BASE_QUANTITY) return { ok: false, error: 'toolarge' };
    return { ok: true, base, estimated };
  }

  /**
   * Builds the starting stock from the legacy `pantry` list (plenty of each item) and/or the new
   * `inventory` list ([{label|foodId, quantity, unit}]). An entry without a quantity means "plenty".
   */
  function buildInventory(pantryList, inventoryList) {
    const stock = {};
    const meta = {};
    const warnings = [];
    BANGLADESHI_FOOD_DATABASE.forEach(f => { stock[f.id] = 0; });
    (Array.isArray(pantryList) ? pantryList : []).forEach(entry =>
      matchAllInText(entry).forEach(id => { stock[id] = Infinity; meta[id] = { unlimited: true, estimated: false }; }));
    (Array.isArray(inventoryList) ? inventoryList : []).forEach(entry => {
      if (!entry) return;
      const id = entry.foodId || matchPantryItem(entry.label);
      if (!id || !getFoodItemById(id)) return;
      const q = entry.quantity;
      const empty = q === undefined || q === null || String(q).trim() === '';
      if (empty) { stock[id] = Infinity; meta[id] = { unlimited: true, estimated: false }; return; }
      const r = toBaseQuantity(id, q, entry.unit);
      if (!r.ok) { warnings.push({ foodId: id, error: r.error }); return; }
      if (meta[id] && meta[id].unlimited) return;                       // plenty already declared
      stock[id] = (stock[id] || 0) + r.base;
      meta[id] = { unlimited: false, estimated: Boolean(meta[id] && meta[id].estimated) || r.estimated, initial: stock[id] };
    });
    const pantrySet = new Set(Object.keys(stock).filter(id => stock[id] > 0));
    return { stock, meta, warnings, pantrySet };
  }

  /** Returns a copy of `stock` with the amounts in `used` taken out (unlimited items stay unlimited). */
  function applyUse(stock, used) {
    const next = Object.assign({}, stock);
    Object.keys(used).forEach(id => {
      if (Number.isFinite(next[id])) next[id] = Math.max(0, Math.round((next[id] - used[id]) * 1000) / 1000);
    });
    return next;
  }

  // ---------------------------------------------------------------------------
  // 3. Recipe cost & nutrition (quantity-aware)
  // ---------------------------------------------------------------------------
  /**
   * Evaluates one recipe against the stock available right now.
   * Each ingredient is covered from home as far as the stock allows; the rest has to be bought.
   * Costs are rounded to 2 decimals per ingredient line so all totals add up from the same numbers.
   * @returns {{metrics:Object, used:Object}} `used` = amount taken from home stock per food.
   */
  function evalMeal(recipe, stock) {
    let grossCost = 0, outOfPocketCost = 0, calories = 0, protein = 0, carbs = 0, fat = 0, matchWeight = 0;
    const ingredientBreakdown = [], missingIngredients = [], pantryIngredients = [], used = {};

    recipe.ingredients.forEach(ing => {
      const food = getFoodItemById(ing.foodId);
      if (!food) {
        console.warn(`Food ID "${ing.foodId}" not found in BANGLADESHI_FOOD_DATABASE`);
        return;
      }
      const need = ing.quantity;
      const have = stock[food.id] || 0;
      const home = Math.min(need, have);
      const buy = Math.round((need - home) * 1000) / 1000;
      const ratio = need / food.referenceQuantity;
      const lineCost = round2(ratio * food.estimatedPriceBDT);                       // full recipe value
      const buyCost = buy <= 0 ? 0 : (buy === need ? lineCost : round2((buy / food.referenceQuantity) * food.estimatedPriceBDT));

      grossCost += lineCost; outOfPocketCost += buyCost;
      calories += ratio * food.nutrition.calories;
      protein += ratio * food.nutrition.protein;
      carbs += ratio * food.nutrition.carbs;
      fat += ratio * food.nutrition.fat;
      if (home > 0) used[food.id] = home;

      const full = buy <= 0, partial = home > 0 && buy > 0;
      const line = {
        foodId: food.id, name: food.name, shortName: food.shortName || food.name, bengaliName: food.bengaliName || food.shortName,
        quantity: need, unit: ing.unit, homeQuantity: home, buyQuantity: buy
      };
      if (home > 0) pantryIngredients.push({ ...line, cost: 0, grossCost: lineCost, partial });
      if (buy > 0) missingIngredients.push({ ...line, quantity: buy, cost: buyCost });
      matchWeight += full ? 1 : partial ? 0.5 : 0;
      ingredientBreakdown.push({
        ...line, isInPantry: full, partial, cost: buyCost, grossCost: lineCost,
        calories: ratio * food.nutrition.calories, protein: ratio * food.nutrition.protein
      });
    });

    return {
      used,
      metrics: {
        ...recipe,
        grossCost: round2(grossCost),
        outOfPocketCost: round2(outOfPocketCost),
        nutrition: { calories: Math.round(calories), protein: round1(protein), carbs: round1(carbs), fat: round1(fat) },
        ingredientBreakdown, missingIngredients, pantryIngredients,
        pantryMatchCount: matchWeight,
        pantryCoverageRatio: recipe.ingredients.length ? matchWeight / recipe.ingredients.length : 0
      }
    };
  }

  /** Original API: cost & nutrition of a recipe when the items in `pantrySet` are plentiful at home. */
  function calculateRecipeMetrics(recipe, pantrySet) {
    const pantry = pantrySet || new Set();
    const stock = {};
    BANGLADESHI_FOOD_DATABASE.forEach(f => { stock[f.id] = pantry.has(f.id) ? Infinity : 0; });
    return evalMeal(recipe, stock).metrics;
  }

  function calculateIngredientCost(foodId, quantity) {
    const food = getFoodItemById(foodId);
    if (!food || isNaN(quantity) || quantity <= 0) return 0;
    return round2((quantity / food.referenceQuantity) * food.estimatedPriceBDT);
  }

  // ---------------------------------------------------------------------------
  // 4. Plan generation
  // ---------------------------------------------------------------------------
  function matchesPreference(recipe, pref) {
    if (!pref || pref === 'standard') return true;
    return Array.isArray(recipe.dietaryPreferences) && recipe.dietaryPreferences.includes(pref);
  }

  /** Builds per-slot recipe pools (metrics assume the full starting stock) for a preference. */
  function buildPools(preference, stock) {
    const all = BANGLADESHI_RECIPE_DATABASE.map(r => evalMeal(r, stock).metrics);
    const pools = {};
    let broadened = false;
    SLOTS.forEach(slot => {
      let pool = all.filter(r => r.mealType === slot && matchesPreference(r, preference));
      if (pool.length === 0) { broadened = true; pool = all.filter(r => r.mealType === slot); }
      pools[slot] = pool;
    });
    return { pools, broadened };
  }

  function sumNutrition(meals) {
    const list = SLOTS.map(s => meals[s].nutrition);
    return {
      calories: list.reduce((a, n) => a + n.calories, 0),
      protein: round1(list.reduce((a, n) => a + n.protein, 0)),
      carbs: round1(list.reduce((a, n) => a + n.carbs, 0)),
      fat: round1(list.reduce((a, n) => a + n.fat, 0))
    };
  }

  /**
   * Chooses the best breakfast + lunch + dinner for one day from the stock available at the start
   * of the day (stock is used up meal by meal, so a later meal sees what earlier meals took).
   * 1) Any combination within the day's budget is preferred (scored by home-stock use, nutrition,
   *    preference and variety). 2) If nothing fits, the cheapest plan is used and the shortfall is
   *    reported - the budget is never silently exceeded.
   */
  function planOneDay(pools, dayBudget, preference, stock, usage, previousIds) {
    let best = null, cheapest = null;

    pools.breakfast.forEach(bfRecipe => {
      const bfEval = evalMeal(bfRecipe, stock);
      const afterBf = applyUse(stock, bfEval.used);
      pools.lunch.forEach(lnRecipe => {
        const lnEval = evalMeal(lnRecipe, afterBf);
        const afterLn = applyUse(afterBf, lnEval.used);
        pools.dinner.forEach(dnRecipe => {
          const dnEval = evalMeal(dnRecipe, afterLn);
          const bf = bfEval.metrics, ln = lnEval.metrics, dn = dnEval.metrics;

          const out = round2(bf.outOfPocketCost + ln.outOfPocketCost + dn.outOfPocketCost);
          const gross = round2(bf.grossCost + ln.grossCost + dn.grossCost);
          const nut = sumNutrition({ breakfast: bf, lunch: ln, dinner: dn });
          const pantryMatches = bf.pantryMatchCount + ln.pantryMatchCount + dn.pantryMatchCount;
          const savings = round2(gross - out);
          const fits = out <= dayBudget + 1e-9;

          let score = 0;
          // Budget adherence (critical)
          if (fits) {
            score += 1000;
            if (dayBudget > 0 && out / dayBudget <= 0.85) score += 40;
          } else {
            score -= 1000 + (out - dayBudget) * 25;
          }
          // Use of ingredients already at home
          score += pantryMatches * 40 + savings * 1.5;
          [bf, ln, dn].forEach(m => { if (m.outOfPocketCost === 0) score += 45; });
          // Nutrition adequacy
          if (nut.calories >= 1600 && nut.calories <= 2450) score += 80;
          else if (nut.calories < 1400) score -= 60;
          else if (nut.calories > 2700) score -= 40;
          if (nut.calories < 1600) score -= (1600 - nut.calories) * 0.15;      // gently prefer fuller days
          score += nut.protein * (preference === 'high-protein' ? 3.5 : 1.2);
          // Preference
          if (preference === 'budget-saver') score += (dayBudget - out) * 2.5;
          // Dietary diversity: reward covering more food groups in a day (grain, protein, legume, vegetable, fruit, dairy)
          const groups = new Set();
          [bf, ln, dn].forEach(m => m.ingredients.forEach(i => {
            const f = getFoodItemById(i.foodId);
            if (f && f.category) groups.add(String(f.category).split(' ')[0]);
          }));
          score += groups.size * 30;
          // Variety (within the day and across the week); never repeat an identical whole day if avoidable
          if (usage.days && usage.days.has(bf.id + '|' + ln.id + '|' + dn.id)) score -= 120;
          const has = (m, id) => m.ingredients.some(i => i.foodId === id);
          if (has(ln, 'fish') && has(dn, 'fish')) score -= 35;
          if (has(ln, 'chicken') && has(dn, 'chicken')) score -= 35;
          SLOTS.forEach(slot => {
            const m = { breakfast: bf, lunch: ln, dinner: dn }[slot];
            score -= 40 * (usage[slot][m.id] || 0);
            if (previousIds && previousIds[slot] === m.id) score -= 60;
          });

          const cand = {
            breakfast: bf, lunch: ln, dinner: dn, out, gross, nut, fits, score,
            used: { breakfast: bfEval.used, lunch: lnEval.used, dinner: dnEval.used },
            before: { breakfast: stock, lunch: afterBf, dinner: afterLn }
          };
          if (!cheapest || out < cheapest.out || (out === cheapest.out && nut.calories > cheapest.nut.calories)) cheapest = cand;
          if (fits && (!best || score > best.score)) best = cand;
        });
      });
    });

    return best || cheapest;
  }

  /** Cost of the cheapest possible plan for the whole period (days use up stock one after another). */
  function simulateCheapest(pools, stock, periodDays, preference) {
    let st = stock, total = 0;
    const noUsage = { breakfast: {}, lunch: {}, dinner: {} };
    for (let d = 0; d < periodDays; d++) {
      const c = planOneDay(pools, -1, preference, st, noUsage, null);
      total += c.out;
      st = applyUse(applyUse(applyUse(st, c.used.breakfast), c.used.lunch), c.used.dinner);
    }
    return round2(total);
  }

  /** Cost of the cheapest first day (used by the "if you already had X" tips). */
  function cheapestFirstDay(pools, stock, preference) {
    return planOneDay(pools, -1, preference, stock, { breakfast: {}, lunch: {}, dinner: {} }, null).out;
  }

  /**
   * Generates a daily or 7-day plan.
   * @param {Object} params { budget, timeframe:'daily'|'weekly', pantry:string[] (plenty at home),
   *                          inventory:[{label|foodId, quantity, unit}] (stock with amounts), preference }
   * @returns {Object} { success:false, errorType, message } or the full plan (see bottom).
   */
  function generateMealPlan(params) {
    const p = params || {};
    const timeframe = p.timeframe === 'weekly' ? 'weekly' : 'daily';
    const requestedPref = p.preference || 'standard';
    const preference = PREFERENCES.includes(requestedPref) ? requestedPref : 'standard';

    const v = validateBudget(p.budget, timeframe);
    if (!v.valid) return { success: false, errorType: v.errorType, message: v.message };

    const periodBudget = v.value;
    const periodDays = PERIOD_DAYS[timeframe];
    const dailyTargetBudget = periodBudget / periodDays;
    const inv = buildInventory(p.pantry, p.inventory);
    const pantrySet = inv.pantrySet;
    const { pools, broadened } = buildPools(preference, inv.stock);

    if (SLOTS.some(s => pools[s].length === 0)) {
      return { success: false, errorType: 'NO_RECIPES', message: tx('e_no_recipes') };
    }

    // --- Build each day. Remaining budget is re-spread over the remaining days; stock is used up as we go. ---
    const usage = { breakfast: {}, lunch: {}, dinner: {}, days: new Set() };
    const days = [];
    const snapshots = [];              // stock each meal saw before it was cooked (for exact swap savings)
    let remaining = periodBudget;
    let previousIds = null;
    let stock = inv.stock;

    for (let d = 0; d < periodDays; d++) {
      const dayBudget = remaining / (periodDays - d);
      const chosen = planOneDay(pools, dayBudget, preference, stock, usage, previousIds);
      const ctx = { dailyTargetBudget: dayBudget, preference, fitsBudget: chosen.fits };
      const meals = {};
      SLOTS.forEach(slot => {
        const base = chosen[slot];
        const reasons = generateMealRecommendationReasons(base, ctx);
        meals[slot] = { ...base, recommendationReasons: reasons, explanation: buildExplanation(base, ctx) };
        usage[slot][base.id] = (usage[slot][base.id] || 0) + 1;
      });
      usage.days.add(chosen.breakfast.id + '|' + chosen.lunch.id + '|' + chosen.dinner.id);
      snapshots.push(chosen.before);
      stock = applyUse(applyUse(applyUse(stock, chosen.used.breakfast), chosen.used.lunch), chosen.used.dinner);
      previousIds = { breakfast: chosen.breakfast.id, lunch: chosen.lunch.id, dinner: chosen.dinner.id };
      remaining = round2(remaining - chosen.out);
      days.push({
        dayNumber: d + 1, meals,
        totalOutOfPocket: chosen.out, totalGrossCost: chosen.gross,
        nutrition: sumNutrition(meals), dayBudget: round2(dayBudget), fitsBudget: chosen.fits
      });
    }

    // --- Period totals (sums of the displayed meals) ---
    const totalCost = round2(days.reduce((a, d) => a + d.totalOutOfPocket, 0));
    const totalGrossCost = round2(days.reduce((a, d) => a + d.totalGrossCost, 0));
    const totals = {
      calories: days.reduce((a, d) => a + d.nutrition.calories, 0),
      protein: round1(days.reduce((a, d) => a + d.nutrition.protein, 0)),
      carbs: round1(days.reduce((a, d) => a + d.nutrition.carbs, 0)),
      fat: round1(days.reduce((a, d) => a + d.nutrition.fat, 0))
    };
    const remainingBudget = round2(periodBudget - totalCost);
    const fitsBudget = totalCost <= periodBudget + 1e-9;

    // --- Shopping list: only what must still be bought, duplicates combined ---
    const shoppingMap = new Map();
    days.forEach(day => SLOTS.forEach(slot => {
      day.meals[slot].missingIngredients.forEach(item => {
        if (!shoppingMap.has(item.foodId)) {
          shoppingMap.set(item.foodId, { foodId: item.foodId, name: item.name, shortName: item.shortName, bengaliName: item.bengaliName, unit: item.unit, quantity: 0, cost: 0, usedIn: [] });
        }
        const entry = shoppingMap.get(item.foodId);
        entry.quantity += item.quantity;
        entry.cost = round2(entry.cost + item.cost);
        entry.usedIn.push({ day: day.dayNumber, slot });
      });
    }));
    const shoppingList = Array.from(shoppingMap.values()).map(item => {
      const qty = round1(item.quantity);
      let step = periodDays > 1 ? 50 : 10;
      if (item.unit === 'piece') step = 1;
      else if (item.unit === 'ml') step = periodDays > 1 ? 250 : 50;
      return { ...item, quantity: qty, originalQuantity: qty, originalCost: item.cost, unitStep: step, purchased: false };
    });

    // --- Ingredient check: what the plan needs vs what is at home (all amounts are ESTIMATES) ---
    const inventorySummary = buildInventorySummary(days, inv);

    // --- Alternatives, tips, notices ---
    const minimumPeriodCost = simulateCheapest(pools, inv.stock, periodDays, preference);
    const alternatives = buildAlternatives({
      pools, days, snapshots, preference, stock0: inv.stock, pantrySet, timeframe, periodDays, periodBudget,
      dailyTargetBudget, totalCost, remainingBudget, fitsBudget, minimumPeriodCost
    });

    const notices = [];
    if (broadened) notices.push({ type: 'info', text: tx('n_broadened') });
    if (preference === 'diabetic-friendly') notices.push({ type: 'medical', text: tx('n_medical') });
    const avgKcal = totals.calories / periodDays;
    if (avgKcal < 1400) notices.push({ type: 'info', text: tx('n_lowkcal', { kcal: Math.round(avgKcal) }) });
    const hasUnlimited = Object.keys(inv.meta).some(id => inv.meta[id].unlimited);
    if (periodDays > 1 && hasUnlimited) notices.push({ type: 'info', text: tx('n_assume_week') });
    if (inventorySummary.shortCount > 0 && inventorySummary.hasFiniteStock) notices.push({ type: 'info', text: tx('n_stock_short', { n: inventorySummary.rows.filter(r => r.status === 'short').length }) });

    const average = {
      calories: Math.round(totals.calories / periodDays),
      protein: round1(totals.protein / periodDays),
      carbs: round1(totals.carbs / periodDays),
      fat: round1(totals.fat / periodDays)
    };

    return {
      success: true,
      timeframe, periodDays, preference,
      userBudget: periodBudget, periodBudget,
      dailyTargetBudget: round2(dailyTargetBudget),
      totalCost,                                  // whole period
      totalDailyCost: periodDays === 1 ? totalCost : round2(totalCost / periodDays),   // per-day figure
      totalGrossCost,
      remainingBudget,                            // whole period
      fitsBudget,
      minimumPeriodCost,
      pantryItemsCount: pantrySet.size,
      pantryIds: Array.from(pantrySet),
      preferenceBroadened: broadened,
      days,
      meals: days[0].meals,                       // first day (kept for backward compatibility)
      totals,                                     // whole period
      dailyNutrition: periodDays === 1 ? totals : average,
      shoppingList, alternatives, notices,
      inventory: inventorySummary,
      inventoryWarnings: inv.warnings,
      reasoningSummary: {
        strategy: fitsBudget ? 'Budget-Satisfied & Pantry-Optimized' : 'Minimum-Cost Fallback Plan',
        logicDescription: 'Rule-based scoring: budget adherence first, then home-stock use, nutrition adequacy, your preference and variety. No AI model is connected.',
        medicalDisclaimer: 'General food information based on approximate reference values. Not medical advice.'
      }
    };
  }

  /**
   * For every ingredient the plan uses (and every item in the home inventory): how much is needed,
   * how much is at home, how much of the home stock is used, what is left and what must be bought.
   * "Needed" = the sum of the recipe portions (one serving of each meal), so it is an estimate.
   */
  function buildInventorySummary(days, inv) {
    const acc = {};
    days.forEach(day => SLOTS.forEach(slot => day.meals[slot].ingredientBreakdown.forEach(l => {
      const a = acc[l.foodId] || (acc[l.foodId] = { need: 0, home: 0, buy: 0, cost: 0 });
      a.need += l.quantity; a.home += l.homeQuantity; a.buy += l.buyQuantity; a.cost += l.cost;
    })));
    const ids = BANGLADESHI_FOOD_DATABASE.map(f => f.id).filter(id => acc[id] || inv.meta[id]);
    const order = { short: 0, none: 1, enough: 2, assumed: 3, unused: 4 };
    const rows = ids.map(id => {
      const food = getFoodItemById(id);
      const a = acc[id] || { need: 0, home: 0, buy: 0, cost: 0 };
      const m = inv.meta[id];
      const unlimited = Boolean(m && m.unlimited);
      const initial = m && !m.unlimited ? m.initial : 0;
      let status;
      if (a.need === 0) status = 'unused';
      else if (unlimited) status = 'assumed';
      else if (a.buy > 0) status = initial > 0 ? 'short' : 'none';
      else status = 'enough';
      return {
        foodId: id, shortName: food.shortName || food.name, bengaliName: food.bengaliName || food.shortName, unit: food.unit,
        needed: round1(a.need), unlimited,
        atHome: unlimited ? null : round1(initial),
        usedFromHome: round1(a.home),
        remaining: unlimited ? null : round1(Math.max(0, initial - a.home)),
        toBuy: round1(a.buy), buyCost: round2(a.cost),
        estimated: Boolean(m && m.estimated), status
      };
    }).sort((x, y) => order[x.status] - order[y.status]);
    return {
      rows,
      hasFiniteStock: rows.some(r => !r.unlimited && r.atHome !== null && r.status !== 'none'),
      shortCount: rows.filter(r => r.status === 'short' || r.status === 'none').length
    };
  }

  // ---------------------------------------------------------------------------
  // 5. Explanations
  // ---------------------------------------------------------------------------
  function generateMealRecommendationReasons(meal, context) {
    const reasons = [];
    const { dailyTargetBudget, preference, fitsBudget } = context;
    const nameOf = i => { const f = getFoodItemById(i.foodId); return f ? foodName(f) : i.shortName; };

    if (meal.pantryIngredients && meal.pantryIngredients.length > 0) {
      const names = meal.pantryIngredients.map(nameOf).join(isBn() ? '، ' : ', ');
      const savings = round2(meal.grossCost - meal.outOfPocketCost);
      if (meal.outOfPocketCost === 0) {
        reasons.push({ type: 'pantry', badge: tx('r_pantry_full_badge'), text: tx('r_pantry_full_text', { names }) });
      } else {
        reasons.push({ type: 'pantry', badge: tx('r_pantry_use_badge'), text: tx('r_pantry_use_text', { names, saving: '৳' + savings.toFixed(2) }) });
      }
    }

    if (fitsBudget) {
      const share = dailyTargetBudget > 0 ? meal.outOfPocketCost / dailyTargetBudget : 1;
      const cost = '৳' + meal.outOfPocketCost.toFixed(2);
      reasons.push(share <= 0.35
        ? { type: 'budget', badge: tx('r_budget_small_badge'), text: tx('r_budget_small_text', { cost }) }
        : { type: 'budget', badge: tx('r_budget_ok_badge'), text: tx('r_budget_ok_text', { cost }) });
    } else {
      reasons.push({ type: 'budget', badge: tx('r_budget_low_badge'), text: tx('r_budget_low_text', { cost: '৳' + meal.outOfPocketCost.toFixed(2) }) });
    }

    const has = id => meal.ingredients.some(i => i.foodId === id);
    const protein = meal.nutrition.protein;
    if (protein >= 15 || has('fish') || has('chicken') || (has('egg') && has('lentils_daal'))) {
      const source = tx(has('fish') ? 'src_fish' : has('chicken') ? 'src_chicken' : has('egg') ? 'src_eggs' : 'src_lentils');
      reasons.push({ type: 'nutrition', badge: tx('r_protein_badge'), text: tx('r_protein_text', { protein, source }) });
    } else if (has('seasonal_vegetables')) {
      reasons.push({ type: 'nutrition', badge: tx('r_fibre_badge'), text: tx('r_fibre_text', { kcal: meal.nutrition.calories }) });
    } else if (has('roti')) {
      reasons.push({ type: 'nutrition', badge: tx('r_roti_badge'), text: tx('r_roti_text') });
    }

    if (preference === 'vegetarian' && meal.dietaryPreferences.includes('vegetarian')) {
      reasons.push({ type: 'preference', badge: tx('r_veg_badge'), text: tx('r_veg_text') });
    } else if (preference === 'high-protein') {
      reasons.push({ type: 'preference', badge: tx('r_hp_badge'), text: tx('r_hp_text') });
    } else if (preference === 'diabetic-friendly') {
      reasons.push({ type: 'preference', badge: tx('r_diab_badge'), text: tx('r_diab_text') });
    } else if (preference === 'budget-saver') {
      reasons.push({ type: 'preference', badge: tx('r_save_badge'), text: tx('r_save_text') });
    }
    return reasons.slice(0, 3);
  }

  /** One readable sentence explaining the choice (all values come from the real calculation). */
  function buildExplanation(meal, ctx) {
    const clauses = [];
    if (meal.pantryIngredients.length) {
      const names = meal.pantryIngredients.map(i => { const f = getFoodItemById(i.foodId); return (f ? foodName(f) : i.shortName); });
      clauses.push(tx('x_uses', { names: joinNames(isBn() ? names : names.map(n => n.toLowerCase())) }));
    }
    const cost = '৳' + meal.outOfPocketCost.toFixed(2);
    clauses.push(ctx.fitsBudget ? tx('x_cost_fit', { cost, allow: fmt(ctx.dailyTargetBudget) }) : tx('x_cost_low', { cost }));
    clauses.push(tx('x_gives', { kcal: meal.nutrition.calories, protein: meal.nutrition.protein }));
    const last = clauses.pop();
    const text = clauses.length ? clauses.join(', ') + tx('x_and') + last : last;
    return tx('x_sentence', { clauses: text });
  }

  // ---------------------------------------------------------------------------
  // 6. Alternatives & saving tips (all numbers are computed from the data)
  // ---------------------------------------------------------------------------
  function buildAlternatives(c) {
    const out = [];
    const periodWord = tx(c.timeframe === 'weekly' ? 'word_weekly' : 'word_daily');
    const perDay = c.periodDays > 1 ? tx('a_per_day', { amount: fmt(c.minimumPeriodCost / c.periodDays) }) : '';
    const mealName = m => (isBn() ? (m.bengaliName || m.name) : m.name);

    if (!c.fitsBudget) {
      const shortfall = round2(c.totalCost - c.periodBudget);
      out.push({
        title: tx('a_low_title'),
        type: 'warning',
        description: tx('a_low_desc', { period: periodWord, budget: fmt(c.periodBudget), short: fmt(shortfall), min: fmt(c.minimumPeriodCost) }),
        actionTip: tx('a_low_tip', { period: periodWord, min: fmt(c.minimumPeriodCost), perday: perDay })
      });

      // What the budget can realistically cover, per day
      const allowance = c.periodBudget / c.periodDays;
      const singles = SLOTS.map(slot => {
        const best = [...c.pools[slot]].sort((a, b) => a.outOfPocketCost - b.outOfPocketCost)[0];
        return { slot, meal: best };
      }).sort((a, b) => a.meal.outOfPocketCost - b.meal.outOfPocketCost);
      let left = allowance;
      const affordable = [];
      singles.forEach(s => { if (s.meal.outOfPocketCost <= left + 1e-9) { affordable.push(s); left = round2(left - s.meal.outOfPocketCost); } });
      if (affordable.length === 0) {
        out.push({
          title: tx('a_cover_title'),
          type: 'tip',
          description: tx('a_cover_none', { meal: mealName(singles[0].meal), cost: fmt(singles[0].meal.outOfPocketCost), allowance: fmt(allowance) }),
          actionTip: tx('a_cover_none_tip')
        });
      } else {
        const need = SLOTS.length - affordable.length;
        out.push({
          title: tx('a_cover_title'),
          type: 'tip',
          description: tx('a_cover_some', {
            allowance: fmt(allowance), count: affordable.length,
            list: affordable.map(a => tx('a_cover_item', { slot: slotLabel(a.slot), meal: mealName(a.meal), cost: fmt(a.meal.outOfPocketCost) })).join('; ')
          }),
          actionTip: need > 0 ? tx('a_cover_tip', { n: need }) : ''
        });
      }
    }

    // Home-stock what-ifs: how much would having one more staple (plentiful) at home reduce the minimum cost?
    if (!c.fitsBudget || c.pantrySet.size === 0) {
      const base = cheapestFirstDay(c.pools, c.stock0, c.preference);
      const what = [];
      BANGLADESHI_FOOD_DATABASE.forEach(food => {
        if (c.pantrySet.has(food.id)) return;
        const trial = Object.assign({}, c.stock0); trial[food.id] = Infinity;
        const saved = round2(base - cheapestFirstDay(c.pools, trial, c.preference));
        if (saved >= 3) what.push({ food, saved });
      });
      what.sort((a, b) => b.saved - a.saved);
      what.slice(0, 2).forEach(w => out.push({
        title: tx('a_pantry_title', { food: isBn() ? foodName(w.food) : foodName(w.food).toLowerCase() }),
        type: 'pantry-tip',
        description: tx('a_pantry_desc', { saved: fmt(w.saved) }),
        actionTip: tx('a_pantry_tip')
      }));
    }

    // Cheaper swaps (savings computed against the stock each meal actually saw; weekly savings count every appearance)
    const counts = new Map();
    c.days.forEach((day, di) => SLOTS.forEach(slot => {
      const m = day.meals[slot];
      const k = slot + '|' + m.id;
      const prev = counts.get(k);
      counts.set(k, { slot, meal: m, n: (prev ? prev.n : 0) + 1, snapshot: prev ? prev.snapshot : c.snapshots[di][slot] });
    }));
    const swaps = [];
    counts.forEach(({ slot, meal, n, snapshot }) => {
      let alt = null;
      c.pools[slot].filter(r => r.id !== meal.id).forEach(r => {
        const m = evalMeal(r, snapshot).metrics;
        if (!alt || m.outOfPocketCost < alt.outOfPocketCost) alt = m;
      });
      if (!alt) return;
      const each = round2(meal.outOfPocketCost - alt.outOfPocketCost);
      if (each >= 3) swaps.push({ slot, meal, alt, each, total: round2(each * n), n });
    });
    swaps.sort((a, b) => b.total - a.total).slice(0, 2).forEach(s => {
      const dCal = s.alt.nutrition.calories - s.meal.nutrition.calories;
      const dPro = round1(s.alt.nutrition.protein - s.meal.nutrition.protein);
      const sign = n => (n > 0 ? '+' : '') + n;
      out.push({
        title: tx('a_swap_title', { slot: isBn() ? slotLabel(s.slot) : slotLabel(s.slot).toLowerCase(), meal: mealName(s.alt) }),
        type: 'savings-swap',
        description: tx('a_swap_desc', {
          from: mealName(s.meal), to: mealName(s.alt), total: fmt(s.total),
          weekly: s.n > 1 ? tx('a_swap_week', { n: s.n }) : '', dcal: sign(dCal), dpro: sign(dPro)
        }),
        actionTip: tx('a_swap_tip')
      });
    });

    if (c.pantrySet.size === 0 && c.fitsBudget) {
      out.push({ title: tx('a_empty_title'), type: 'tip', description: tx('a_empty_desc'), actionTip: tx('a_empty_tip') });
    }

    if (c.fitsBudget && c.remainingBudget > c.periodBudget * 0.35) {
      out.push({ title: tx('a_room_title'), type: 'tip', description: tx('a_room_desc', { amount: fmt(c.remainingBudget) }), actionTip: '' });
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // 7. Shopping list totals
  // ---------------------------------------------------------------------------
  /** Recalculates every item's cost from its quantity and returns list totals. */
  function calculateShoppingListTotals(items) {
    if (!Array.isArray(items)) return { grandTotal: 0, pendingTotal: 0, purchasedTotal: 0, purchasedCount: 0, totalCount: 0 };
    let grand = 0, pending = 0, bought = 0, boughtCount = 0;
    items.forEach(item => {
      // Untouched items keep the exact cost computed by the plan; edited quantities are re-priced.
      const untouched = item.originalCost !== undefined && item.quantity === item.originalQuantity;
      const cost = untouched ? item.originalCost : calculateIngredientCost(item.foodId, item.quantity);
      item.cost = cost;
      grand += cost;
      if (item.purchased) { bought += cost; boughtCount++; } else { pending += cost; }
    });
    return {
      grandTotal: round2(grand), pendingTotal: round2(pending), purchasedTotal: round2(bought),
      purchasedCount: boughtCount, totalCount: items.length
    };
  }

  return {
    LIMITS, PERIOD_DAYS, SLOTS, SLOT_LABELS, PREFERENCES, UNIT_INFO,
    slotLabel, foodName, allowedUnitsFor, toBaseQuantity,
    validateBudget, normalizePantryList, matchPantryItem,
    calculateRecipeMetrics, calculateIngredientCost, calculateShoppingListTotals,
    generateMealPlan
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MealPlannerEngine };
}
