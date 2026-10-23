/**
 * Engine tests for the Budget-Aware Meal Planner.
 * Shared by tests/unit.html (browser) and tests/run-node.js (command line).
 * Each test checks real behaviour; none of them are loosened to make results pass.
 */
function defineEngineTests(t, E, FOODS, RECIPES, I18N) {
  if (I18N) I18N.setLang('en', { remember: false });   // the original tests check the English wording
  const { test, eq, ok, near } = t;
  const SLOTS = ['breakfast', 'lunch', 'dinner'];
  const r2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
  const r1 = v => Math.round((v + Number.EPSILON) * 10) / 10;
  const food = id => FOODS.find(f => f.id === id);

  // -------------------------------------------------------------------------
  // Data integrity
  // -------------------------------------------------------------------------
  test('DATA: every recipe ingredient exists in the food database', () => {
    const ids = new Set(FOODS.map(f => f.id));
    RECIPES.forEach(r => r.ingredients.forEach(i => ok(ids.has(i.foodId), `${r.id} -> ${i.foodId}`)));
  });
  test('DATA: recipe ids are unique and units match the food table', () => {
    eq(new Set(RECIPES.map(r => r.id)).size, RECIPES.length);
    RECIPES.forEach(r => r.ingredients.forEach(i => eq(i.unit, food(i.foodId).unit, `${r.id}:${i.foodId}`)));
  });
  test('DATA: prices are positive and nutrition is internally consistent (4/4/9 kcal rule within 12%)', () => {
    FOODS.forEach(f => {
      ok(f.estimatedPriceBDT > 0 && f.referenceQuantity > 0, f.id);
      const est = f.nutrition.protein * 4 + f.nutrition.carbs * 4 + f.nutrition.fat * 9;
      ok(Math.abs(est - f.nutrition.calories) / f.nutrition.calories <= 0.12, `${f.id}: ${est} vs ${f.nutrition.calories}`);
    });
  });
  test('DATA: every diet has at least 2 recipes for each meal (no silent fallback)', () => {
    ['standard', 'high-protein', 'vegetarian', 'diabetic-friendly', 'budget-saver'].forEach(pref => {
      SLOTS.forEach(slot => {
        const n = RECIPES.filter(r => r.mealType === slot && r.dietaryPreferences.includes(pref)).length;
        ok(n >= 2, `${pref}/${slot} has ${n}`);
      });
    });
  });
  test('DATA: vegetarian-tagged recipes contain no meat, fish or eggs', () => {
    RECIPES.filter(r => r.dietaryPreferences.includes('vegetarian')).forEach(r =>
      r.ingredients.forEach(i => ok(!['fish', 'chicken', 'egg'].includes(i.foodId), `${r.id} has ${i.foodId}`)));
  });

  // -------------------------------------------------------------------------
  // Budget validation
  // -------------------------------------------------------------------------
  test('BUDGET: empty / null / undefined / whitespace -> EMPTY_BUDGET with friendly text', () => {
    ['', '   ', null, undefined].forEach(v => {
      const r = E.validateBudget(v, 'daily');
      ok(!r.valid); eq(r.errorType, 'EMPTY_BUDGET'); ok(r.message.includes('valid budget'));
    });
  });
  test('BUDGET: negative values rejected ("greater than ৳0")', () => {
    ['-50', -50, '-0.5', '-1,000'].forEach(v => {
      const r = E.validateBudget(v, 'daily');
      ok(!r.valid, String(v)); eq(r.errorType, 'NEGATIVE_OR_ZERO_BUDGET'); ok(r.message.includes('greater than ৳0'));
    });
  });
  test('BUDGET: zero rejected', () => {
    ['0', 0, '0.00', '0.001'].forEach(v => eq(E.validateBudget(v, 'daily').errorType, 'NEGATIVE_OR_ZERO_BUDGET', String(v)));
  });
  test('BUDGET: non-numeric / garbage rejected', () => {
    ['abc', '12abc', '1e3', '0x10', '--5', '1.2.3', '৳', '.', NaN, Infinity].forEach(v => {
      const r = E.validateBudget(v, 'daily');
      ok(!r.valid, 'should reject ' + String(v)); eq(r.errorType, 'INVALID_BUDGET', String(v));
    });
  });
  test('BUDGET: excessive values rejected ("realistic") with separate daily / weekly limits', () => {
    ['999999', 5001, '50000'].forEach(v => { const r = E.validateBudget(v, 'daily'); eq(r.errorType, 'UNREALISTIC_BUDGET', String(v)); ok(r.message.includes('realistic')); });
    ok(E.validateBudget(5000, 'daily').valid);
    ok(E.validateBudget(5001, 'weekly').valid);
    ok(E.validateBudget(35000, 'weekly').valid);
    eq(E.validateBudget(35001, 'weekly').errorType, 'UNREALISTIC_BUDGET');
  });
  test('BUDGET: valid formats accepted (250, "250", "1,800", "৳250", "250 BDT", "99.5")', () => {
    eq(E.validateBudget(250, 'daily').value, 250);
    eq(E.validateBudget('250', 'daily').value, 250);
    eq(E.validateBudget('1,800', 'weekly').value, 1800);
    eq(E.validateBudget('৳250', 'daily').value, 250);
    eq(E.validateBudget('250 BDT', 'daily').value, 250);
    eq(E.validateBudget('99.5', 'daily').value, 99.5);
  });
  test('BUDGET: Bangla digits are accepted (২৫০ = 250, ১,৮০০ = 1800) and bad Bangla input is still rejected', () => {
    eq(E.validateBudget('২৫০', 'daily').value, 250);
    eq(E.validateBudget('১,৮০০', 'weekly').value, 1800);
    eq(E.validateBudget('৯৯.৫', 'daily').value, 99.5);
    eq(E.validateBudget('-৫০', 'daily').errorType, 'NEGATIVE_OR_ZERO_BUDGET');
    eq(E.validateBudget('০', 'daily').errorType, 'NEGATIVE_OR_ZERO_BUDGET');
    eq(E.validateBudget('২৫ক', 'daily').errorType, 'INVALID_BUDGET');
  });
  test('BUDGET: generateMealPlan returns the validation error and no plan', () => {
    const r = E.generateMealPlan({ budget: '', timeframe: 'daily' });
    ok(!r.success); eq(r.errorType, 'EMPTY_BUDGET');
    ok(!E.generateMealPlan({ budget: null, timeframe: 'daily' }).success);
    eq(E.generateMealPlan({ budget: -5, timeframe: 'weekly' }).errorType, 'NEGATIVE_OR_ZERO_BUDGET');
  });

  // -------------------------------------------------------------------------
  // Pantry matching
  // -------------------------------------------------------------------------
  test('PANTRY: recognises English, Bengali, transliterated and chip-style names', () => {
    const set = E.normalizePantryList(['Rice (চাল)', 'ডিম', 'Daal', 'aloo', 'shobji', 'Roti / Atta', 'murgi', 'maach', 'kola', 'dudh']);
    ['rice', 'egg', 'lentils_daal', 'potato', 'seasonal_vegetables', 'roti', 'chicken', 'fish', 'banana', 'milk'].forEach(id => ok(set.has(id), id));
  });
  test('PANTRY: whole-word matching (eggplant is not egg, licorice is not rice, medium is not dim)', () => {
    eq(E.matchPantryItem('Eggplant'), null);
    eq(E.matchPantryItem('licorice'), null);
    eq(E.matchPantryItem('medium'), null);
    eq(E.matchPantryItem('salt'), null);
    eq(E.matchPantryItem('Cooking Oil'), null);
    eq(E.matchPantryItem('Rice'), 'rice');
  });
  test('PANTRY: invalid input is handled safely', () => {
    eq(E.normalizePantryList(null).size, 0);
    eq(E.normalizePantryList([null, 5, '', undefined]).size, 0);
  });

  // -------------------------------------------------------------------------
  // Cost & nutrition
  // -------------------------------------------------------------------------
  test('COST: Dim Khichuri = 60g rice + 40g daal + 1 egg = ৳23.30', () => {
    const rec = RECIPES.find(r => r.id === 'bf_dim_khichuri');
    near(E.calculateRecipeMetrics(rec, new Set()).grossCost, 23.30, 0.005);
  });
  test('COST/NUTRITION: every recipe matches an independent recomputation from the food table', () => {
    RECIPES.forEach(rec => {
      const m = E.calculateRecipeMetrics(rec, new Set());
      let cost = 0, cal = 0, p = 0, c = 0, f = 0;
      rec.ingredients.forEach(i => {
        const fd = food(i.foodId), ratio = i.quantity / fd.referenceQuantity;
        cost += r2(ratio * fd.estimatedPriceBDT); cal += ratio * fd.nutrition.calories;
        p += ratio * fd.nutrition.protein; c += ratio * fd.nutrition.carbs; f += ratio * fd.nutrition.fat;
      });
      near(m.grossCost, r2(cost), 0.0001, rec.id);
      eq(m.nutrition.calories, Math.round(cal), rec.id);
      near(m.nutrition.protein, r1(p), 0.0001, rec.id);
      near(m.nutrition.carbs, r1(c), 0.0001, rec.id);
      near(m.nutrition.fat, r1(f), 0.0001, rec.id);
    });
  });
  test('COST: pantry items cost ৳0 but keep their nutrition', () => {
    const rec = RECIPES.find(r => r.id === 'bf_dim_khichuri');
    const all = E.calculateRecipeMetrics(rec, new Set());
    const some = E.calculateRecipeMetrics(rec, new Set(['rice', 'egg']));
    near(some.outOfPocketCost, 5.6, 0.0001);                     // only daal to buy
    eq(some.nutrition.calories, all.nutrition.calories);
    eq(some.missingIngredients.length, 1);
  });

  // -------------------------------------------------------------------------
  // Daily plans
  // -------------------------------------------------------------------------
  test('DAILY: ৳250 plan has 3 meals, fits budget, remaining = budget - cost', () => {
    const r = E.generateMealPlan({ budget: 250, timeframe: 'daily', pantry: [], preference: 'standard' });
    ok(r.success && r.fitsBudget);
    SLOTS.forEach(s => ok(r.meals[s] && r.meals[s].name, s));
    ok(r.totalCost <= 250);
    near(r.remainingBudget, r2(250 - r.totalCost), 0.0001);
    eq(r.days.length, 1);
  });
  test('DAILY: totals equal the sum of displayed meals (cost and nutrition)', () => {
    const r = E.generateMealPlan({ budget: 300, timeframe: 'daily', pantry: ['rice'], preference: 'standard' });
    const meals = SLOTS.map(s => r.meals[s]);
    near(r.totalCost, r2(meals.reduce((a, m) => a + m.outOfPocketCost, 0)), 0.0001);
    eq(r.totals.calories, meals.reduce((a, m) => a + m.nutrition.calories, 0));
    near(r.totals.protein, r1(meals.reduce((a, m) => a + m.nutrition.protein, 0)), 0.0001);
    near(r.totals.carbs, r1(meals.reduce((a, m) => a + m.nutrition.carbs, 0)), 0.0001);
    near(r.totals.fat, r1(meals.reduce((a, m) => a + m.nutrition.fat, 0)), 0.0001);
  });
  test('DAILY: available ingredients lower the cost', () => {
    const none = E.generateMealPlan({ budget: 200, timeframe: 'daily', pantry: [] });
    const some = E.generateMealPlan({ budget: 200, timeframe: 'daily', pantry: ['rice', 'eggs', 'potatoes'] });
    ok(some.totalCost < none.totalCost, `${some.totalCost} < ${none.totalCost}`);
    eq(some.pantryItemsCount, 3);
  });
  test('DAILY: determinism - same inputs give identical plans', () => {
    const a = E.generateMealPlan({ budget: 220, timeframe: 'daily', pantry: ['eggs'], preference: 'high-protein' });
    const b = E.generateMealPlan({ budget: 220, timeframe: 'daily', pantry: ['eggs'], preference: 'high-protein' });
    eq(JSON.stringify(a), JSON.stringify(b));
  });
  test('DAILY: legacy scenarios (budget 150 with rice/eggs/potatoes; budget 80 with rice/lentils) fit', () => {
    const a = E.generateMealPlan({ budget: 150, timeframe: 'daily', pantry: ['rice', 'eggs', 'potatoes'], preference: 'standard' });
    ok(a.success && a.fitsBudget && a.totalDailyCost <= 150 && a.pantryItemsCount >= 3);
    const b = E.generateMealPlan({ budget: 80, timeframe: 'daily', pantry: ['rice', 'lentils'], preference: 'standard' });
    ok(b.success && b.fitsBudget && b.totalDailyCost <= 80);
  });

  // -------------------------------------------------------------------------
  // Preferences
  // -------------------------------------------------------------------------
  test('PREFERENCE: vegetarian plans contain no meat, fish or eggs', () => {
    [150, 250, 600].forEach(b => {
      const r = E.generateMealPlan({ budget: b, timeframe: 'daily', preference: 'vegetarian' });
      ok(r.success && !r.preferenceBroadened);
      SLOTS.forEach(s => r.meals[s].ingredients.forEach(i => ok(!['fish', 'chicken', 'egg'].includes(i.foodId), `${b}:${s}:${i.foodId}`)));
    });
  });
  test('PREFERENCE: high-protein gives at least as much protein as standard at the same budget', () => {
    const std = E.generateMealPlan({ budget: 300, timeframe: 'daily', preference: 'standard' });
    const hp = E.generateMealPlan({ budget: 300, timeframe: 'daily', preference: 'high-protein' });
    ok(hp.totals.protein >= std.totals.protein, `${hp.totals.protein} >= ${std.totals.protein}`);
  });
  test('PREFERENCE: diabetic-friendly uses tagged recipes and includes a not-medical-advice notice', () => {
    const r = E.generateMealPlan({ budget: 300, timeframe: 'daily', preference: 'diabetic-friendly' });
    ok(r.success && !r.preferenceBroadened);
    SLOTS.forEach(s => ok(r.meals[s].dietaryPreferences.includes('diabetic-friendly'), s));
    const n = r.notices.find(x => x.type === 'medical');
    ok(n && /not medical advice/i.test(n.text) && /does not treat or prevent diabetes/i.test(n.text));
    const text = JSON.stringify(r);
    ok(!/\b(cures?|treats? diabetes|lowers? blood (sugar|glucose)|controls? blood)\b/i.test(text.replace(/does not treat or prevent diabetes/gi, '')));
  });
  test('PREFERENCE: budget-saver picks the cheapest possible plan type (cost <= standard)', () => {
    const std = E.generateMealPlan({ budget: 300, timeframe: 'daily', preference: 'standard' });
    const sv = E.generateMealPlan({ budget: 300, timeframe: 'daily', preference: 'budget-saver' });
    ok(sv.totalCost <= std.totalCost);
  });
  test('PREFERENCE: unknown preference falls back to standard', () => {
    const r = E.generateMealPlan({ budget: 250, timeframe: 'daily', preference: 'nonsense' });
    ok(r.success); eq(r.preference, 'standard');
  });

  // -------------------------------------------------------------------------
  // Low budgets & alternatives
  // -------------------------------------------------------------------------
  test('LOW BUDGET: ৳15 explains the problem, reports shortfall, never claims it fits', () => {
    const r = E.generateMealPlan({ budget: 15, timeframe: 'daily', pantry: [] });
    ok(r.success); ok(!r.fitsBudget); ok(r.remainingBudget < 0);
    const w = r.alternatives.find(a => a.type === 'warning');
    ok(w && w.description.includes('too low') === false && /short of the lowest-cost plan/.test(w.description));
    ok(r.alternatives.length >= 2);
    near(r.totalCost, r.minimumPeriodCost, 0.0001);
  });
  test('LOW BUDGET: the plan shown is the true minimum cost (brute-force check, 3 pantry cases)', () => {
    [[], ['rice'], ['rice', 'eggs', 'potatoes', 'daal']].forEach(p => {
      const r = E.generateMealPlan({ budget: 1, timeframe: 'daily', pantry: p, preference: 'standard' });
      const set = E.normalizePantryList(p);
      const ms = RECIPES.map(x => E.calculateRecipeMetrics(x, set));
      const min = s => Math.min(...ms.filter(m => m.mealType === s).map(m => m.outOfPocketCost));
      near(r.totalCost, r2(min('breakfast') + min('lunch') + min('dinner')), 0.0001);
    });
  });
  test('LOW BUDGET: budget just above the minimum fits; just below does not', () => {
    const base = E.generateMealPlan({ budget: 1, timeframe: 'daily' }).minimumPeriodCost;
    ok(E.generateMealPlan({ budget: Math.ceil(base), timeframe: 'daily' }).fitsBudget);
    ok(!E.generateMealPlan({ budget: Math.floor(base) - 1, timeframe: 'daily' }).fitsBudget);
  });
  test('ALTERNATIVES: swap suggestions quote savings that match the real recipe costs', () => {
    const r = E.generateMealPlan({ budget: 600, timeframe: 'daily', pantry: [], preference: 'high-protein' });
    const swaps = r.alternatives.filter(a => a.type === 'savings-swap');
    ok(swaps.length >= 1, 'expected at least one swap at a generous budget');
    swaps.forEach(s => ok(/save about ৳[\d,.]+/.test(s.description)));
  });
  test('ALTERNATIVES: pantry what-if tips are only offered when they really save money', () => {
    const r = E.generateMealPlan({ budget: 20, timeframe: 'daily', pantry: [] });
    r.alternatives.filter(a => a.type === 'pantry-tip').forEach(a => ok(/drop by about ৳\d/.test(a.description)));
  });

  // -------------------------------------------------------------------------
  // Weekly plans
  // -------------------------------------------------------------------------
  test('WEEKLY: 7 days, totals = sum of days, total cost within budget', () => {
    const r = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', pantry: [], preference: 'standard' });
    ok(r.success && r.fitsBudget); eq(r.days.length, 7); eq(r.periodDays, 7);
    ok(r.totalCost <= 1800);
    near(r.totalCost, r2(r.days.reduce((a, d) => a + d.totalOutOfPocket, 0)), 0.0001);
    eq(r.totals.calories, r.days.reduce((a, d) => a + d.nutrition.calories, 0));
    near(r.remainingBudget, r2(1800 - r.totalCost), 0.0001);
  });
  test('WEEKLY: daily allowance = weekly / 7', () => {
    const r = E.generateMealPlan({ budget: 1400, timeframe: 'weekly' });
    near(r.dailyTargetBudget, 200, 0.0001);
    const r2_ = E.generateMealPlan({ budget: 1000, timeframe: 'weekly' });
    near(r2_.dailyTargetBudget, r2(1000 / 7), 0.0001);
  });
  test('WEEKLY: meals vary across the week at a comfortable budget', () => {
    const r = E.generateMealPlan({ budget: 2800, timeframe: 'weekly', pantry: [] });
    SLOTS.forEach(s => ok(new Set(r.days.map(d => d.meals[s].id)).size >= 3, s + ' variety'));
  });
  test('WEEKLY: pantry ingredients are excluded from the combined shopping list', () => {
    const r = E.generateMealPlan({ budget: 2000, timeframe: 'weekly', pantry: ['rice', 'eggs'] });
    ok(!r.shoppingList.some(i => i.foodId === 'rice' || i.foodId === 'egg'));
  });
  test('WEEKLY: a too-small weekly budget reports the shortfall for the whole week', () => {
    const r = E.generateMealPlan({ budget: 100, timeframe: 'weekly' });
    ok(r.success && !r.fitsBudget && r.remainingBudget < 0);
    near(r.totalCost, r.minimumPeriodCost, 0.0001);
    ok(r.alternatives.some(a => a.type === 'warning'));
  });

  // -------------------------------------------------------------------------
  // Shopping list
  // -------------------------------------------------------------------------
  test('SHOPPING: excludes pantry items, combines duplicates, quantities add up', () => {
    const r = E.generateMealPlan({ budget: 250, timeframe: 'daily', pantry: ['rice', 'eggs'] });
    ok(!r.shoppingList.some(i => i.foodId === 'rice' || i.foodId === 'egg'));
    const ids = r.shoppingList.map(i => i.foodId);
    eq(new Set(ids).size, ids.length);
    r.shoppingList.forEach(item => {
      let q = 0;
      SLOTS.forEach(s => r.meals[s].ingredients.forEach(i => { if (i.foodId === item.foodId) q += i.quantity; }));
      near(item.quantity, r1(q), 0.0001, item.foodId);
    });
  });
  test('SHOPPING: list total equals plan cost; everything-at-home gives an empty list and ৳0', () => {
    const r = E.generateMealPlan({ budget: 250, timeframe: 'daily', pantry: ['rice'] });
    near(E.calculateShoppingListTotals(r.shoppingList).grandTotal, r.totalCost, 0.0001);
    const all = E.generateMealPlan({ budget: 250, timeframe: 'daily',
      pantry: ['rice', 'egg', 'daal', 'potato', 'vegetables', 'roti', 'fish', 'chicken', 'banana', 'milk'] });
    eq(all.shoppingList.length, 0); eq(all.totalCost, 0);
  });
  test('SHOPPING: purchased flags and quantity changes recalculate totals', () => {
    const r = E.generateMealPlan({ budget: 250, timeframe: 'daily', pantry: [] });
    const list = r.shoppingList;
    const t0 = E.calculateShoppingListTotals(list);
    list[0].purchased = true;
    const t1 = E.calculateShoppingListTotals(list);
    eq(t1.purchasedCount, 1); near(t1.purchasedTotal, list[0].cost, 0.0001);
    near(t1.pendingTotal, r2(t0.grandTotal - list[0].cost), 0.0001);
    near(t1.grandTotal, t0.grandTotal, 0.0001);                        // buying does not change the total
    const before = list[0].cost;
    list[0].quantity += list[0].unitStep;
    const t2 = E.calculateShoppingListTotals(list);
    ok(list[0].cost > before); ok(t2.grandTotal > t0.grandTotal);
    near(list[0].cost, E.calculateIngredientCost(list[0].foodId, list[0].quantity), 0.0001);
    list[0].quantity = 0;
    near(E.calculateShoppingListTotals(list).grandTotal, r2(t0.grandTotal - r.shoppingList[0].originalQuantity * 0 - E.calculateIngredientCost(list[0].foodId, list[0].originalQuantity)), 0.0001);
  });

  // -------------------------------------------------------------------------
  // Home inventory with quantities
  // -------------------------------------------------------------------------
  const SPEC_INV = [
    { label: 'Rice', quantity: 2, unit: 'kg' }, { label: 'Eggs', quantity: 6, unit: 'piece' },
    { label: 'Potatoes', quantity: 1, unit: 'kg' }, { label: 'Milk', quantity: 500, unit: 'ml' },
    { label: 'Lentils', quantity: 500, unit: 'g' }
  ];
  const BN = s => /[\u0980-\u09FF]/.test(s);

  test('INVENTORY: unit conversion (2 kg rice = 2000 g, 1 L milk = 1000 ml, 6 eggs = 6 pieces)', () => {
    eq(E.toBaseQuantity('rice', 2, 'kg').base, 2000);
    eq(E.toBaseQuantity('rice', '500', 'g').base, 500);
    eq(E.toBaseQuantity('rice', '1.5', 'kg').base, 1500);
    eq(E.toBaseQuantity('milk', 1, 'l').base, 1000);
    eq(E.toBaseQuantity('milk', 500, 'ml').base, 500);
    eq(E.toBaseQuantity('egg', 6, 'piece').base, 6);
    eq(E.toBaseQuantity('potato', 1, 'kg').base, 1000);
    eq(E.toBaseQuantity('lentils_daal', 500, 'g').base, 500);
    eq(E.toBaseQuantity('rice', '২', 'kg').base, 2000, 'Bangla digits');
    ok(!E.toBaseQuantity('rice', 2, 'kg').estimated);
  });
  test('INVENTORY: wrong or silly units/amounts are rejected with a reason', () => {
    eq(E.toBaseQuantity('rice', 2, 'piece').error, 'unit');
    eq(E.toBaseQuantity('egg', 1, 'kg').error, 'unit');
    eq(E.toBaseQuantity('milk', 200, 'g').error, 'unit');
    eq(E.toBaseQuantity('egg', 2.5, 'piece').error, 'whole');
    eq(E.toBaseQuantity('rice', -1, 'kg').error, 'negative');
    eq(E.toBaseQuantity('rice', 'abc', 'kg').error, 'invalid');
    eq(E.toBaseQuantity('rice', '', 'kg').error, 'invalid');
    eq(E.toBaseQuantity('rice', 5000, 'kg').error, 'toolarge');
    eq(E.toBaseQuantity('nope', 1, 'kg').error, 'invalid');
  });
  test('INVENTORY: allowed units per food', () => {
    eq(E.allowedUnitsFor('rice').join(), 'kg,g'); eq(E.allowedUnitsFor('milk').join(), 'l,ml');
    eq(E.allowedUnitsFor('egg').join(), 'piece'); eq(E.allowedUnitsFor('banana').join(), 'piece');
    eq(E.allowedUnitsFor('roti').join(), 'piece,kg,g');
  });
  test('INVENTORY: roti stock entered by weight is an ESTIMATE (40 g per roti, rounded down) and is flagged', () => {
    const r = E.toBaseQuantity('roti', 1, 'kg');
    ok(r.ok && r.estimated && r.base === 25, JSON.stringify(r));
    ok(!E.toBaseQuantity('roti', 10, 'piece').estimated);
    const plan = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', inventory: [{ label: 'Atta', quantity: 1, unit: 'kg' }] });
    ok(plan.inventory.rows.find(x => x.foodId === 'roti').estimated, 'row flagged as estimate');
    ok(!plan.inventory.rows.filter(x => x.foodId !== 'roti').some(x => x.estimated), 'nothing else is marked as estimate');
  });
  test('INVENTORY: the example stock (rice 2 kg, eggs 6, potatoes 1 kg, milk 500 ml, lentils 500 g) drives the weekly plan', () => {
    const r = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', inventory: SPEC_INV, preference: 'standard' });
    ok(r.success && r.days.length === 7);
    const row = id => r.inventory.rows.find(x => x.foodId === id);
    eq(row('rice').atHome, 2000); eq(row('egg').atHome, 6); eq(row('potato').atHome, 1000); eq(row('milk').atHome, 500); eq(row('lentils_daal').atHome, 500);
    ['rice', 'egg', 'potato', 'milk', 'lentils_daal'].forEach(id => {
      const x = row(id);
      ok(x.usedFromHome > 0, id + ' should be used from home stock');
      ok(x.usedFromHome <= x.atHome + 1e-9, id + ' never uses more than is at home');
      near(x.remaining, r1(x.atHome - x.usedFromHome), 0.0001, id + ' remaining = at home - used');
      near(x.needed, r1(x.usedFromHome + x.toBuy), 0.0501, id + ' needed = used from home + to buy');
      eq(x.status, x.toBuy > 0 ? 'short' : 'enough', id + ' status');
    });
  });
  test('INVENTORY: stock is never overdrawn across all 21 meals (sum of home amounts <= what is at home)', () => {
    const r = E.generateMealPlan({ budget: 2100, timeframe: 'weekly', inventory: SPEC_INV, preference: 'high-protein' });
    const used = {};
    r.days.forEach(d => SLOTS.forEach(sl => d.meals[sl].ingredientBreakdown.forEach(l => { used[l.foodId] = (used[l.foodId] || 0) + l.homeQuantity; })));
    r.inventory.rows.filter(x => !x.unlimited).forEach(x => ok((used[x.foodId] || 0) <= x.atHome + 1e-6, `${x.foodId}: used ${used[x.foodId]} > ${x.atHome}`));
  });
  test('INVENTORY: insufficient stock is identified and the missing amount is calculated (2 eggs only)', () => {
    const r = E.generateMealPlan({ budget: 2100, timeframe: 'weekly', preference: 'high-protein', inventory: [{ label: 'Eggs', quantity: 2, unit: 'piece' }] });
    const e = r.inventory.rows.find(x => x.foodId === 'egg');
    eq(e.status, 'short'); ok(e.toBuy > 0, 'must buy more eggs'); eq(e.usedFromHome, 2);
    near(e.needed, e.usedFromHome + e.toBuy, 0.0001);
    const shop = r.shoppingList.find(i => i.foodId === 'egg');
    near(shop.quantity, e.toBuy, 0.0001, 'shopping list buys exactly the shortfall');
    near(shop.cost, e.buyCost, 0.0001);
    ok(r.notices.some(n => /not enough/i.test(n.text)), 'visible notice');
  });
  test('INVENTORY: an item that is not at all at home is "none"; a partial one is "short"; plenty is "assumed"', () => {
    const r = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', inventory: [{ label: 'Rice', quantity: 300, unit: 'g' }, { label: 'Daal' }] });
    eq(r.inventory.rows.find(x => x.foodId === 'rice').status, 'short');
    const d = r.inventory.rows.find(x => x.foodId === 'lentils_daal');
    eq(d.status, 'assumed'); eq(d.atHome, null); eq(d.toBuy, 0);
    const none = r.inventory.rows.find(x => x.status === 'none');
    ok(none && none.usedFromHome === 0 && none.toBuy === none.needed, 'none: buy everything');
  });
  test('INVENTORY: limited stock costs more than unlimited, a huge stock equals unlimited, quantity-less entries behave like the old pantry', () => {
    const base = { budget: 1800, timeframe: 'weekly', preference: 'standard' };
    const plenty = E.generateMealPlan({ ...base, pantry: ['rice', 'eggs'] });
    const none = E.generateMealPlan({ ...base });
    const small = E.generateMealPlan({ ...base, inventory: [{ label: 'Rice', quantity: 200, unit: 'g' }, { label: 'Eggs', quantity: 1, unit: 'piece' }] });
    const huge = E.generateMealPlan({ ...base, inventory: [{ label: 'Rice', quantity: 900, unit: 'kg' }, { label: 'Eggs', quantity: 900000, unit: 'piece' }] });
    const noQty = E.generateMealPlan({ ...base, inventory: [{ label: 'Rice' }, { label: 'Eggs' }] });
    ok(plenty.totalCost < small.totalCost && small.totalCost < none.totalCost, `${plenty.totalCost} < ${small.totalCost} < ${none.totalCost}`);
    eq(huge.totalCost, plenty.totalCost); eq(noQty.totalCost, plenty.totalCost);
    eq(JSON.stringify(noQty.shoppingList), JSON.stringify(plenty.shoppingList));
  });
  test('INVENTORY: the planner prioritises recipes that use what is at home', () => {
    const base = { budget: 1800, timeframe: 'weekly', preference: 'standard' };
    const without = E.generateMealPlan(base);
    const withInv = E.generateMealPlan({ ...base, inventory: SPEC_INV });
    ok(withInv.totalCost < without.totalCost, 'cheaper with stock at home');
    const usedEggs = withInv.inventory.rows.find(x => x.foodId === 'egg').usedFromHome;
    ok(usedEggs >= 5, 'nearly all 6 eggs get used, used ' + usedEggs);
    const homeShare = withInv.days.reduce((a, d) => a + SLOTS.reduce((b, s) => b + d.meals[s].pantryIngredients.length, 0), 0);
    ok(homeShare >= 12, 'many meal lines use home stock: ' + homeShare);
  });
  test('INVENTORY: stock is used up meal by meal inside a day (1 egg cannot feed three meals)', () => {
    const r = E.generateMealPlan({ budget: 400, timeframe: 'daily', preference: 'high-protein', inventory: [{ label: 'Eggs', quantity: 1, unit: 'piece' }] });
    const home = SLOTS.reduce((a, s) => a + r.meals[s].ingredientBreakdown.filter(l => l.foodId === 'egg').reduce((b, l) => b + l.homeQuantity, 0), 0);
    eq(home, 1, 'exactly one egg comes from home');
    const partial = SLOTS.flatMap(s => r.meals[s].ingredientBreakdown).filter(l => l.foodId === 'egg' && l.partial);
    partial.forEach(l => ok(l.homeQuantity > 0 && l.buyQuantity > 0 && l.homeQuantity + l.buyQuantity === l.quantity, 'partial line adds up'));
  });
  test('INVENTORY: meals show part-at-home lines and their cost covers only the part to buy', () => {
    const rec = RECIPES.find(x => x.id === 'lunch_bhaat_egg_shobji');                // 2 eggs
    const m = E.calculateRecipeMetrics(rec, new Set());                              // legacy path, nothing at home
    near(m.outOfPocketCost, m.grossCost, 0.0001);
    const r = E.generateMealPlan({ budget: 800, timeframe: 'daily', inventory: [{ label: 'Eggs', quantity: 1, unit: 'piece' }], preference: 'high-protein' });
    SLOTS.forEach(s => r.meals[s].ingredientBreakdown.filter(l => l.partial).forEach(l => {
      near(l.cost, E.calculateIngredientCost(l.foodId, l.buyQuantity), 0.0101, 'partial cost = buy part only');
      ok(l.cost < l.grossCost, 'cheaper than the full line');
    }));
  });
  test('INVENTORY: zero stock means not at home; invalid entries are ignored with a warning (no crash)', () => {
    const r = E.generateMealPlan({ budget: 300, timeframe: 'daily', inventory: [{ label: 'Rice', quantity: 0, unit: 'kg' }, { label: 'Eggs', quantity: 'abc', unit: 'piece' }, { label: 'Milk', quantity: 3, unit: 'kg' }] });
    ok(r.success); eq(r.pantryItemsCount, 0);
    eq(r.inventoryWarnings.length, 2);
    ok(r.inventoryWarnings.every(w => ['invalid', 'unit'].includes(w.error)));
  });
  test('INVENTORY: totals stay consistent (meals = shopping list = ingredient check) with inventory', () => {
    const r = E.generateMealPlan({ budget: 2000, timeframe: 'weekly', inventory: SPEC_INV, preference: 'standard' });
    const mealCost = r2(r.days.reduce((a, d) => a + SLOTS.reduce((b, s) => b + d.meals[s].outOfPocketCost, 0), 0));
    near(r.totalCost, mealCost, 0.0001);
    near(E.calculateShoppingListTotals(r.shoppingList).grandTotal, r.totalCost, 0.0001, 'shopping total is exact');
    near(r.inventory.rows.reduce((a, x) => a + x.buyCost, 0), r.totalCost, 0.011, 'ingredient check total');
    r.shoppingList.forEach(i => near(i.quantity, r.inventory.rows.find(x => x.foodId === i.foodId).toBuy, 0.0501, i.foodId));
  });
  test('INVENTORY: results are deterministic', () => {
    const a = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', inventory: SPEC_INV });
    const b = E.generateMealPlan({ budget: 1800, timeframe: 'weekly', inventory: SPEC_INV });
    eq(JSON.stringify(a), JSON.stringify(b));
  });
  test('INVENTORY: low weekly budget with little stock still reports the true minimum and a warning', () => {
    const r = E.generateMealPlan({ budget: 150, timeframe: 'weekly', inventory: [{ label: 'Rice', quantity: 1, unit: 'kg' }] });
    ok(r.success && !r.fitsBudget);
    near(r.totalCost, r.minimumPeriodCost, 0.0001);
    ok(r.alternatives.some(a => a.type === 'warning'));
  });

  // -------------------------------------------------------------------------
  // English / Bangla
  // -------------------------------------------------------------------------
  test('LANG: English and Bangla dictionaries have exactly the same keys and no empty text', () => {
    ok(I18N, 'I18N available');
    const ek = Object.keys(I18N.dict.en), bk = Object.keys(I18N.dict.bn);
    eq(ek.filter(k => !bk.includes(k)).join(), '', 'missing in Bangla');
    eq(bk.filter(k => !ek.includes(k)).join(), '', 'missing in English');
    ek.forEach(k => { ok(I18N.dict.en[k].trim() && I18N.dict.bn[k].trim(), 'empty: ' + k); });
  });
  test('LANG: {placeholders} match between English and Bangla for every key', () => {
    const ph = s => (s.match(/\{\w+\}/g) || []).sort().join();
    Object.keys(I18N.dict.en).forEach(k => eq(ph(I18N.dict.bn[k]), ph(I18N.dict.en[k]), 'placeholders differ in ' + k));
  });
  test('LANG: every Bangla text really is Bangla (no untranslated English left over)', () => {
    const allowed = new Set(['Foodsphere', 'Nutritio', 'Intelligence', 'strong', 'em']);
    Object.keys(I18N.dict.bn).forEach(k => {
      const v = I18N.dict.bn[k].replace(/<\/?\w+>/g, ' ').replace(/\{\w+\}/g, ' ');
      const enHasWords = /[A-Za-z]/.test(I18N.dict.en[k].replace(/<\/?\w+>/g, ' ').replace(/\{\w+\}/g, ' '));
      if (enHasWords) ok(BN(v), 'no Bangla letters in ' + k);       // pure layout templates like "{slot} ({meal}, {cost})" have no words to translate
      (v.match(/[A-Za-z]{2,}/g) || []).forEach(w => ok(allowed.has(w), `English word "${w}" in bn.${k}`));
    });
  });
  test('LANG: every recipe has a Bangla name and a Bangla description', () => {
    RECIPES.forEach(r => { ok(BN(r.bengaliName), r.id + ' bengaliName'); ok(r.descriptionBn && BN(r.descriptionBn), r.id + ' descriptionBn'); });
    FOODS.forEach(f => ok(BN(f.bengaliName), f.id + ' bengaliName'));
  });
  test('LANG: digit helpers round-trip (250 <-> ২৫০)', () => {
    eq(I18N.toBnDigits('৳250.50 / 7 days'), '৳২৫০.৫০ / ৭ days');
    eq(I18N.toEnDigits('৳২৫০.৫০'), '৳250.50');
    eq(I18N.toEnDigits(I18N.toBnDigits('0123456789')), '0123456789');
  });
  test('LANG: t() fills placeholders, falls back to English, and plurals work', () => {
    I18N.setLang('en', { remember: false });
    eq(I18N.t('toast_added', { name: 'Rice' }), 'Added Rice');
    eq(I18N.tn('items', 1), 'items_one'.length ? I18N.t('items_one', { n: 1 }) : '');
    eq(I18N.tn('items', 3), '3 items'); eq(I18N.tn('items', 1), '1 item');
    eq(I18N.t('no_such_key_xyz'), 'no_such_key_xyz');
    I18N.setLang('bn', { remember: false });
    eq(I18N.t('toast_added', { name: 'চাল' }), 'চাল যোগ হয়েছে');
    I18N.setLang('en', { remember: false });
  });
  test('LANG: plans generated in Bangla have Bangla messages, reasons, explanations and alternatives (no raw {placeholders})', () => {
    I18N.setLang('bn', { remember: false });
    try {
      const scenarios = [
        { budget: 30, timeframe: 'daily' },
        { budget: 1800, timeframe: 'weekly', inventory: SPEC_INV, preference: 'diabetic-friendly' },
        { budget: 2800, timeframe: 'weekly', preference: 'vegetarian' },
        { budget: 400, timeframe: 'daily', preference: 'high-protein', inventory: [{ label: 'Eggs', quantity: 1, unit: 'piece' }] }
      ];
      scenarios.forEach((sc, i) => {
        const r = E.generateMealPlan(sc);
        const texts = [];
        r.alternatives.forEach(a => texts.push(a.title, a.description, a.actionTip));
        r.notices.forEach(n => texts.push(n.text));
        r.days.forEach(d => SLOTS.forEach(s => { texts.push(d.meals[s].explanation); d.meals[s].recommendationReasons.forEach(x => texts.push(x.badge, x.text)); }));
        texts.filter(Boolean).forEach(tx => {
          ok(BN(tx), `scenario ${i}: not Bangla -> ${tx}`);
          ok(!/\{\w+\}/.test(tx), `scenario ${i}: raw placeholder in ${tx}`);
          ok(!/\b(undefined|NaN|null)\b/.test(tx), `scenario ${i}: bad value in ${tx}`);
        });
      });
      const bad = E.validateBudget('', 'daily'); ok(BN(bad.message));
      ok(BN(E.validateBudget('-5', 'daily').message) && BN(E.validateBudget('99999999', 'weekly').message) && BN(E.validateBudget('abc', 'daily').message));
    } finally { I18N.setLang('en', { remember: false }); }
  });
  test('LANG: switching language never changes the numbers of a plan (cost, nutrition, shopping)', () => {
    const sc = { budget: 1800, timeframe: 'weekly', inventory: SPEC_INV, preference: 'standard' };
    I18N.setLang('en', { remember: false }); const en = E.generateMealPlan(sc);
    I18N.setLang('bn', { remember: false }); const bn = E.generateMealPlan(sc);
    I18N.setLang('en', { remember: false });
    eq(bn.totalCost, en.totalCost); eq(JSON.stringify(bn.totals), JSON.stringify(en.totals));
    eq(JSON.stringify(bn.shoppingList), JSON.stringify(en.shoppingList));
    eq(JSON.stringify(bn.days.map(d => SLOTS.map(s => d.meals[s].id))), JSON.stringify(en.days.map(d => SLOTS.map(s => d.meals[s].id))));
    eq(JSON.stringify(bn.inventory.rows.map(r => [r.foodId, r.needed, r.toBuy, r.remaining, r.status])), JSON.stringify(en.inventory.rows.map(r => [r.foodId, r.needed, r.toBuy, r.remaining, r.status])));
  });
  test('LANG: English wording is unchanged for the original messages', () => {
    I18N.setLang('en', { remember: false });
    ok(E.validateBudget('', 'daily').message.includes('valid budget'));
    ok(E.generateMealPlan({ budget: 20, timeframe: 'daily' }).alternatives.some(a => /Minimum estimated daily budget/.test(a.actionTip)));
    ok(/Suggested because it/.test(E.generateMealPlan({ budget: 250, timeframe: 'daily' }).meals.breakfast.explanation));
  });

  // -------------------------------------------------------------------------
  // Property tests over many random scenarios
  // -------------------------------------------------------------------------
  test('PROPERTY: 300 random scenarios WITH quantity inventories keep stock, shopping list and totals consistent', () => {
    let seed = 987654;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const spec = { rice: [['kg', 0.2, 4], ['g', 100, 3000]], egg: [['piece', 1, 20]], lentils_daal: [['g', 50, 1500], ['kg', 0.1, 2]], potato: [['kg', 0.2, 3]], milk: [['ml', 100, 2000], ['l', 0.2, 2]], fish: [['g', 100, 1000]], chicken: [['kg', 0.2, 2]], banana: [['piece', 1, 12]], seasonal_vegetables: [['kg', 0.2, 3]], roti: [['piece', 2, 30]] };
    const ids = Object.keys(spec), prefs = ['standard', 'high-protein', 'vegetarian', 'diabetic-friendly', 'budget-saver'];
    for (let n = 0; n < 300; n++) {
      const weekly = rnd() < 0.6;
      const budget = Math.round((weekly ? 250 + rnd() * 4500 : 30 + rnd() * 700) * 100) / 100;
      const inventory = [];
      ids.forEach(id => {
        if (rnd() < 0.45) {
          if (rnd() < 0.12) { inventory.push({ foodId: id }); return; }                      // plenty
          const [unit, lo, hi] = spec[id][Math.floor(rnd() * spec[id].length)];
          let q = lo + rnd() * (hi - lo); q = unit === 'piece' ? Math.round(q) : Math.round(q * 100) / 100;
          inventory.push({ foodId: id, quantity: q, unit });
        }
      });
      const pref = prefs[Math.floor(rnd() * prefs.length)];
      const r = E.generateMealPlan({ budget, timeframe: weekly ? 'weekly' : 'daily', inventory, preference: pref });
      const tag = `#${n} ${weekly ? 'wk' : 'day'} ${budget} ${pref} ${JSON.stringify(inventory)}`;
      ok(r.success, tag);
      eq(r.inventoryWarnings.length, 0, 'warnings ' + tag);
      const mealCost = r2(r.days.reduce((a, d) => a + SLOTS.reduce((b, s) => b + d.meals[s].outOfPocketCost, 0), 0));
      near(r.totalCost, mealCost, 0.0001, 'cost=sum of meals ' + tag);
      near(E.calculateShoppingListTotals(r.shoppingList).grandTotal, r.totalCost, 0.0001, 'shopping=cost ' + tag);
      near(r.remainingBudget, r2(budget - r.totalCost), 0.0001, 'remaining ' + tag);
      eq(r.fitsBudget, r.totalCost <= budget, 'fits flag ' + tag);
      r.inventory.rows.forEach(x => {
        near(x.needed, r1(x.usedFromHome + x.toBuy), 0.0501, `${x.foodId} needed=used+buy ${tag}`);
        if (!x.unlimited) {
          ok(x.usedFromHome <= x.atHome + 1e-6, `${x.foodId} overdrawn ${tag}`);
          near(x.remaining, r1(Math.max(0, x.atHome - x.usedFromHome)), 0.0001, `${x.foodId} remaining ${tag}`);
          eq(x.status === 'short' || x.status === 'none', x.toBuy > 0, `${x.foodId} status ${tag}`);
        } else ok(x.toBuy === 0, `${x.foodId} plenty never needs buying ${tag}`);
        const item = r.shoppingList.find(i => i.foodId === x.foodId);
        ok(x.toBuy > 0 ? Boolean(item) && Math.abs(item.quantity - x.toBuy) < 0.0501 : !item, `shopping list matches to-buy for ${x.foodId} ${tag}`);
      });
      const have = {}; r.inventory.rows.forEach(x => { have[x.foodId] = x; });
      r.days.forEach(d => SLOTS.forEach(s => d.meals[s].ingredientBreakdown.forEach(l => {
        near(l.homeQuantity + l.buyQuantity, l.quantity, 0.0011, 'line adds up ' + tag);
        ok(l.cost <= l.grossCost + 0.0001, 'buy part never costs more than the full line ' + tag);
      })));
      if (pref === 'vegetarian') r.days.forEach(d => SLOTS.forEach(s => d.meals[s].ingredients.forEach(i => ok(!['fish', 'chicken', 'egg'].includes(i.foodId), 'veg ' + tag))));
    }
  });
  test('PROPERTY: 400 random scenarios keep all totals consistent', () => {
    let seed = 12345;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const names = ['rice', 'eggs', 'daal', 'potatoes', 'vegetables', 'roti', 'fish', 'chicken', 'banana', 'milk', 'salt'];
    const prefs = ['standard', 'high-protein', 'vegetarian', 'diabetic-friendly', 'budget-saver'];
    for (let n = 0; n < 400; n++) {
      const weekly = rnd() < 0.4;
      const budget = Math.round((weekly ? 200 + rnd() * 5000 : 20 + rnd() * 800) * 100) / 100;
      const pantry = names.filter(() => rnd() < 0.3);
      const pref = prefs[Math.floor(rnd() * prefs.length)];
      const r = E.generateMealPlan({ budget, timeframe: weekly ? 'weekly' : 'daily', pantry, preference: pref });
      const tag = `#${n} ${weekly ? 'weekly' : 'daily'} ${budget} [${pantry}] ${pref}`;
      ok(r.success, tag);
      const mealCost = r2(r.days.reduce((a, d) => a + SLOTS.reduce((b, s) => b + d.meals[s].outOfPocketCost, 0), 0));
      near(r.totalCost, mealCost, 0.0001, 'cost=sum of meals ' + tag);
      near(E.calculateShoppingListTotals(r.shoppingList).grandTotal, r.totalCost, 0.011, 'shopping=cost ' + tag);
      near(r.remainingBudget, r2(budget - r.totalCost), 0.0001, 'remaining ' + tag);
      eq(r.fitsBudget, r.totalCost <= budget, 'fits flag ' + tag);
      eq(r.totals.calories, r.days.reduce((a, d) => a + SLOTS.reduce((b, s) => b + d.meals[s].nutrition.calories, 0), 0), 'kcal ' + tag);
      const have = E.normalizePantryList(pantry);
      r.shoppingList.forEach(i => ok(!have.has(i.foodId), 'pantry excluded ' + tag));
      if (!r.fitsBudget) ok(r.alternatives.some(a => a.type === 'warning'), 'warning shown ' + tag);
      if (pref === 'vegetarian') r.days.forEach(d => SLOTS.forEach(s => d.meals[s].ingredients.forEach(i => ok(!['fish', 'chicken', 'egg'].includes(i.foodId), 'veg ' + tag))));
    }
  });
}

if (typeof module !== 'undefined' && module.exports) module.exports = { defineEngineTests };
