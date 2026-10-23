/**
 * Foodsphere Nutritio Intelligence - Budget-Aware Meal Planner
 * UI controller: connects the page to MealPlannerEngine.
 *
 * Plain JavaScript, no frameworks. All numbers shown on screen come from the engine
 * (js/plannerEngine.js) which uses data/foods.js and data/recipes.js.
 * All words shown on screen come from js/i18n.js (English / Bangla).
 */

function initApp() {
  'use strict';

  const E = MealPlannerEngine;
  const SLOTS = E.SLOTS;
  I18N.init();                                   // restores the saved language (English by default)
  const t = (key, params) => I18N.t(key, params);
  const tn = (key, n, params) => I18N.tn(key, n, params);
  const isBn = () => I18N.lang === 'bn';

  // ------------------------------------------------------------------ state
  const state = {
    timeframe: 'daily',
    pantry: [],            // home food: [{ label, foodId|null, quantity:'' (= plenty), unit }]
    plan: null,            // last engine result (shoppingList is edited in place)
    lastParams: null,      // inputs of the last plan (used to redraw it in another language)
    activeDay: 0,
    loading: false
  };

  const PRESETS = {
    daily: [150, 250, 400, 600],
    weekly: [1000, 1800, 2800, 4500]
  };
  const REF = { calories: 2000, protein: 60, carbs: 280, fat: 60 };   // generic reference day (illustration only)
  const ALL_UNITS = ['kg', 'g', 'l', 'ml', 'piece'];

  // ------------------------------------------------------------------ DOM
  const $ = id => document.getElementById(id);
  const form = $('mealPlannerForm');
  const toggleDaily = $('toggleDaily'), toggleWeekly = $('toggleWeekly');
  const budgetInput = $('budgetInput'), budgetWrapper = $('budgetWrapper');
  const budgetLabelText = $('budgetLabelText'), budgetHint = $('budgetHint'), budgetError = $('budgetError');
  const budgetPresets = $('budgetPresets');
  const ingredientInput = $('ingredientInput'), btnAddIngredient = $('btnAddIngredient');
  const ingredientQty = $('ingredientQty'), ingredientUnit = $('ingredientUnit');
  const pantryTagsList = $('pantryTagsList'), pantryMessage = $('pantryMessage'), pantryNote = $('pantryNote');
  const quickStaples = $('quickStaples');
  const prefGroup = $('dietPreference'), medicalNote = $('medicalNote');
  const btnGenerate = $('btnGenerate'), btnGenerateLabel = $('btnGenerateLabel'), btnReset = $('btnReset');
  const resultsPanel = $('resultsPanel'), emptyHero = $('emptyHero'), resultsContent = $('resultsContent');
  const statusBox = $('formStatusBox'), statusText = $('formStatusText'), statusIcon = $('formStatusIcon');
  const dayTabs = $('dayTabs'), weekCard = $('weekCard'), weekChart = $('weekChart'), weekMenu = $('weekMenu');
  const mealCards = { breakfast: $('breakfastCard'), lunch: $('lunchCard'), dinner: $('dinnerCard') };
  const shoppingListContainer = $('shoppingListContainer'), shoppingCountBadge = $('shoppingCountBadge'), shoppingSubtitle = $('shoppingSubtitle');
  const alternativesListContainer = $('alternativesListContainer');
  const inventorySummary = $('inventorySummary'), inventoryCheckBody = $('inventoryCheckBody');
  const toastRegion = $('toastRegion');
  const langButtons = Array.from(document.querySelectorAll('.lang-btn'));

  let debounceTimer = null;
  let qtyTimer = null;

  // ------------------------------------------------------------------ helpers
  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }
  const money = n => '৳' + (Math.round((Number(n) + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = n => '৳' + (Math.round((Number(n) + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const bdt = () => t('currency_suffix');
  const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
  const num = v => Number((Math.round((Number(v) + Number.EPSILON) * 100) / 100).toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const slotLabel = s => t('slot_' + s);
  const unitLabel = u => t('unit_' + u);
  const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentPreference = () => (form.querySelector('input[name="preference"]:checked') || { value: 'standard' }).value;
  const food = id => getFoodItemById(id);
  const foodLabel = id => { const f = food(id); return f ? (isBn() ? f.bengaliName : (f.shortName || f.name)) : id; };

  /** "60 g", "1.2 kg", "2 pcs", "500 ml", "1.5 L" in the current language (input is in the food's base unit). */
  function formatQty(q, unit) {
    q = Number(q);
    if (unit === 'g') return q >= 1000 ? t('q_kg', { n: num(q / 1000) }) : t('q_g', { n: num(q) });
    if (unit === 'ml') return q >= 1000 ? t('q_l', { n: num(q / 1000) }) : t('q_ml', { n: num(q) });
    if (unit === 'piece') return tn('q_piece', q, { n: num(q) });
    return `${num(q)} ${unit}`;
  }
  const mealTitle = m => (isBn() ? (m.bengaliName || m.name) : m.name);
  const mealSubtitle = m => (isBn() ? '' : (m.bengaliName || ''));
  const mealDesc = m => (isBn() && m.descriptionBn ? m.descriptionBn : m.description);
  const itemName = i => (isBn() ? (i.bengaliName || i.shortName) : i.shortName);

  function toast(message, kind) {
    const el = document.createElement('div');
    el.className = 'toast' + (kind === 'warn' ? ' warn' : '');
    el.textContent = message;
    toastRegion.appendChild(el);
    while (toastRegion.children.length > 3) toastRegion.removeChild(toastRegion.firstChild);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 2600);
  }

  // ------------------------------------------------------------------ budget
  function showBudgetError(msg) {
    budgetError.textContent = msg;
    budgetError.hidden = false;
    budgetWrapper.classList.add('invalid');
    budgetInput.setAttribute('aria-invalid', 'true');
  }
  function clearBudgetError() {
    budgetError.textContent = '';
    budgetError.hidden = true;
    budgetWrapper.classList.remove('invalid');
    budgetInput.removeAttribute('aria-invalid');
  }

  function updateBudgetHint() {
    const weekly = state.timeframe === 'weekly';
    let text = t(weekly ? 'hint_weekly' : 'hint_daily');
    const v = E.validateBudget(budgetInput.value, state.timeframe);
    if (weekly && v.valid) text = t('hint_conv', { amount: money0(v.value), perday: money(v.value / 7) });
    budgetHint.textContent = text;
  }

  function renderBudgetPresets() {
    budgetPresets.innerHTML = '';
    PRESETS[state.timeframe].forEach(value => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn';
      btn.dataset.value = String(value);
      btn.textContent = money0(value);
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        budgetInput.value = String(value);
        clearBudgetError();
        syncPresetPressed();
        updateBudgetHint();
        if (state.plan) runPlan({ quiet: true });
      });
      budgetPresets.appendChild(btn);
    });
    syncPresetPressed();
  }
  function syncPresetPressed() {
    const current = I18N.toEnDigits(budgetInput.value.trim());
    budgetPresets.querySelectorAll('.chip-btn').forEach(btn =>
      btn.setAttribute('aria-pressed', String(current !== '' && Number(current) === Number(btn.dataset.value))));
  }

  function applyTimeframeLabels() {
    const weekly = state.timeframe === 'weekly';
    toggleDaily.classList.toggle('active', !weekly);
    toggleWeekly.classList.toggle('active', weekly);
    toggleDaily.setAttribute('aria-pressed', String(!weekly));
    toggleWeekly.setAttribute('aria-pressed', String(weekly));
    budgetLabelText.textContent = t(weekly ? 'budget_weekly' : 'budget_daily');
    budgetInput.placeholder = t(weekly ? 'budget_ph_weekly' : 'budget_ph_daily');
  }

  function setTimeframe(mode) {
    state.timeframe = mode;
    applyTimeframeLabels();
    clearBudgetError();
    renderBudgetPresets();
    updateBudgetHint();
    if (state.plan) runPlan({ quiet: true });
  }

  // ------------------------------------------------------------------ home food (inventory)
  function setPantryMessage(text, kind) {
    pantryMessage.textContent = text;
    pantryMessage.style.color = kind === 'warn' ? '#8a5a00' : '';
    pantryMessage.style.fontWeight = kind === 'warn' ? '700' : '';
  }
  const resetPantryMessage = () => setPantryMessage(t('pantry_msg_default'));

  const displayLabel = item => (isBn() && item.foodId ? foodLabel(item.foodId) : item.label);
  const cleanDigits = s => I18N.toEnDigits(String(s).trim()).replace(/,/g, '');

  function qtyErrorText(code, foodId) {
    switch (code) {
      case 'negative': return t('qe_negative');
      case 'unit': return t('qe_unit', { name: foodLabel(foodId), units: E.allowedUnitsFor(foodId).map(unitLabel).join(isBn() ? '، ' : ', ') });
      case 'whole': return t('qe_whole');
      case 'toolarge': return t('qe_toolarge');
      default: return t('qe_invalid');
    }
  }

  /** Fills the unit drop-down of the add form with the units that fit the typed food. */
  function fillUnitSelect() {
    const first = ingredientInput.value.split(/[,\n;]+/)[0] || '';
    const foodId = first.trim() ? E.matchPantryItem(first) : null;
    const units = foodId ? E.allowedUnitsFor(foodId) : ALL_UNITS;
    const keep = ingredientUnit.value;
    ingredientUnit.innerHTML = units.map(u => `<option value="${u}">${escapeHtml(unitLabel(u))}</option>`).join('');
    ingredientUnit.value = units.includes(keep) ? keep : units[0];
  }

  /** Adds one entry. Returns 'added' | 'duplicate' | 'empty'. */
  function addPantryEntry(rawLabel, quantity, unit) {
    const label = rawLabel.trim().replace(/\s+/g, ' ');
    if (!label) return 'empty';
    const foodId = E.matchPantryItem(label);
    const duplicate = state.pantry.some(p =>
      foodId ? p.foodId === foodId : (!p.foodId && p.label.toLowerCase() === label.toLowerCase()));
    if (duplicate) return 'duplicate';
    state.pantry.push({ label, foodId, quantity: quantity || '', unit: unit || (foodId ? E.allowedUnitsFor(foodId)[0] : 'g') });
    return 'added';
  }

  function addIngredientsFromInput() {
    const parts = ingredientInput.value.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
    ingredientQty.removeAttribute('aria-invalid');
    if (parts.length === 0) {
      setPantryMessage(t('pm_type_first'), 'warn');
      ingredientInput.focus();
      return;
    }
    const qtyRaw = ingredientQty.value.trim();
    let quantity = '', unit = '';
    if (qtyRaw) {
      if (parts.length > 1) { setPantryMessage(t('qe_multi'), 'warn'); ingredientQty.setAttribute('aria-invalid', 'true'); ingredientQty.focus(); return; }
      const foodId = E.matchPantryItem(parts[0]);
      if (foodId) {
        const r = E.toBaseQuantity(foodId, qtyRaw, ingredientUnit.value);
        if (!r.ok) {
          setPantryMessage(qtyErrorText(r.error, foodId), 'warn');
          ingredientQty.setAttribute('aria-invalid', 'true');
          ingredientQty.focus();
          return;
        }
        quantity = cleanDigits(qtyRaw); unit = ingredientUnit.value;
      } else {
        setPantryMessage(t('qe_unknown', { name: parts[0] }), 'warn');
      }
    }
    const added = [], dupes = [];
    const shown = raw => { const id = E.matchPantryItem(raw); return isBn() && id ? foodLabel(id) : raw; };   // Bangla name for known foods in Bangla mode
    parts.forEach(p => { const r = addPantryEntry(p, quantity, unit); if (r === 'added') added.push(shown(p)); else if (r === 'duplicate') dupes.push(shown(p)); });
    ingredientInput.value = ''; ingredientQty.value = '';
    fillUnitSelect();
    renderPantry();
    const list = a => a.join(isBn() ? '، ' : ', ');
    if (added.length && dupes.length) setPantryMessage(t('pm_added_dup', { names: list(added), dupes: list(dupes) }), 'warn');
    else if (added.length) { if (!(qtyRaw && !E.matchPantryItem(parts[0]))) setPantryMessage(t('pm_added', { names: list(added) })); }
    else setPantryMessage(tn('pm_dup', dupes.length, { names: list(dupes) }), 'warn');
    if (dupes.length && !added.length) toast(t('toast_dup'), 'warn');
    if (added.length) { toast(added.length === 1 ? t('toast_added', { name: added[0] }) : t('toast_added_n', { n: added.length })); onInputsChanged(); }
    ingredientInput.focus();
  }

  function removePantryAt(index) {
    const [removed] = state.pantry.splice(index, 1);
    renderPantry();
    if (removed) { const n = displayLabel(removed); setPantryMessage(t('pm_removed', { name: n })); toast(t('toast_removed', { name: n })); }
    onInputsChanged();
  }

  function toggleStaple(label) {
    const foodId = E.matchPantryItem(label);
    const idx = state.pantry.findIndex(p => p.foodId === foodId);
    if (idx >= 0) { removePantryAt(idx); return; }
    addPantryEntry(label, '', '');
    renderPantry();
    const name = isBn() ? foodLabel(foodId) : label;
    setPantryMessage(t('pm_added', { names: name }));
    toast(t('toast_added', { name }));
    onInputsChanged();
  }

  function renderStaples() {
    quickStaples.innerHTML = BANGLADESHI_FOOD_DATABASE.map(f => {
      const label = `${f.shortName} (${f.bengaliName})`;       // language-independent identity of the chip
      return `<button type="button" class="staple-chip" data-item="${escapeHtml(label)}" data-food="${escapeHtml(f.id)}" data-name="${escapeHtml(foodLabel(f.id))}" aria-pressed="false">+ ${escapeHtml(foodLabel(f.id))}</button>`;
    }).join('');
  }

  /** Re-expresses a typed amount in another unit of the same food (2 kg -> 2000 g). */
  function convertDisplay(foodId, qty, fromUnit, toUnit) {
    const r = E.toBaseQuantity(foodId, qty, fromUnit);
    if (!r.ok) return qty;
    const f = food(foodId);
    const toInfo = E.UNIT_INFO[toUnit];
    let v;
    if (toInfo.type === ({ g: 'weight', ml: 'volume', piece: 'count' })[f.unit]) v = r.base / toInfo.factor;
    else v = (r.base * f.gramsPerPiece) / toInfo.factor;                 // roti: pieces <-> weight (estimate)
    return String(Math.round(v * 1000) / 1000);
  }

  function estimateNote(item) {
    if (!item.foodId || item.quantity === '') return '';
    const f = food(item.foodId);
    if (!(f.gramsPerPiece && item.unit !== 'piece')) return '';
    const r = E.toBaseQuantity(item.foodId, item.quantity, item.unit);
    return r.ok ? t('inv_est_rotis', { n: r.base, g: f.gramsPerPiece }) : '';
  }

  function renderPantry() {
    pantryTagsList.innerHTML = '';
    state.pantry.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'tag-item inventory-item' + (item.foodId ? '' : ' unrecognized');
      row.dataset.index = String(index);
      const name = displayLabel(item);
      if (!item.foodId) row.title = t('unknown_tip');
      let controls = '';
      if (item.foodId) {
        const units = E.allowedUnitsFor(item.foodId);
        controls = `
          <span class="inv-controls">
            <input type="text" class="inv-qty" inputmode="decimal" maxlength="10" value="${escapeHtml(item.quantity)}" placeholder="${escapeHtml(t('inv_plenty_ph'))}" aria-label="${escapeHtml(t('inv_qty_aria', { name }))}">
            <select class="inv-unit" aria-label="${escapeHtml(t('inv_unit_aria', { name }))}">
              ${units.map(u => `<option value="${u}"${u === item.unit ? ' selected' : ''}>${escapeHtml(unitLabel(u))}</option>`).join('')}
            </select>
          </span>`;
      }
      const note = estimateNote(item);
      row.innerHTML = `
        ${item.foodId ? `<span class="inv-icon">${FoodIcons.icon(item.foodId)}</span>` : '<span class="inv-icon inv-icon-unknown" aria-hidden="true">?</span>'}
        <span class="tag-label">${escapeHtml(name)}</span>
        ${controls}
        <button type="button" class="tag-remove" aria-label="${escapeHtml(t('inv_remove_aria', { name }))}">&times;</button>
        ${note ? `<span class="inv-note">${escapeHtml(note)}</span>` : ''}`;
      row.querySelector('.tag-remove').addEventListener('click', () => removePantryAt(index));
      pantryTagsList.appendChild(row);
    });
    const have = new Set(state.pantry.map(p => p.foodId).filter(Boolean));
    quickStaples.querySelectorAll('.staple-chip').forEach(chip => {
      const on = have.has(chip.dataset.food);
      chip.setAttribute('aria-pressed', String(on));
      chip.textContent = (on ? '✓ ' : '+ ') + chip.dataset.name;
    });
    const unknown = state.pantry.filter(p => !p.foodId).map(p => p.label);
    pantryNote.hidden = unknown.length === 0;
    pantryNote.textContent = unknown.length ? t('pn_unknown', { items: unknown.join(isBn() ? '، ' : ', ') }) : '';
  }

  /** Applies a quantity/unit edit from the list. `final` = the user left the field (show messages, undo bad input). */
  function applyInventoryEdit(index, final) {
    const item = state.pantry[index];
    const row = pantryTagsList.querySelector(`.inventory-item[data-index="${index}"]`);
    if (!item || !row || !item.foodId) return;
    const qInput = row.querySelector('.inv-qty'), uSel = row.querySelector('.inv-unit');
    const raw = qInput.value.trim();
    const name = displayLabel(item);
    const refreshNote = () => {
      let n = row.querySelector('.inv-note');
      const text = estimateNote(item);
      if (text) { if (!n) { n = document.createElement('span'); n.className = 'inv-note'; row.appendChild(n); } n.textContent = text; }
      else if (n) n.remove();
    };
    if (raw === '') {
      item.quantity = ''; item.unit = uSel.value; qInput.removeAttribute('aria-invalid');
      if (final) setPantryMessage(t('pm_cleared', { name }));
      refreshNote(); onInputsChanged(); return;
    }
    const r = E.toBaseQuantity(item.foodId, raw, uSel.value);
    if (!r.ok) {
      qInput.setAttribute('aria-invalid', 'true');
      if (final) { setPantryMessage(qtyErrorText(r.error, item.foodId), 'warn'); qInput.value = item.quantity; qInput.removeAttribute('aria-invalid'); }
      return;
    }
    qInput.removeAttribute('aria-invalid');
    item.quantity = cleanDigits(raw); item.unit = uSel.value;
    if (final) setPantryMessage(t('pm_updated', { name, qty: `${item.quantity} ${unitLabel(item.unit)}` }));
    refreshNote(); onInputsChanged();
  }

  // ------------------------------------------------------------------ plan generation
  function planInputs() {
    return {
      budget: budgetInput.value,
      timeframe: state.timeframe,
      pantry: state.pantry.filter(p => !p.foodId || p.quantity === '').map(p => p.label),      // "plenty" items
      inventory: state.pantry.filter(p => p.foodId && p.quantity !== '').map(p => ({ foodId: p.foodId, quantity: p.quantity, unit: p.unit })),
      preference: currentPreference()
    };
  }

  function onInputsChanged() { if (state.plan) runPlan({ quiet: true }); }

  /** Validates inputs, builds the plan and renders it. */
  function runPlan(opts) {
    const quiet = Boolean(opts && opts.quiet);
    const v = E.validateBudget(budgetInput.value, state.timeframe);
    if (!v.valid) {
      showBudgetError(v.message);
      showEmpty();
      if (!quiet) budgetInput.focus();
      return false;
    }
    clearBudgetError();

    const params = planInputs();
    const plan = E.generateMealPlan(params);
    if (!plan.success) { showBudgetError(plan.message); showEmpty(); return false; }

    // Keep "purchased" ticks for items that are still on the new list
    const previous = new Map((state.plan ? state.plan.shoppingList : []).map(i => [i.foodId, i.purchased]));
    plan.shoppingList.forEach(i => { if (previous.get(i.foodId)) i.purchased = true; });

    state.plan = plan;
    state.lastParams = params;
    if (state.activeDay >= plan.days.length) state.activeDay = 0;
    renderAll(plan, quiet);
    return true;
  }

  /** Redraws the current plan in the current language, keeping the user's shopping-list edits and ticks. */
  function refreshPlanText() {
    if (!state.plan || !state.lastParams) return;
    const plan = E.generateMealPlan(state.lastParams);
    if (!plan.success) return;
    const old = new Map(state.plan.shoppingList.map(i => [i.foodId, i]));
    plan.shoppingList.forEach(i => {
      const o = old.get(i.foodId);
      if (o) { i.quantity = o.quantity; i.purchased = o.purchased; }
    });
    state.plan = plan;
    renderAll(plan, true);
  }

  function onGenerate() {
    if (state.loading) return;
    const v = E.validateBudget(budgetInput.value, state.timeframe);
    if (!v.valid) { showBudgetError(v.message); showEmpty(); budgetInput.focus(); return; }
    clearBudgetError();
    state.loading = true;
    btnGenerate.disabled = true;
    btnGenerate.classList.add('loading');
    btnGenerateLabel.textContent = t('planning');
    resultsPanel.setAttribute('aria-busy', 'true');
    const finish = () => {
      state.activeDay = 0;
      runPlan({ quiet: false });
      state.loading = false;
      btnGenerate.disabled = false;
      btnGenerate.classList.remove('loading');
      btnGenerateLabel.textContent = t('generate');
      resultsPanel.setAttribute('aria-busy', 'false');
      if (window.innerWidth <= 1080 && state.plan) resultsPanel.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    };
    if (reducedMotion()) finish(); else setTimeout(finish, 350);
  }

  // ------------------------------------------------------------------ rendering
  function showEmpty() {
    state.plan = null;
    emptyHero.hidden = false;
    resultsContent.hidden = true;
    statusBox.classList.add('hidden');
  }

  function renderAll(plan, quiet) {
    emptyHero.hidden = true;
    resultsContent.hidden = false;
    renderBanner(plan);
    renderDayTabs(plan);
    renderWeekChart(plan);
    renderWeekMenu(plan);
    renderMeals(plan);
    renderNutrition(plan);
    renderInventoryCheck(plan);
    renderShoppingList();
    renderAlternatives(plan.alternatives);
    refreshSpend();
    if (!quiet) toast(plan.fitsBudget ? t('toast_plan_ready') : t('toast_plan_low'), plan.fitsBudget ? undefined : 'warn');
  }

  function renderBanner(plan) {
    const weekly = plan.periodDays > 1;
    let html;
    if (plan.fitsBudget) {
      html = `<strong>${escapeHtml(t(weekly ? 'ban_ready_week' : 'ban_ready_day'))}</strong> ${escapeHtml(t('ban_ready_text', {
        cost: money(plan.totalCost), budget: money0(plan.periodBudget), span: t(weekly ? 'span_week' : 'span_day'), left: money(plan.remainingBudget) }))}`;
      statusBox.className = 'status-box';
      statusIcon.textContent = '✓';
    } else {
      html = `<strong>${escapeHtml(t('ban_low_title', { span: t(weekly ? 'period_week' : 'period_day') }))}</strong> ${escapeHtml(t('ban_low_text', {
        min: money(plan.minimumPeriodCost), over: money(plan.totalCost - plan.periodBudget), budget: money0(plan.periodBudget) }))}`;
      statusBox.className = 'status-box warning';
      statusIcon.textContent = '!';
    }
    if (plan.notices.length) html += '<ul>' + plan.notices.map(n => `<li>${escapeHtml(n.text)}</li>`).join('') + '</ul>';
    statusText.innerHTML = html;
    statusBox.classList.remove('hidden');
  }

  function renderDayTabs(plan) {
    const weekly = plan.periodDays > 1;
    dayTabs.hidden = !weekly;
    if (!weekly) { dayTabs.innerHTML = ''; return; }
    dayTabs.innerHTML = plan.days.map((d, i) =>
      `<button type="button" role="tab" class="day-tab" id="tab-day-${i}" data-day="${i}" aria-selected="${i === state.activeDay}" tabindex="${i === state.activeDay ? 0 : -1}">${escapeHtml(t('day_n', { n: d.dayNumber }))}</button>`).join('');
  }

  function selectDay(i, focusTab) {
    if (!state.plan || i < 0 || i >= state.plan.days.length) return;
    state.activeDay = i;
    renderDayTabs(state.plan);
    renderWeekChart(state.plan);
    renderWeekMenu(state.plan);
    renderMeals(state.plan);
    renderNutrition(state.plan);
    if (focusTab) { const tab = $('tab-day-' + i); if (tab) tab.focus(); }
  }

  function renderWeekChart(plan) {
    const weekly = plan.periodDays > 1;
    weekCard.hidden = !weekly;
    if (!weekly) return;
    const allowance = plan.dailyTargetBudget;
    const max = Math.max(allowance, ...plan.days.map(d => d.totalOutOfPocket), 1) * 1.12;
    const cols = plan.days.map((d, i) => {
      const h = Math.max(3, (d.totalOutOfPocket / max) * 100);
      const cls = (d.fitsBudget ? '' : ' over') + (i === state.activeDay ? ' active' : '');
      return `<button type="button" class="week-col${cls}" data-day="${i}" aria-label="${escapeHtml(t('show_day', { n: d.dayNumber, amount: money(d.totalOutOfPocket) }))}"><span class="bar" style="height:${h}%"></span></button>`;
    }).join('');
    const labels = plan.days.map(d => `<span><b>${escapeHtml(t('day_n', { n: d.dayNumber }))}</b><em>${money0(d.totalOutOfPocket)}</em></span>`).join('');
    weekChart.innerHTML = `<div class="week-plot">${cols}<span class="week-line" style="bottom:${(allowance / max) * 100}%"></span></div><div class="week-labels">${labels}</div>`;
  }

  /** Day-by-day weekly menu: one row per day with the three meals in their own colour. */
  function renderWeekMenu(plan) {
    if (plan.periodDays <= 1) { weekMenu.innerHTML = ''; return; }
    weekMenu.innerHTML = plan.days.map((d, i) => `
      <button type="button" class="week-row${i === state.activeDay ? ' active' : ''}" data-day="${i}" aria-label="${escapeHtml(t('show_day', { n: d.dayNumber, amount: money(d.totalOutOfPocket) }))}">
        <span class="wr-day">${escapeHtml(t('day_n', { n: d.dayNumber }))}</span>
        ${SLOTS.map(s => `<span class="wr-meal ${s}" title="${escapeHtml(slotLabel(s) + ': ' + mealTitle(d.meals[s]))}"><i aria-hidden="true"></i>${escapeHtml(mealTitle(d.meals[s]))}</span>`).join('')}
        <span class="wr-cost">${money0(d.totalOutOfPocket)}</span>
      </button>`).join('');
  }

  function renderMeals(plan) {
    const day = plan.days[state.activeDay] || plan.days[0];
    SLOTS.forEach(slot => renderMealCard(mealCards[slot], day.meals[slot], slot));
  }

  function ingredientStatus(ing) {
    if (ing.isInPantry) return `<span class="ing-status home">${escapeHtml(t('at_home'))}</span>`;
    if (ing.partial) {
      return `<span class="ing-status partial">${escapeHtml(t('ing_partial', { home: formatQty(ing.homeQuantity, ing.unit), buy: formatQty(ing.buyQuantity, ing.unit) }))} · ${money(ing.cost)}</span>`;
    }
    return `<span class="ing-status buy">${money(ing.cost)}</span>`;
  }

  function renderMealCard(card, meal, slot) {
    const free = meal.outOfPocketCost === 0;
    card.className = `card meal-card ${slot}`;
    card.setAttribute('aria-label', `${slotLabel(slot)}: ${mealTitle(meal)}`);
    const sub = mealSubtitle(meal);
    card.innerHTML = `
      <div class="meal-banner">
        <span class="meal-type-tag">${escapeHtml(slotLabel(slot))}</span>
        <span class="meal-cost-badge${free ? ' free' : ''}">${escapeHtml(free ? t('nothing_to_buy_badge') : t('cost_badge', { amount: money(meal.outOfPocketCost) }))}</span>
        ${FoodIcons.mealArt(meal)}
      </div>
      <div class="meal-body">
        <h3 class="meal-title">${escapeHtml(mealTitle(meal))}</h3>
        ${sub ? `<div class="meal-bengali-title">${escapeHtml(sub)}</div>` : ''}
        <p class="meal-desc">${escapeHtml(mealDesc(meal))}</p>
        <div class="meal-detail">
          <div>
            <div class="meal-ing-title">${escapeHtml(t('ingredients_title'))}</div>
            <ul class="meal-ing-list">
              ${meal.ingredientBreakdown.map(ing => `
                <li>
                  <span class="ing-icon">${FoodIcons.icon(ing.foodId)}</span>
                  <span class="ing-name">${escapeHtml(itemName(ing))}</span>
                  <span class="ing-qty">${escapeHtml(formatQty(ing.quantity, ing.unit))}</span>
                  ${ingredientStatus(ing)}
                </li>`).join('')}
            </ul>
          </div>
          <div class="meal-explain">
            <div class="meal-reasons-title">${escapeHtml(t('why_title'))}</div>
            ${escapeHtml(meal.explanation)}
            <div class="reason-pills">
              ${meal.recommendationReasons.map(r => `<span class="reason-badge-tag ${escapeHtml(r.type)}" title="${escapeHtml(r.text)}">${escapeHtml(r.badge)}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="meal-footer">
        <div class="macro-tiles" aria-label="${escapeHtml(t('macros_aria'))}">
          <div class="macro-tile"><strong>${meal.nutrition.calories}</strong><span>${escapeHtml(t('kcal'))}</span></div>
          <div class="macro-tile"><strong>${meal.nutrition.protein}${isBn() ? '' : 'g'}</strong><span>${escapeHtml(t('protein'))}${isBn() ? ' (' + t('unit_gram') + ')' : ''}</span></div>
          <div class="macro-tile"><strong>${meal.nutrition.carbs}${isBn() ? '' : 'g'}</strong><span>${escapeHtml(t('carbs'))}${isBn() ? ' (' + t('unit_gram') + ')' : ''}</span></div>
          <div class="macro-tile"><strong>${meal.nutrition.fat}${isBn() ? '' : 'g'}</strong><span>${escapeHtml(t('fat'))}${isBn() ? ' (' + t('unit_gram') + ')' : ''}</span></div>
        </div>
        <div class="meal-value">${escapeHtml(t('full_value', { gross: money(meal.grossCost) }))}${free ? '' : escapeHtml(t('you_buy', { amount: money(meal.outOfPocketCost) }))}</div>
      </div>`;
  }

  function setBar(id, pct) { $(id).style.width = Math.min(100, Math.max(pct > 0 ? 3 : 0, pct)) + '%'; }

  function renderNutrition(plan) {
    const weekly = plan.periodDays > 1;
    const day = plan.days[state.activeDay] || plan.days[0];
    // Weekly: show the whole-week totals (the summary the user asked for) and note the daily average.
    const nut = plan.totals;
    const days = plan.periodDays;
    $('nutritionTitle').textContent = t(weekly ? 'nut_title_week' : 'nut_title_day');
    $('nutritionSubtitle').textContent = weekly
      ? t('nut_sub_week', { kcal: Math.round(nut.calories / days), protein: (nut.protein / days).toFixed(1), n: day.dayNumber, dkcal: day.nutrition.calories })
      : t('nut_sub_day');
    const kcalU = t('unit_kcal'), gU = t('unit_gram');
    $('valCalories').innerHTML = `${nut.calories.toLocaleString('en-US')} <small>${escapeHtml(kcalU)}</small>`;
    $('valProtein').innerHTML = `${nut.protein} <small>${escapeHtml(gU)}</small>`;
    $('valCarbs').innerHTML = `${nut.carbs} <small>${escapeHtml(gU)}</small>`;
    $('valFat').innerHTML = `${nut.fat} <small>${escapeHtml(gU)}</small>`;
    const pct = (v, ref) => Math.round((v / (ref * days)) * 100);
    const refText = (v, ref, unit) => t('ref_text', { pct: pct(v, ref), ref: (ref * days).toLocaleString('en-US'), unit });
    setBar('barCalories', (nut.calories / (REF.calories * days)) * 100);
    setBar('barProtein', (nut.protein / (REF.protein * days)) * 100);
    setBar('barCarbs', (nut.carbs / (REF.carbs * days)) * 100);
    setBar('barFat', (nut.fat / (REF.fat * days)) * 100);
    $('refCalories').textContent = refText(nut.calories, REF.calories, kcalU);
    $('refProtein').textContent = refText(nut.protein, REF.protein, gU);
    $('refCarbs').textContent = refText(nut.carbs, REF.carbs, gU);
    $('refFat').textContent = refText(nut.fat, REF.fat, gU);

    const e = { p: nut.protein * 4, c: nut.carbs * 4, f: nut.fat * 9 };
    const total = e.p + e.c + e.f || 1;
    const share = { p: Math.round((e.p / total) * 100), c: Math.round((e.c / total) * 100) };
    share.f = Math.max(0, 100 - share.p - share.c);
    $('macroBar').innerHTML =
      `<span style="width:${share.p}%;background:#0f766e" title="${escapeHtml(t('protein'))}"></span><span style="width:${share.c}%;background:#d97706" title="${escapeHtml(t('carbohydrates'))}"></span><span style="width:${share.f}%;background:#ea580c" title="${escapeHtml(t('fat'))}"></span>`;
    $('macroLegend').innerHTML =
      `<span><i style="background:#0f766e"></i>${escapeHtml(t('macro_p', { n: share.p }))}</span><span><i style="background:#d97706"></i>${escapeHtml(t('macro_c', { n: share.c }))}</span><span><i style="background:#ea580c"></i>${escapeHtml(t('macro_f', { n: share.f }))}</span><span style="font-weight:600;color:var(--text-light)">${escapeHtml(t('macro_share'))}</span>`;
  }

  // ------------------------------------------------------------------ ingredient check (home stock vs plan)
  function renderInventoryCheck(plan) {
    const inv = plan.inventory;
    const hasStock = inv.rows.some(r => r.unlimited || (r.atHome || 0) > 0);
    if (!hasStock) { inventorySummary.hidden = true; inventorySummary.textContent = ''; }
    else {
      inventorySummary.hidden = false;
      const short = inv.rows.filter(r => r.status === 'short' || r.status === 'none').length;
      inventorySummary.className = 'check-summary ' + (short ? 'warn' : 'ok');
      inventorySummary.textContent = short ? t('chk_short_summary', { n: short }) : t('chk_all_ok');
    }
    if (inv.rows.length === 0) { inventoryCheckBody.innerHTML = ''; return; }
    const dash = '—';
    const statusHtml = r => {
      switch (r.status) {
        case 'enough': return `<span class="chk-badge enough">${escapeHtml(t('chk_enough'))}</span>`;
        case 'short': return `<span class="chk-badge short">${escapeHtml(t('chk_short', { amount: formatQty(r.toBuy, r.unit) }))}</span>`;
        case 'none': return `<span class="chk-badge none">${escapeHtml(t('chk_none'))}</span>`;
        case 'assumed': return `<span class="chk-badge assumed">${escapeHtml(t('chk_assumed'))}</span>`;
        default: return `<span class="chk-badge unused">${escapeHtml(t('chk_unused'))}</span>`;
      }
    };
    const head = `<div class="chk-row chk-head" aria-hidden="true"><span></span><span>${escapeHtml(t('chk_needed'))}</span><span>${escapeHtml(t('chk_home'))}</span><span>${escapeHtml(t('chk_left'))}</span><span>${escapeHtml(t('chk_buy'))}</span><span></span></div>`;
    inventoryCheckBody.innerHTML = head + inv.rows.map(r => `
      <div class="chk-row status-${r.status}" data-food="${escapeHtml(r.foodId)}">
        <span class="chk-name"><span class="chk-icon">${FoodIcons.icon(r.foodId)}</span><span>${escapeHtml(isBn() ? r.bengaliName : r.shortName)}${r.estimated ? ` <em class="est-flag">${escapeHtml(t('chk_est_flag'))}</em>` : ''}</span></span>
        <span class="chk-cell" data-label="${escapeHtml(t('chk_needed'))}">${r.needed > 0 ? escapeHtml(formatQty(r.needed, r.unit)) : dash}</span>
        <span class="chk-cell" data-label="${escapeHtml(t('chk_home'))}">${r.unlimited ? escapeHtml(t('chk_plenty')) : (r.atHome > 0 ? escapeHtml(formatQty(r.atHome, r.unit)) : dash)}</span>
        <span class="chk-cell" data-label="${escapeHtml(t('chk_left'))}">${r.unlimited || r.remaining === null ? dash : escapeHtml(formatQty(r.remaining, r.unit))}</span>
        <span class="chk-cell chk-buy" data-label="${escapeHtml(t('chk_buy'))}">${r.toBuy > 0 ? `<b>${escapeHtml(formatQty(r.toBuy, r.unit))}</b> · ${money(r.buyCost)}` : dash}</span>
        <span class="chk-status">${statusHtml(r)}</span>
      </div>`).join('');
  }

  // ------------------------------------------------------------------ shopping list
  function usedForText(item, plan) {
    if (plan.periodDays > 1) return tn('shop_used', item.usedIn.length, { n: item.usedIn.length });
    const slots = item.usedIn.map(u => slotLabel(u.slot)).filter((v, i, a) => a.indexOf(v) === i);
    return t('shop_for', { slots: slots.join(isBn() ? '، ' : ', ') });
  }

  function renderShoppingList() {
    const plan = state.plan;
    if (!plan) return;
    const items = plan.shoppingList;
    shoppingSubtitle.textContent = t(plan.periodDays > 1 ? 'shop_sub_week' : 'shop_sub_day');

    if (items.length === 0) {
      shoppingCountBadge.textContent = tn('items', 0, { n: 0 });
      shoppingListContainer.innerHTML = `
        <div class="empty-list-state">
          <div class="empty-icon">🎉</div>
          <p class="empty-text">${escapeHtml(t('shop_empty_title'))}</p>
          <small class="empty-subtext">${escapeHtml(t('shop_empty_sub'))}</small>
        </div>`;
      return;
    }

    shoppingListContainer.innerHTML = `
      <div class="shopping-toolbar">
        <span class="shopping-progress-pill" id="shopProgressPill"></span>
        <div class="shopping-toolbar-actions">
          <button type="button" class="btn-shop-action" data-action="toggle-all" id="btnToggleAllPurchased"></button>
          <button type="button" class="btn-shop-action" data-action="reset-qty" id="btnResetQuantities">${escapeHtml(t('reset_qty'))}</button>
          <button type="button" class="btn-shop-action" data-action="copy" id="btnCopyList">${escapeHtml(t('copy_list'))}</button>
        </div>
      </div>
      <ul class="shop-list" id="shoppingInteractiveTable">
        ${items.map(item => {
          const nm = itemName(item);
          return `
          <li class="shop-row" data-food-id="${escapeHtml(item.foodId)}">
            <input type="checkbox" class="shop-check" id="chk-${escapeHtml(item.foodId)}" data-id="${escapeHtml(item.foodId)}" aria-label="${escapeHtml(t('shop_check_aria', { name: nm }))}">
            <span class="shop-icon">${FoodIcons.icon(item.foodId)}</span>
            <label class="shop-info" for="chk-${escapeHtml(item.foodId)}">
              <span class="shop-item-name">${escapeHtml(nm)}</span><br>
              <span class="shop-item-for">${escapeHtml(usedForText(item, plan))}</span>
            </label>
            <span class="shop-cost" id="cost-${escapeHtml(item.foodId)}"></span>
            <div class="qty-control">
              <button type="button" class="btn-qty-step" data-action="dec" data-id="${escapeHtml(item.foodId)}" aria-label="${escapeHtml(t('shop_dec_aria', { name: nm }))}">−</button>
              <input type="number" class="qty-input-field" data-id="${escapeHtml(item.foodId)}" min="0" max="100000" step="${item.unitStep}" value="${item.quantity}" aria-label="${escapeHtml(t('shop_qty_aria', { name: nm, unit: unitLabel(item.unit) }))}">
              <button type="button" class="btn-qty-step" data-action="inc" data-id="${escapeHtml(item.foodId)}" aria-label="${escapeHtml(t('shop_inc_aria', { name: nm }))}">+</button>
              <span class="qty-unit-label">${escapeHtml(unitLabel(item.unit))}</span>
            </div>
          </li>`; }).join('')}
      </ul>
      <div class="shop-totals" aria-label="${escapeHtml(t('tot_aria'))}">
        <div class="shop-totals-row"><span>${escapeHtml(t('tot_bought'))}</span><span id="shopTotalBought">৳0.00</span></div>
        <div class="shop-totals-row"><span>${escapeHtml(t('tot_pending'))}</span><span id="shopTotalPending">৳0.00</span></div>
        <div class="shop-totals-row grand"><span>${escapeHtml(t('tot_grand'))}</span><span id="shoppingGrandTotal">৳0.00 ${escapeHtml(bdt())}</span></div>
      </div>
      <small class="shopping-hint-note">${escapeHtml(t('shop_hint'))}</small>`;
    updateShoppingUI();
  }

  /** Updates costs, ticks and totals without re-creating the rows (keeps keyboard focus). */
  function updateShoppingUI() {
    const plan = state.plan;
    if (!plan || plan.shoppingList.length === 0) { refreshSpend(); return; }
    const items = plan.shoppingList;
    const totals = E.calculateShoppingListTotals(items);
    items.forEach(item => {
      const row = shoppingListContainer.querySelector(`.shop-row[data-food-id="${item.foodId}"]`);
      if (!row) return;
      row.classList.toggle('is-purchased', Boolean(item.purchased));
      row.querySelector('.shop-check').checked = Boolean(item.purchased);
      row.querySelector('.shop-cost').textContent = money(item.cost);
      const inp = row.querySelector('.qty-input-field');
      if (document.activeElement !== inp && Number(inp.value) !== item.quantity) inp.value = item.quantity;
    });
    const allBought = totals.purchasedCount === totals.totalCount;
    const modified = items.some(i => i.quantity !== i.originalQuantity);
    $('shopProgressPill').textContent = t('shop_progress', { b: totals.purchasedCount, n: totals.totalCount });
    $('btnToggleAllPurchased').textContent = t(allBought ? 'unmark_all' : 'mark_all');
    $('btnResetQuantities').hidden = !modified;
    $('shopTotalBought').textContent = money(totals.purchasedTotal);
    $('shopTotalPending').textContent = money(totals.pendingTotal);
    $('shoppingGrandTotal').textContent = money(totals.grandTotal) + ' ' + bdt();
    shoppingCountBadge.textContent = t('items_bought', { items: tn('items', totals.totalCount, { n: totals.totalCount }), b: totals.purchasedCount });
    refreshSpend();
  }

  function findItem(foodId) { return state.plan && state.plan.shoppingList.find(i => i.foodId === foodId); }

  function setQuantity(item, value) {
    let q = Number(value);
    if (!Number.isFinite(q) || q < 0) q = 0;
    q = Math.min(100000, Math.round((q + Number.EPSILON) * 10) / 10);
    item.quantity = q;
  }

  function onShoppingClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn || !state.plan) return;
    const action = btn.dataset.action;
    if (action === 'inc' || action === 'dec') {
      const item = findItem(btn.dataset.id);
      if (!item) return;
      setQuantity(item, item.quantity + (action === 'inc' ? item.unitStep : -item.unitStep));
      const input = shoppingListContainer.querySelector(`.qty-input-field[data-id="${item.foodId}"]`);
      if (input) input.value = item.quantity;
      updateShoppingUI();
    } else if (action === 'toggle-all') {
      const all = state.plan.shoppingList.every(i => i.purchased);
      state.plan.shoppingList.forEach(i => { i.purchased = !all; });
      updateShoppingUI();
    } else if (action === 'reset-qty') {
      state.plan.shoppingList.forEach(i => { i.quantity = i.originalQuantity; });
      shoppingListContainer.querySelectorAll('.qty-input-field').forEach(inp => { const it = findItem(inp.dataset.id); if (it) inp.value = it.quantity; });
      updateShoppingUI();
      toast(t('toast_qty_reset'));
    } else if (action === 'copy') {
      copyShoppingList();
    }
  }

  function onShoppingChange(e) {
    const tgt = e.target;
    if (tgt.classList.contains('shop-check')) {
      const item = findItem(tgt.dataset.id);
      if (item) { item.purchased = tgt.checked; updateShoppingUI(); }
    } else if (tgt.classList.contains('qty-input-field')) {
      const item = findItem(tgt.dataset.id);
      if (item) { setQuantity(item, tgt.value); tgt.value = item.quantity; updateShoppingUI(); }
    }
  }

  function onShoppingInput(e) {
    const tgt = e.target;
    if (tgt.classList.contains('qty-input-field')) {
      const item = findItem(tgt.dataset.id);
      if (item && tgt.value !== '') { setQuantity(item, tgt.value); updateShoppingUI(); }
    }
  }

  function copyShoppingList() {
    const plan = state.plan;
    const totals = E.calculateShoppingListTotals(plan.shoppingList);
    const lines = [t('copy_header')];
    plan.shoppingList.forEach(i => lines.push(`${i.purchased ? '[x]' : '[ ]'} ${itemName(i)}: ${formatQty(i.quantity, i.unit)} - ${money(i.cost)}`));
    lines.push(`${t('copy_total')}: ${money(totals.grandTotal)}`);
    const text = lines.join('\n');
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let okCopy = false;
      try { okCopy = document.execCommand('copy'); } catch (err) { okCopy = false; }
      document.body.removeChild(ta);
      toast(okCopy ? t('toast_copied') : t('toast_copy_fail'), okCopy ? undefined : 'warn');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(t('toast_copied')), fallback);
    } else fallback();
  }

  // ------------------------------------------------------------------ spend / remaining
  /** Header numbers follow the shopping list, so edited quantities are reflected in the budget. */
  function refreshSpend() {
    const plan = state.plan;
    if (!plan) return;
    const weekly = plan.periodDays > 1;
    const spend = E.calculateShoppingListTotals(plan.shoppingList).grandTotal;
    const remaining = round2(plan.periodBudget - spend);
    const fits = remaining >= 0;

    $('summaryTitle').lastChild.nodeValue = t(weekly ? 'your_week' : 'your_daily');
    $('kpiBudgetLabel').textContent = t(weekly ? 'kpi_budget_weekly' : 'kpi_budget_daily');
    $('kpiCostLabel').textContent = t(weekly ? 'kpi_cost_week' : 'kpi_cost');
    $('kpiRemainLabel').textContent = t(fits ? 'kpi_remaining' : 'kpi_over');
    $('summaryBudgetAmount').textContent = money0(plan.periodBudget) + ' ' + bdt();
    $('summaryCostAmount').textContent = money(spend) + ' ' + bdt();
    const rem = $('summaryRemainingAmount');
    rem.textContent = (fits ? money(remaining) : '−' + money(Math.abs(remaining))) + ' ' + bdt();
    rem.classList.toggle('negative', !fits);

    const badge = $('resultsBadge');
    badge.className = fits ? 'badge-success' : 'badge-warning';
    badge.textContent = t(fits ? 'within' : 'over');

    const pct = plan.periodBudget > 0 ? (spend / plan.periodBudget) * 100 : 0;
    const bar = $('budgetProgressBar');
    bar.style.width = Math.min(100, pct) + '%';
    bar.className = 'progress-bar' + (pct > 100 ? ' over' : pct >= 85 ? ' warn' : '');
    $('budgetProgressText').textContent = t('pct_used', { pct: Math.round(pct) });
    $('budgetProgressNote').textContent = fits ? t('left_amt', { amount: money(remaining) }) : t('short_amt', { amount: money(Math.abs(remaining)) });

    const diff = round2(spend - plan.totalCost);
    const note = $('adjustNote');
    note.hidden = Math.abs(diff) < 0.005;
    note.textContent = Math.abs(diff) < 0.005 ? '' : t('adjust_note', { sign: diff > 0 ? '+' : '−', amount: money(Math.abs(diff)) });
  }

  // ------------------------------------------------------------------ alternatives
  function renderAlternatives(alts) {
    if (!alts || alts.length === 0) {
      alternativesListContainer.innerHTML = `
        <div class="empty-list-state"><div class="empty-icon">✨</div><p class="empty-text">${escapeHtml(t('alt_empty_title'))}</p>
        <small class="empty-subtext">${escapeHtml(t('alt_empty_sub'))}</small></div>`;
      return;
    }
    alternativesListContainer.innerHTML = alts.map(alt => `
      <div class="alt-card-item ${escapeHtml(alt.type)}">
        <h3 class="alt-title">${escapeHtml(alt.title)}</h3>
        <p class="alt-desc">${escapeHtml(alt.description)}</p>
        ${alt.actionTip ? `<span class="alt-action-tip">💡 ${escapeHtml(alt.actionTip)}</span>` : ''}
      </div>`).join('');
  }

  // ------------------------------------------------------------------ reset
  function resetKpiText() {
    ['summaryBudgetAmount', 'summaryCostAmount', 'summaryRemainingAmount'].forEach(id => { $(id).textContent = '৳0.00 ' + bdt(); });
    $('summaryRemainingAmount').classList.remove('negative');
    $('resultsBadge').className = 'badge-neutral'; $('resultsBadge').textContent = t('waiting');
    $('budgetProgressText').textContent = t('pct_used', { pct: 0 });
    $('kpiBudgetLabel').textContent = t('kpi_budget_daily'); $('kpiCostLabel').textContent = t('kpi_cost'); $('kpiRemainLabel').textContent = t('kpi_remaining');
    $('summaryTitle').lastChild.nodeValue = t('your_daily');
    $('nutritionTitle').textContent = t('nut_title_day'); $('nutritionSubtitle').textContent = t('nut_sub_day');
  }

  function resetAll() {
    clearTimeout(debounceTimer); clearTimeout(qtyTimer);
    form.reset();                       // clears budget, ingredient text boxes and preference radios
    state.pantry = [];
    state.plan = null;
    state.lastParams = null;
    state.activeDay = 0;
    state.timeframe = 'daily';
    budgetInput.value = '';
    ingredientInput.value = ''; ingredientQty.value = ''; ingredientQty.removeAttribute('aria-invalid');
    applyTimeframeLabels();
    clearBudgetError();
    renderBudgetPresets();
    updateBudgetHint();
    fillUnitSelect();
    renderPantry();
    resetPantryMessage();
    medicalNote.hidden = true;
    // Clear every result element so no stale numbers remain anywhere
    shoppingListContainer.innerHTML = '';
    alternativesListContainer.innerHTML = '';
    inventoryCheckBody.innerHTML = ''; inventorySummary.textContent = ''; inventorySummary.hidden = true;
    shoppingCountBadge.textContent = tn('items', 0, { n: 0 });
    dayTabs.innerHTML = ''; weekChart.innerHTML = ''; weekMenu.innerHTML = '';
    SLOTS.forEach(s => { mealCards[s].innerHTML = ''; });
    resetKpiText();
    $('budgetProgressBar').style.width = '0%'; $('budgetProgressNote').textContent = '';
    $('adjustNote').hidden = true;
    const kcalU = t('unit_kcal'), gU = t('unit_gram');
    $('valCalories').innerHTML = `0 <small>${escapeHtml(kcalU)}</small>`; $('valProtein').innerHTML = `0 <small>${escapeHtml(gU)}</small>`;
    $('valCarbs').innerHTML = `0 <small>${escapeHtml(gU)}</small>`; $('valFat').innerHTML = `0 <small>${escapeHtml(gU)}</small>`;
    ['barCalories', 'barProtein', 'barCarbs', 'barFat'].forEach(id => { $(id).style.width = '0%'; });
    ['refCalories', 'refProtein', 'refCarbs', 'refFat'].forEach(id => { $(id).textContent = ''; });
    $('macroBar').innerHTML = ''; $('macroLegend').innerHTML = '';
    showEmpty();
    toast(t('toast_reset'));
    budgetInput.focus();
    I18N.syncDigits();
  }

  // ------------------------------------------------------------------ language
  function updateLangButtons() {
    langButtons.forEach(b => {
      const on = b.dataset.lang === I18N.lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  /** Redraws every piece of text that is built by code. Nothing the user entered is touched. */
  function onLanguageChanged() {
    updateLangButtons();
    applyTimeframeLabels();
    renderStaples();
    renderBudgetPresets();
    fillUnitSelect();
    renderPantry();
    resetPantryMessage();
    updateBudgetHint();
    if (!budgetError.hidden) {
      const v = E.validateBudget(budgetInput.value, state.timeframe);
      if (!v.valid) showBudgetError(v.message);
    }
    btnGenerateLabel.textContent = t('generate');
    if (state.plan) refreshPlanText(); else resetKpiText();
    toast(t('toast_lang'));
  }

  // ------------------------------------------------------------------ events
  toggleDaily.addEventListener('click', () => { if (state.timeframe !== 'daily') setTimeframe('daily'); });
  toggleWeekly.addEventListener('click', () => { if (state.timeframe !== 'weekly') setTimeframe('weekly'); });

  langButtons.forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== I18N.lang) I18N.setLang(b.dataset.lang); }));
  I18N.onChange(onLanguageChanged);

  budgetInput.addEventListener('input', () => {
    clearBudgetError();
    syncPresetPressed();
    updateBudgetHint();
    if (state.plan) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => runPlan({ quiet: true }), 350);
    }
  });
  budgetInput.addEventListener('blur', () => {
    if (budgetInput.value.trim() !== '') {
      const v = E.validateBudget(budgetInput.value, state.timeframe);
      if (!v.valid) showBudgetError(v.message);
    }
  });

  btnAddIngredient.addEventListener('click', addIngredientsFromInput);
  ingredientInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addIngredientsFromInput(); } });
  ingredientQty.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addIngredientsFromInput(); } });
  ingredientInput.addEventListener('input', fillUnitSelect);
  ingredientQty.addEventListener('input', () => ingredientQty.removeAttribute('aria-invalid'));
  quickStaples.addEventListener('click', e => {
    const chip = e.target.closest('.staple-chip');
    if (chip && chip.dataset.item) toggleStaple(chip.dataset.item);
  });

  // editing amounts / units of items already in the list
  pantryTagsList.addEventListener('input', e => {
    if (!e.target.classList.contains('inv-qty')) return;
    const index = Number(e.target.closest('.inventory-item').dataset.index);
    clearTimeout(qtyTimer);
    qtyTimer = setTimeout(() => applyInventoryEdit(index, false), 300);
  });
  pantryTagsList.addEventListener('change', e => {
    const rowEl = e.target.closest('.inventory-item');
    if (!rowEl) return;
    const index = Number(rowEl.dataset.index);
    const item = state.pantry[index];
    if (e.target.classList.contains('inv-qty')) { clearTimeout(qtyTimer); applyInventoryEdit(index, true); }
    else if (e.target.classList.contains('inv-unit')) {
      const qInput = rowEl.querySelector('.inv-qty');
      if (item && item.foodId && qInput.value.trim() !== '') qInput.value = convertDisplay(item.foodId, cleanDigits(qInput.value), item.unit, e.target.value);
      applyInventoryEdit(index, true);
    }
  });

  prefGroup.addEventListener('change', () => {
    medicalNote.hidden = currentPreference() !== 'diabetic-friendly';
    onInputsChanged();
  });

  form.addEventListener('submit', e => { e.preventDefault(); onGenerate(); });
  btnReset.addEventListener('click', resetAll);
  $('btnPrint').addEventListener('click', () => window.print());

  shoppingListContainer.addEventListener('click', onShoppingClick);
  shoppingListContainer.addEventListener('change', onShoppingChange);
  shoppingListContainer.addEventListener('input', onShoppingInput);

  dayTabs.addEventListener('click', e => { const b = e.target.closest('.day-tab'); if (b) selectDay(Number(b.dataset.day), false); });
  dayTabs.addEventListener('keydown', e => {
    if (!state.plan) return;
    const n = state.plan.days.length;
    if (e.key === 'ArrowRight') { e.preventDefault(); selectDay((state.activeDay + 1) % n, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); selectDay((state.activeDay + n - 1) % n, true); }
    else if (e.key === 'Home') { e.preventDefault(); selectDay(0, true); }
    else if (e.key === 'End') { e.preventDefault(); selectDay(n - 1, true); }
  });
  weekChart.addEventListener('click', e => { const b = e.target.closest('.week-col'); if (b) selectDay(Number(b.dataset.day), false); });
  weekMenu.addEventListener('click', e => { const b = e.target.closest('.week-row'); if (b) selectDay(Number(b.dataset.day), false); });

  // ------------------------------------------------------------------ start
  const heroArt = $('heroArt');
  if (heroArt) heroArt.innerHTML = ['rice', 'fish', 'egg', 'seasonal_vegetables', 'banana'].map((id, i) => `<span class="art-chip" style="--i:${i}">${FoodIcons.icon(id)}</span>`).join('');
  const emptyArt = emptyHero.querySelectorAll('.art-chip');
  ['rice', 'egg', 'seasonal_vegetables', 'fish'].forEach((id, i) => { if (emptyArt[i]) emptyArt[i].innerHTML = FoodIcons.icon(id); });
  I18N.applyStatic();
  updateLangButtons();
  applyTimeframeLabels();
  renderStaples();
  renderBudgetPresets();
  fillUnitSelect();
  renderPantry();
  updateBudgetHint();
  resetKpiText();
  I18N.syncDigits();
}

// Start as soon as the page structure exists (works whether the script runs before or after DOMContentLoaded).
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
