/* ============================================================================
   PART B — CONVERSATIONAL AI FOOD ASSISTANT  (JavaScript)
   ----------------------------------------------------------------------------
   B.1  Chat interface                       -> addMsg(), send(), quick-question chips
   B.2  Natural-language questions           -> sent to the backend: POST /api/chat
   B.3  Recipes from available ingredients   -> LLM (online) / RECIPES list (offline)
   B.4  Balanced-eating questions            -> LLM (online) / TIPS list (offline)
   B.5  Reliable nutrition information       -> server grounds the LLM with data/foods.json
   Uses helpers from common.js: $, FOODS, foodById, getLogs, getGoals, totalsOf, todayStr
   ============================================================================ */

let history = [];   // last messages sent to the AI: [{role:'user'|'assistant', content}]

/* B.1: Show a message in the chat window */
function addMsg(text, who, badge) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.textContent = text;                       // textContent keeps user input safe from HTML injection
  if (badge) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = badge; d.appendChild(b); }
  $('chatLog').appendChild(d);
  $('chatLog').scrollTop = $('chatLog').scrollHeight;
  return d;
}

/* B.2: Share today's food log from Part A, so the AI can answer "How am I doing today?" */
function buildContext() {
  const entries = getLogs().filter(l => l.date === todayStr());
  return { date: todayStr(), goals: getGoals(), totals: totalsOf(entries),
           entries: entries.map(e => ({ meal: e.meal, foodId: e.foodId, qty: e.qty })) };
}

/* B.2: THE REAL API CALL — browser -> our server -> LLM API (the API key stays on the server) */
async function askAI(message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: history.slice(-8), context: buildContext() })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const err = new Error(data.message || 'AI request failed'); err.code = data.error; throw err; }
  return data.reply;
}

/* Send one user message */
async function send(text) {
  text = text.trim(); if (!text) return;
  $('sendBtn').disabled = true;
  addMsg(text, 'user');
  $('chatInput').value = '';
  const typing = addMsg('Thinking…', 'bot typing');
  try {
    const reply = await askAI(text);
    typing.remove();
    addMsg(reply, 'bot');
    history.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
  } catch (err) {
    typing.remove();
    // If the AI is unavailable (no key, no internet, rate limit), still give a useful answer offline
    const msg = err.code === 'rate_limited' ? err.message : offlineReply(text);
    addMsg(msg, 'bot', err.code === 'rate_limited' ? '' : 'Offline mode: AI is not connected right now');
  } finally {
    $('sendBtn').disabled = false;
    $('chatInput').focus();
  }
}

$('chatForm').addEventListener('submit', e => { e.preventDefault(); send($('chatInput').value); });

/* B.1: Quick question buttons + welcome message */
['Calories in 2 eggs', 'I have rice, dal and egg. What can I cook?', 'Tips for balanced eating', 'How am I doing today?']
  .forEach(q => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = q;
    b.addEventListener('click', () => send(q)); $('chips').appendChild(b);
  });
addMsg('Hi! I can suggest recipes from your ingredients, tell you the nutrition of a food, and share balanced-eating tips.', 'bot');

/* ============================================================================
   PART B — OFFLINE FALLBACK (used only when the AI API cannot be reached)
   Simple keyword rules over the same food dataset, so the page never feels broken.
   ============================================================================ */
