/* ============================================================================
   PART A — DAILY NUTRITION & FOOD HABIT TRACKER  (JavaScript)
   Uses helpers from common.js: $, FOODS, foodById, store, getLogs, getGoals, totalsOf
   ============================================================================ */
const MEALS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snacks' };
function foodEmoji(name){const n=String(name||'').toLowerCase();if(/rice|bhaat|ভাত|चावल/.test(n))return '🍚';if(/egg|ডিম|अंड/.test(n))return '🥚';if(/fish|ilish|hilsa|মাছ|মাছ|मछली/.test(n))return '🐟';if(/chicken|মুরগি|चिकन/.test(n))return '🍗';if(/dal|lentil|ডাল|दाल/.test(n))return '🥣';if(/milk|দুধ|दूध/.test(n))return '🥛';if(/apple|আপেল|सेब/.test(n))return '🍎';if(/banana|কলা|केला/.test(n))return '🍌';if(/vegetable|সবজি|सब्ज/.test(n))return '🥗';if(/bread|রুটি|रोटी/.test(n))return '🍞';return '🍽️';}

let logs = [];                 // A.5: saved in localStorage ("ls_logs")
let goals = getGoals();        // A.3: saved in localStorage ("ls_goals")
let viewDate = todayStr();

appReady.then(() => {
  logs = getLogs();
  $('logFood').innerHTML = FOODS.map(f => `<option value="${f.id}">${f.name} — ${f.unit}</option>`).join('');
  $('logDate').value = viewDate;
  loadGoalInputs();
  renderTracker();
});

/* A.1: Add a food entry */
$('addBtn').addEventListener('click', () => {
  const qty = parseFloat($('logQty').value);
  if (!(qty > 0)) { alert('Please enter a quantity greater than 0.'); return; }
  viewDate = $('logDate').value || todayStr();
  logs.push({ id: Date.now(), date: viewDate, meal: $('logMeal').value, foodId: $('logFood').value, qty });
  store.set('ls_logs', logs);
  try { window.parent.postMessage({ type: 'NOURIVA_FOOD_LOG_UPDATED', logs: getLogs(), goals: getGoals() }, window.location.origin); } catch (e) {}
  renderTracker();
});

/* A.3: Save user-defined goals */
function loadGoalInputs() {
  $('gKcal').value = goals.kcal; $('gP').value = goals.p; $('gC').value = goals.c; $('gF').value = goals.f;
}
$('saveGoals').addEventListener('click', () => {
  goals = { kcal: +$('gKcal').value || 0, p: +$('gP').value || 0, c: +$('gC').value || 0, f: +$('gF').value || 0 };
  store.set('ls_goals', goals);
  renderTracker();
});

/* Changing the date shows that day's log */
$('logDate').addEventListener('change', e => { viewDate = e.target.value || todayStr(); renderTracker(); });

/* A.2 + A.3: Daily totals with progress bars toward goals */
function renderProgress() {
  const t = totalsOf(logs.filter(l => l.date === viewDate));
  const rows = [['Calories', 'kcal', 'kcal'], ['Protein', 'p', 'g'], ['Carbs', 'c', 'g'], ['Fat', 'f', 'g']];
  $('summaryTitle').textContent = viewDate === todayStr() ? "Today's summary" : `Summary for ${viewDate}`;
  $('progress').innerHTML = rows.map(([label, key, unit]) => {
    const goal = goals[key] || 0;
    const pct = goal ? Math.round(t[key] / goal * 100) : 0;
    return `<div class="prog">
      <div class="top"><span>${label}</span><span>${t[key]} / ${goal || '–'} ${unit}${goal ? ` (${pct}%)` : ''}</span></div>
      <div class="bar ${pct > 100 ? 'over' : ''}"><i style="width:${Math.min(pct, 100)}%"></i></div></div>`;
  }).join('');
}

/* A.4: Entries of the selected date, grouped by meal, with delete */
function renderEntries() {
  const day = logs.filter(l => l.date === viewDate);
  if (!day.length) { $('entries').innerHTML = '<p class="muted">Nothing logged for this day yet. Add your first food on the left.</p>'; return; }
  $('entries').innerHTML = Object.keys(MEALS).map(m => {
    const items = day.filter(l => l.meal === m); if (!items.length) return '';
    const mealEmoji = {breakfast:'🌅', lunch:'🍛', dinner:'🌙', snack:'🍎'}[m] || '🍽️';
    return `<div class="meal-title"><span class="meal-emoji">${mealEmoji}</span> ${MEALS[m]} · ${totalsOf(items).kcal} kcal</div>` + items.map(l => {
      const f = foodById(l.foodId); if (!f) return '';
      return `<div class="entry"><span><span class="food-emoji">${foodEmoji(f.name)}</span> ${l.qty} × ${f.name} <span class="muted">(${Math.round(f.kcal * l.qty)} kcal)</span></span>
        <button type="button" title="Remove" aria-label="Remove ${f.name}" data-remove="${l.id}">✕</button></div>`;
    }).join('');
  }).join('');
}
$('entries').addEventListener('click', e => {
  const id = e.target.dataset && e.target.dataset.remove;
  if (!id) return;
  logs = logs.filter(l => String(l.id) !== id);
  store.set('ls_logs', logs);
  try { window.parent.postMessage({ type: 'NOURIVA_FOOD_LOG_UPDATED', logs: getLogs(), goals: getGoals() }, window.location.origin); } catch (e) {}
  renderTracker();
});

/* A.4: Food history — previous days (newest first); click one to open it */
function renderHistory() {
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse();
  if (!dates.length) { $('history').innerHTML = '<p class="muted">Your past days will appear here.</p>'; return; }
  $('history').innerHTML = dates.slice(0, 14).map(d => {
    const t = totalsOf(logs.filter(l => l.date === d));
    return `<button type="button" class="hist" data-date="${d}"><span>${d}</span><span>${t.kcal} kcal · P ${t.p}g · C ${t.c}g · F ${t.f}g</span></button>`;
  }).join('');
}
$('history').addEventListener('click', e => {
  const btn = e.target.closest('[data-date]'); if (!btn) return;
  viewDate = btn.dataset.date; $('logDate').value = viewDate; renderTracker();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function renderTracker() { renderProgress(); renderEntries(); renderHistory(); }
