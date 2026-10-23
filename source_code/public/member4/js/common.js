/* ============================================================================
   SHARED CODE — loaded by BOTH Part A (tracker.html) and Part B (assistant.html)
   ============================================================================ */
const $ = id => document.getElementById(id);
const round1 = n => Math.round(n * 10) / 10;

/* Local date as YYYY-MM-DD (not UTC, so the day changes at local midnight) */
function todayStr() {
  const d = new Date(), z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

/* Nutrition dataset: loaded from /data/foods.json (shared with Members 1, 2 and 3) */
let FOODS = [];
const foodById = id => FOODS.find(f => f.id === id);
const FALLBACK_FOODS = [{"id":"egg","name":"Egg (boiled)","unit":"1 piece","kcal":78,"p":6.3,"c":0.6,"f":5.3,"al":["egg","eggs","dim","ডিম"]},{"id":"rice","name":"Rice (cooked)","unit":"1 cup","kcal":205,"p":4.3,"c":45,"f":0.4,"al":["rice","bhat","bhaat","ভাত"]},{"id":"roti","name":"Roti / Chapati","unit":"1 piece","kcal":100,"p":3,"c":18,"f":2,"al":["roti","chapati","ruti","রুটি"]},{"id":"paratha","name":"Paratha","unit":"1 piece","kcal":260,"p":5,"c":36,"f":10,"al":["paratha","porota","পরোটা"]},{"id":"dal","name":"Dal / Lentils (cooked)","unit":"1 cup","kcal":230,"p":18,"c":40,"f":0.8,"al":["dal","daal","lentil","lentils","ডাল"]},{"id":"chicken","name":"Chicken (cooked)","unit":"100 g","kcal":165,"p":31,"c":0,"f":3.6,"al":["chicken","murgi","মুরগি"]},{"id":"beef","name":"Beef curry","unit":"100 g","kcal":250,"p":26,"c":0,"f":15,"al":["beef","gorur","গরু"]},{"id":"fish","name":"Fish (Rui, cooked)","unit":"100 g","kcal":97,"p":16.6,"c":0,"f":3,"al":["fish","rui","mach","machh","মাছ"]},{"id":"veg","name":"Mixed vegetables","unit":"1 cup","kcal":80,"p":3,"c":15,"f":1,"al":["vegetable","vegetables","veg","sabji","shobji","সবজি"]},{"id":"potato","name":"Potato (boiled)","unit":"100 g","kcal":87,"p":1.9,"c":20,"f":0.1,"al":["potato","alu","aloo","আলু"]},{"id":"khichuri","name":"Khichuri","unit":"1 cup","kcal":250,"p":8,"c":40,"f":6,"al":["khichuri","khichri","খিচুড়ি"]},{"id":"milk","name":"Milk","unit":"1 cup","kcal":150,"p":8,"c":12,"f":8,"al":["milk","dudh","দুধ"]},{"id":"doi","name":"Yogurt (Doi)","unit":"1 cup","kcal":150,"p":8,"c":11,"f":8,"al":["yogurt","yoghurt","doi","curd","দই"]},{"id":"banana","name":"Banana","unit":"1 medium","kcal":105,"p":1.3,"c":27,"f":0.4,"al":["banana","kola","কলা"]},{"id":"apple","name":"Apple","unit":"1 medium","kcal":95,"p":0.5,"c":25,"f":0.3,"al":["apple","apel","আপেল"]},{"id":"muri","name":"Muri (puffed rice)","unit":"1 cup","kcal":56,"p":1,"c":12.5,"f":0.1,"al":["muri","puffed","মুড়ি"]},{"id":"oats","name":"Oats (cooked)","unit":"1 cup","kcal":154,"p":6,"c":27,"f":2.6,"al":["oats","oat"]},{"id":"bread","name":"Bread","unit":"1 slice","kcal":80,"p":3,"c":14,"f":1,"al":["bread","pauruti","পাউরুটি"]},{"id":"peanut","name":"Peanuts","unit":"28 g handful","kcal":160,"p":7,"c":5,"f":14,"al":["peanut","peanuts","badam","বাদাম"]},{"id":"singara","name":"Singara","unit":"1 piece","kcal":150,"p":3,"c":17,"f":8,"al":["singara","samosa","সিঙ্গারা"]}];
async function loadFoods() {
  try {
    const res = await fetch('data/foods.json');
    if (!res.ok) throw new Error('Could not load nutrition data');
    FOODS = await res.json();
  } catch (err) {
    // Local-file fallback: keeps the tracker usable when index.html is opened directly.
    FOODS = FALLBACK_FOODS;
  }
}
/* Pages wait for this before drawing anything */
const appReady = loadFoods().catch(err => {
  document.body.insertAdjacentHTML('afterbegin',
    '<div class="fatal">Could not load the nutrition data. Start the app with <b>npm start</b> and open http://localhost:3000 (do not open the file directly).</div>');
  throw err;
});

/* Browser storage (localStorage) — Part A saves entries here; Part B reads them */
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
};
const getLogs  = () => store.get('ls_logs', []);                                   // [{id,date,meal,foodId,qty}]
const getGoals = () => store.get('ls_goals', { kcal: 2000, p: 60, c: 250, f: 65 });

/* Add up calories/protein/carbs/fat for a list of log entries */
function totalsOf(list) {
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  list.forEach(e => {
    const food = foodById(e.foodId); if (!food) return;
    t.kcal += food.kcal * e.qty; t.p += food.p * e.qty; t.c += food.c * e.qty; t.f += food.f * e.qty;
  });
  return { kcal: Math.round(t.kcal), p: round1(t.p), c: round1(t.c), f: round1(t.f) };
}