const RECIPES = [
  { name: 'Dal-Bhat with vegetables', needs: ['rice', 'dal', 'veg'],     how: 'Cook the dal with turmeric and salt, steam the rice, stir-fry the vegetables lightly.' },
  { name: 'Egg Khichuri',             needs: ['rice', 'dal', 'egg'],     how: 'Cook rice and dal together with a little oil and spices until soft, then top with egg.' },
  { name: 'Egg & Potato Curry',       needs: ['egg', 'potato'],          how: 'Boil the eggs, fry onion and spices, add potato and a little water, simmer, then add the eggs.' },
  { name: 'Egg Roti Roll',            needs: ['egg', 'roti'],            how: 'Make a thin omelette, place it on a warm roti with sliced onion and roll.' },
  { name: 'Fish Curry with Rice',     needs: ['fish', 'rice'],           how: 'Lightly fry the fish, simmer in an onion-turmeric gravy for 10 minutes, serve with rice.' },
  { name: 'Chicken & Potato Curry',   needs: ['chicken', 'potato'],      how: 'Cook chicken with onion and spices, add potato and water, simmer until tender.' },
  { name: 'Vegetable Bhaji with Roti',needs: ['veg', 'roti'],            how: 'Stir-fry mixed vegetables with a little oil, salt and cumin; eat with roti.' },
  { name: 'Banana Milk Smoothie',     needs: ['banana', 'milk'],         how: 'Blend a banana with a cup of cold milk.' },
  { name: 'Oats Bowl',                needs: ['oats', 'milk', 'banana'], how: 'Cook oats in milk for 5 minutes and top with sliced banana.' },
  { name: 'Yogurt Muri Snack',        needs: ['muri', 'doi'],            how: 'Mix muri with a little doi and chopped fruit.' },
];
const TIPS = [
  'A balanced plate: about half vegetables/fruit, a quarter protein (egg, fish, dal, chicken) and a quarter carbs (rice or roti).',
  'Try to include a protein source in every meal. Dal, egg and fish are affordable choices.',
  'Drink enough water and limit sugary drinks and deep-fried snacks.',
];

function findFoods(text) {
  const words = text.toLowerCase().split(/[^a-z\u0980-\u09FF]+/);
  return FOODS.filter(f => f.al.some(a => words.includes(a)));
}
const findQty = t => { const m = t.match(/(\d+(\.\d+)?)/); return m ? parseFloat(m[1]) : 1; };

function nutritionText(f, qty) {
  return `${qty} × ${f.name} (${f.unit}):\nCalories: ${Math.round(f.kcal * qty)} kcal\nProtein: ${round1(f.p * qty)} g\nCarbs: ${round1(f.c * qty)} g\nFat: ${round1(f.f * qty)} g`;
}

function offlineReply(q) {
  const text = q.toLowerCase(), foods = findFoods(text);
  const has = (...w) => w.some(x => text.includes(x));

  if (has('diabetes', 'cancer', 'disease', 'medicine', 'kidney', 'pressure', 'treatment', 'diagnos', 'pregnan'))
    return 'I can only share general food information. For a medical condition, please ask a doctor or registered dietitian.';

  if (has('recipe', 'cook', 'make', 'ingredient', 'i have', 'what can i')) {
    if (!foods.length) return 'Tell me what you have, for example: "I have egg, rice and potato. What can I cook?"';
    const ids = foods.map(f => f.id);
    const found = RECIPES.map(r => ({ r, missing: r.needs.filter(n => !ids.includes(n)) }))
      .filter(x => x.missing.length < x.r.needs.length && x.r.needs.length - x.missing.length >= Math.min(2, x.r.needs.length))
      .sort((a, b) => a.missing.length - b.missing.length).slice(0, 3);
    if (!found.length) return 'I could not find a recipe for those. Try adding one more ingredient, like rice, dal or vegetables.';
    return found.map(x => `• ${x.r.name}\n  ${x.r.how}` +
      (x.missing.length ? `\n  Also needed: ${x.missing.map(i => foodById(i).name).join(', ')}` : '\n  You have everything!')).join('\n\n');
  }

  if (has('today', 'my day', 'progress', 'so far', 'eaten', 'left')) {
    const c = buildContext();
    if (!c.entries.length) return "You haven't logged any food today. Add something in the Food Log first.";
    return `Today so far: ${c.totals.kcal} kcal, ${c.totals.p} g protein, ${c.totals.c} g carbs, ${c.totals.f} g fat.\n` +
           `Goal: ${c.goals.kcal} kcal (${Math.max(c.goals.kcal - c.totals.kcal, 0)} kcal left).`;
  }

  if (foods.length) { const qty = findQty(text); return foods.map(f => nutritionText(f, qty)).join('\n\n'); }
  if (has('balanced', 'healthy', 'diet', 'tips')) return TIPS.map(t => '• ' + t).join('\n');
  return 'I am in offline mode right now. Try: "Calories in 2 eggs", "I have rice, dal and egg. What can I cook?" or "Tips for balanced eating".';
}
