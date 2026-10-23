/**
 * OPTIONAL advanced test for version 2 features (English/Bangla switch + home inventory quantities).
 *   node tests/e2e-v2-playwright.js            (tests file:// directly)
 *   BASE_URL=http://localhost:8000 node tests/e2e-v2-playwright.js
 * Needs Node.js + Playwright (see tests/e2e-playwright.js). Beginners can ignore this file.
 */
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.env.BASE_URL
  ? process.env.BASE_URL.replace(/\/$/, '') + '/index.html'
  : 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOT_DIR = process.env.SHOT_DIR || null;

const results = [];
let browser;
const ignorable = t => /fonts\.g(oogleapis|static)|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/.test(t);
const test = (name, fn) => results.push({ name, fn });
const ok = (c, m) => { if (!c) throw new Error('assertion failed: ' + (m || '')); };
const eq = (a, b, m) => { if (a !== b) throw new Error(`${m || 'eq'}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const near = (a, b, tol, m) => { if (!(Math.abs(a - b) <= tol)) throw new Error(`${m || 'near'}: expected ~${b} got ${a}`); };

const toEn = s => String(s).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
const num = s => { const m = toEn(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
/** "1.59 kg" / "১.৫৯ কেজি" / "8 pcs" / "৮টি" / "500 ml" / "1.5 L" -> number in g / pieces / ml */
function qty(s) {
  s = toEn(s).replace(/,/g, '');
  const n = parseFloat((s.match(/\d+(\.\d+)?/) || [NaN])[0]);
  if (/কেজি|\bkg\b/.test(s)) return n * 1000;
  if (/মি\.লি\.|\bml\b/.test(s)) return n;
  if (/লিটার|\bL\b/.test(s)) return n * 1000;
  return n;                                           // g, গ্রাম, pcs, টি
}
const text = (p, sel) => p.$eval(sel, e => e.textContent.trim());
const visible = (p, sel) => p.isVisible(sel);

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1366, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  if (opts.lang) await ctx.addInitScript(l => { try { if (!sessionStorage.getItem('__seeded')) { localStorage.setItem('foodsphere.lang', l); sessionStorage.setItem('__seeded', '1'); } } catch (e) { /* ignore */ } }, opts.lang);
  const page = await ctx.newPage();
  page._errors = [];
  page.on('console', m => { if (m.type() === 'error' && !ignorable(m.text())) page._errors.push(m.text()); });
  page.on('pageerror', e => page._errors.push('PAGEERROR ' + e.message));
  await page.goto(BASE);
  await page.waitForSelector('#budgetInput');
  return page;
}
async function addItem(p, name, q, unit) {
  await p.fill('#ingredientInput', name);
  await p.fill('#ingredientQty', q || '');
  if (unit) await p.selectOption('#ingredientUnit', unit);
  await p.click('#btnAddIngredient');
}
async function generate(p) {
  await p.click('#btnGenerate');
  await p.waitForSelector('#resultsContent:not([hidden])');
  await p.waitForFunction(() => !document.getElementById('btnGenerate').disabled);
}
const SPEC = [['Rice', '2', 'kg'], ['Eggs', '6', 'piece'], ['Potatoes', '1', 'kg'], ['Milk', '500', 'ml'], ['Lentils', '500', 'g']];
async function specScenario(p) {
  await p.click('#toggleWeekly'); await p.fill('#budgetInput', '1800');
  for (const [n, q, u] of SPEC) await addItem(p, n, q, u);
  await generate(p);
}
async function checkRows(p) {
  return p.$$eval('#inventoryCheckBody .chk-row:not(.chk-head)', rows => rows.map(r => {
    const cells = [...r.querySelectorAll('.chk-cell')].map(c => c.textContent.trim());
    return { food: r.dataset.food, status: [...r.classList].find(c => c.startsWith('status-')).slice(7), needed: cells[0], home: cells[1], left: cells[2], buy: cells[3], badge: r.querySelector('.chk-status').textContent.trim() };
  }));
}
async function visibleEnglishWords(p) {
  return p.evaluate(() => {
    const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const el = n.parentElement;
      if (!el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || el.closest('svg') || el.closest('[hidden]') || el.closest('.lang-switch') || el.closest('.unrecognized .tag-label')) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      (n.nodeValue.match(/[A-Za-z]{2,}/g) || []).forEach(x => { if (!['Foodsphere', 'Nutritio', 'Intelligence'].includes(x)) out.push(x + ' @ ' + (el.className || el.tagName)); });
    }
    return out;
  });
}

// ---------------------------------------------------------------------------
// LANGUAGE
// ---------------------------------------------------------------------------
test('L01 Header has an easy-to-find language switch (English / বাংলা), English by default', async () => {
  const p = await newPage();
  ok(await visible(p, '.lang-switch'), 'switch visible'); ok(await visible(p, '#langEn') && await visible(p, '#langBn'));
  eq(await text(p, '#langBn'), 'বাংলা'); eq(await text(p, '#langEn'), 'English');
  eq(await p.getAttribute('#langEn', 'aria-pressed'), 'true'); eq(await p.getAttribute('#langBn', 'aria-pressed'), 'false');
  eq(await p.$eval('html', e => e.lang), 'en');
  const box = await p.$eval('.lang-switch', e => { const r = e.getBoundingClientRect(); return { top: r.top, h: r.height }; });
  ok(box.top < 120 && box.h >= 30, 'in the header: ' + JSON.stringify(box));
  eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
});

test('L02 Switching to Bangla translates navigation, headings, forms, buttons and hints; html lang=bn', async () => {
  const p = await newPage();
  await p.click('#langBn');
  eq(await p.$eval('html', e => e.lang), 'bn');
  eq(await p.getAttribute('#langBn', 'aria-pressed'), 'true'); eq(await p.getAttribute('#langEn', 'aria-pressed'), 'false');
  eq(await text(p, '#heroTitle'), 'আপনার টাকার বাজেটের মধ্যেই খান পুষ্টিকর খাবার');
  eq(await text(p, '#toggleDaily'), 'দৈনিক'); eq(await text(p, '#btnGenerateLabel'), 'খাবারের পরিকল্পনা তৈরি করুন'); eq(await text(p, '#btnReset'), 'সব রিসেট করুন');
  eq(await text(p, '#budgetLabelText'), 'দৈনিক বাজেট'); ok((await text(p, '#budgetHint')).includes('আজকের'));
  eq(await p.getAttribute('#ingredientInput', 'placeholder'), 'যেমন চাল, ডিম, আলু');
  eq(await p.getAttribute('#budgetInput', 'placeholder'), 'যেমন ২৫০');
  ok((await p.title()).includes('বাজেটভিত্তিক'), 'page title translated');
  eq(await text(p, '#emptyHero h2'), 'আপনার খাবারের পরিকল্পনা এখানে দেখা যাবে');
  eq((await p.$$eval('.pref-body strong', e => e.map(x => x.textContent.trim()))).join(','), 'সুষম,প্রোটিন বেশি,নিরামিষ,ডায়াবেটিস-বান্ধব,সর্বোচ্চ সাশ্রয়');
  eq((await p.$$eval('#quickStaples .staple-chip', e => e.map(x => x.textContent.trim()))).slice(0, 3).join(','), '+ চাল,+ ডিম,+ ডাল');
  ok((await text(p, '.app-footer')).includes('চিকিৎসা পরামর্শ নয়'));
  ok(await p.$eval('#budgetPresets .chip-btn', e => /[০-৯]/.test(e.textContent)), 'presets use Bangla digits');
  await p.context().close();
});

test('L03 No untranslated English is left on screen in Bangla mode (empty state, full weekly plan, low budget, diabetic, shortage)', async () => {
  const allowedLeft = [];
  const p = await newPage({ lang: 'bn' });
  eq(await p.$eval('html', e => e.lang), 'bn');
  const check = async (label) => { const w = await visibleEnglishWords(p); eq(w.length, 0, `${label}: English words -> ${w.slice(0, 8).join(' | ')}`); };
  await check('empty state');
  await specScenario(p);
  await p.check('input[name="preference"][value="diabetic-friendly"]'); await p.waitForTimeout(100);
  await check('weekly + inventory + diabetic');
  await p.click('#tab-day-3'); await check('day tab');
  await p.fill('#budgetInput', '100'); await p.waitForFunction(() => document.getElementById('resultsBadge').textContent.includes('বেশি'));
  await check('too-low weekly budget');
  await p.click('#toggleDaily'); await p.fill('#budgetInput', '30'); await p.waitForTimeout(500);
  await check('too-low daily budget');
  await p.fill('#budgetInput', 'abc'); await p.click('#btnGenerate'); await p.waitForSelector('#budgetError:not([hidden])'); await check('validation error');
  await p.fill('#ingredientQty', 'x'); await p.fill('#ingredientInput', 'rice'); await p.click('#btnAddIngredient'); await check('inventory error message');
  eq(allowedLeft.length, 0); eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
});

test('L04 The chosen language is remembered after a reload and after coming back (file:// and http)', async () => {
  const p = await newPage();
  await p.click('#langBn'); await p.reload(); await p.waitForSelector('#budgetInput');
  eq(await p.$eval('html', e => e.lang), 'bn', 'still Bangla after reload');
  eq(await text(p, '#toggleDaily'), 'দৈনিক'); eq(await p.getAttribute('#langBn', 'aria-pressed'), 'true');
  eq(await p.evaluate(() => localStorage.getItem('foodsphere.lang')), 'bn');
  await p.click('#langEn'); await p.reload(); await p.waitForSelector('#budgetInput');
  eq(await p.$eval('html', e => e.lang), 'en'); eq(await text(p, '#toggleDaily'), 'Daily');
  await p.context().close();
});

test('L05 Switching language keeps ALL user data: budget, period, pantry amounts, preference, day, shopping edits, ticks', async () => {
  const p = await newPage();
  await p.click('#toggleWeekly'); await p.fill('#budgetInput', '1800');
  await addItem(p, 'Rice', '2', 'kg'); await addItem(p, 'Eggs', '6', 'piece'); await addItem(p, 'salt', '', '');
  await p.check('input[name="preference"][value="high-protein"]');
  await generate(p);
  await p.click('#tab-day-3');
  const shopFirst = '.shop-row:first-child';
  await p.check(`${shopFirst} .shop-check`);
  await p.click(`${shopFirst} [data-action="inc"]`); await p.click(`${shopFirst} [data-action="inc"]`);
  const snap = async () => ({
    budget: await p.inputValue('#budgetInput'), weekly: await p.$eval('#toggleWeekly', e => e.classList.contains('active')),
    pref: await p.$eval('input[name="preference"]:checked', e => e.value),
    tags: await p.$$eval('#pantryTagsList .inventory-item', t => t.map(x => (x.querySelector('.inv-qty') ? x.querySelector('.inv-qty').value + '/' + x.querySelector('.inv-unit').value : 'unknown'))),
    day: await p.$eval('.day-tab[aria-selected="true"]', e => e.dataset.day),
    qty: await p.inputValue(`${shopFirst} .qty-input-field`), ticked: await p.isChecked(`${shopFirst} .shop-check`),
    cost: num(await text(p, '#summaryCostAmount')), remaining: num(await text(p, '#summaryRemainingAmount')),
    kcal: num(await text(p, '#valCalories')), shopTotal: num(await text(p, '#shoppingGrandTotal')),
    meals: (await p.$$eval('.meal-card .macro-tile:first-child strong', e => e.map(x => x.textContent))).map(x => parseFloat(toEn(x))),
    adjust: await p.isVisible('#adjustNote')
  });
  const before = await snap();
  ok(before.ticked && before.adjust && before.day === '3', 'precondition ' + JSON.stringify(before));
  await p.click('#langBn');
  const bn = await snap();
  eq(JSON.stringify(bn), JSON.stringify(before), 'all data identical after switching to Bangla');
  await p.click('#langEn');
  const back = await snap();
  eq(JSON.stringify(back), JSON.stringify(before), 'all data identical after switching back');
  ok(await visible(p, '#pantryNote'), 'unknown-item note still there');
  eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
});

test('L06 Bangla mode: numbers are shown in Bangla digits, typed Bangla digits are accepted', async () => {
  const p = await newPage({ lang: 'bn' });
  await p.fill('#budgetInput', '২৫০'); await generate(p);
  const kpi = await text(p, '#summaryBudgetAmount');
  ok(/[০-৯]/.test(kpi) && !/[0-9]/.test(kpi), 'KPI digits: ' + kpi);
  eq(num(kpi), 250);
  ok(!/[0-9]/.test(await text(p, '#valCalories')), 'nutrition digits are Bangla');
  ok((await text(p, '#summaryCostAmount')).includes('টাকা'), 'currency word in Bangla');
  ok(!/[0-9]/.test(await p.$eval('.meal-card', e => e.innerText)), 'meal card has no ASCII digits');
  await p.fill('#ingredientInput', 'চাল'); await p.fill('#ingredientQty', '২'); await p.selectOption('#ingredientUnit', 'kg'); await p.click('#btnAddIngredient');
  eq(await p.$eval('#pantryTagsList .inv-qty', e => e.value), '2', 'Bangla digit normalised');
  eq(await p.$$eval('#pantryTagsList .tag-item', t => t.length), 1);
  await p.context().close();
});

test('L07 Bangla validation messages for empty / negative / zero / text / huge budgets', async () => {
  const p = await newPage({ lang: 'bn' });
  const cases = [['', 'বাজেট'], ['-50', 'ঋণাত্মক'], ['0', 'বেশি হতে হবে'], ['abc', 'সঠিক পরিমাণ নয়'], ['999999', 'বাস্তবসম্মত']];
  for (const [v, expect] of cases) {
    await p.fill('#budgetInput', v); await p.click('#btnGenerate'); await p.waitForSelector('#budgetError:not([hidden])');
    const m = await text(p, '#budgetError'); ok(m.includes(expect), `${v} -> ${m}`);
    ok(!/[A-Za-z]{3,}/.test(m), 'no English in: ' + m);
  }
  await p.context().close();
});

test('L08 Typography: Bangla font stack, roomy line height, no letter-spacing or uppercase', async () => {
  const p = await newPage({ lang: 'bn' });
  const st = await p.evaluate(() => {
    const cs = e => getComputedStyle(document.querySelector(e));
    return { family: cs('body').fontFamily, lh: parseFloat(cs('body').lineHeight) / parseFloat(cs('body').fontSize), h2ls: cs('.hero h2').letterSpacing, labelTT: cs('.kpi-label').textTransform, btn: cs('button').fontFamily };
  });
  ok(/Hind Siliguri/.test(st.family) && /Nirmala UI/.test(st.family), st.family);
  ok(st.lh >= 1.6, 'line height ' + st.lh);
  ok(['normal', '0px'].includes(st.h2ls), 'letter-spacing ' + st.h2ls); eq(st.labelTT, 'none'); ok(/Hind Siliguri/.test(st.btn), 'buttons use it too');
  await p.context().close();
});

test('L09 Language buttons are keyboard operable and announced (aria-pressed, lang attributes)', async () => {
  const p = await newPage();
  await p.focus('#langEn'); await p.keyboard.press('Tab'); eq(await p.evaluate(() => document.activeElement.id), 'langBn');
  await p.keyboard.press('Enter'); eq(await p.$eval('html', e => e.lang), 'bn');
  eq(await p.getAttribute('#langBn', 'lang'), 'bn'); eq(await p.getAttribute('#langEn', 'lang'), 'en');
  eq(await p.getAttribute('.lang-switch', 'role'), 'group'); ok((await p.getAttribute('.lang-switch', 'aria-label')).includes('ভাষা'));
  await p.context().close();
});

test('L10 Meals are shown with Bangla names and descriptions in Bangla mode, English + Bangla subtitle in English mode', async () => {
  const p = await newPage();
  await p.fill('#budgetInput', '300'); await generate(p);
  ok(await p.$eval('.meal-bengali-title', e => /[\u0980-\u09FF]/.test(e.textContent)), 'English mode: Bangla subtitle');
  const enTitle = await text(p, '#breakfastCard .meal-title');
  await p.click('#langBn');
  const bnTitle = await text(p, '#breakfastCard .meal-title');
  ok(/[\u0980-\u09FF]/.test(bnTitle) && !/[A-Za-z]/.test(bnTitle) && bnTitle !== enTitle, bnTitle);
  ok(await p.$eval('#breakfastCard .meal-desc', e => /[\u0980-\u09FF]/.test(e.textContent) && !/[A-Za-z]/.test(e.textContent)), 'description in Bangla');
  eq(await p.$$eval('.meal-bengali-title', e => e.length), 0, 'no English subtitle in Bangla mode');
  eq(await p.$$eval('.meal-type-tag', e => e.map(x => x.textContent.trim()).join(',')), 'সকালের নাশতা,দুপুরের খাবার,রাতের খাবার');
  await p.context().close();
});

// ---------------------------------------------------------------------------
// INVENTORY
// ---------------------------------------------------------------------------
test('I01 Add, edit and remove home food with amounts; units offered match the food (kg/g, pieces, L/ml)', async () => {
  const p = await newPage();
  await p.fill('#ingredientInput', 'rice');
  eq((await p.$$eval('#ingredientUnit option', o => o.map(x => x.value))).join(), 'kg,g');
  await p.fill('#ingredientInput', 'eggs'); eq((await p.$$eval('#ingredientUnit option', o => o.map(x => x.value))).join(), 'piece');
  await p.fill('#ingredientInput', 'milk'); eq((await p.$$eval('#ingredientUnit option', o => o.map(x => x.value))).join(), 'l,ml');
  await p.fill('#ingredientInput', 'roti'); eq((await p.$$eval('#ingredientUnit option', o => o.map(x => x.value))).join(), 'piece,kg,g');
  await p.fill('#ingredientInput', ''); eq(await p.$$eval('#ingredientUnit option', o => o.length), 5);
  for (const [n, q, u] of SPEC) await addItem(p, n, q, u);
  eq(await p.$$eval('#pantryTagsList .inventory-item', t => t.length), 5);
  eq((await p.$$eval('#pantryTagsList .inventory-item', t => t.map(x => x.querySelector('.inv-qty').value + ' ' + x.querySelector('.inv-unit').value))).join('; '), '2 kg; 6 piece; 1 kg; 500 ml; 500 g');
  await p.fill('#pantryTagsList .inventory-item:nth-child(1) .inv-qty', '3'); await p.press('#pantryTagsList .inventory-item:nth-child(1) .inv-qty', 'Tab');
  ok((await text(p, '#pantryMessage')).includes('3'), 'edit confirmed: ' + await text(p, '#pantryMessage'));
  await p.click('#pantryTagsList .inventory-item:nth-child(2) .tag-remove');
  eq(await p.$$eval('#pantryTagsList .inventory-item', t => t.length), 4);
  eq(await p.$eval('#pantryTagsList .inventory-item:nth-child(1) .inv-qty', e => e.value), '3');
  eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
});

test('I02 Bad amounts are rejected with a clear message and nothing is added (text, negative, decimals of pieces, huge, multiple items)', async () => {
  const p = await newPage();
  const tries = [['rice', 'abc', 'kg', 'valid amount'], ['rice', '-2', 'kg', 'negative'], ['eggs', '2.5', 'piece', 'whole number'], ['rice', '5000', 'kg', 'too large'], ['rice, eggs', '2', 'kg', 'one item at a time']];
  for (const [n, q, u, expect] of tries) {
    await p.fill('#ingredientInput', n); await p.fill('#ingredientQty', q);
    if (!n.includes(',')) await p.selectOption('#ingredientUnit', u);
    await p.click('#btnAddIngredient');
    const m = await text(p, '#pantryMessage'); ok(m.toLowerCase().includes(expect), `${n} ${q} -> ${m}`);
    eq(await p.getAttribute('#ingredientQty', 'aria-invalid'), 'true');
    eq(await p.$$eval('#pantryTagsList .tag-item', t => t.length), 0, 'nothing added for ' + q);
  }
  await p.context().close();
});

test('I03 Duplicates are still blocked, even when an amount is typed; the amount can be edited in the list instead', async () => {
  const p = await newPage();
  await addItem(p, 'rice', '1', 'kg');
  await addItem(p, 'Rice', '5', 'kg'); ok((await text(p, '#pantryMessage')).includes('already'));
  await addItem(p, 'চাল', '', ''); ok((await text(p, '#pantryMessage')).includes('already'));
  eq(await p.$$eval('#pantryTagsList .tag-item', t => t.length), 1); eq(await p.$eval('#pantryTagsList .inv-qty', e => e.value), '1', 'amount unchanged');
  await p.context().close();
});

test('I04 Editing amounts in the list: valid edits apply live, invalid ones are undone with a message, unit change converts (2 kg -> 2000 g)', async () => {
  const p = await newPage();
  await addItem(p, 'rice', '2', 'kg');
  const q = '#pantryTagsList .inv-qty', u = '#pantryTagsList .inv-unit';
  await p.selectOption(u, 'g'); eq(await p.inputValue(q), '2000', 'converted');
  await p.selectOption(u, 'kg'); eq(await p.inputValue(q), '2');
  await p.fill(q, 'abc'); await p.press(q, 'Tab');
  eq(await p.inputValue(q), '2', 'invalid edit undone'); ok((await text(p, '#pantryMessage')).includes('valid amount'));
  await p.fill(q, '-1'); await p.press(q, 'Tab'); eq(await p.inputValue(q), '2'); ok((await text(p, '#pantryMessage')).includes('negative'));
  await p.fill(q, ''); await p.press(q, 'Tab'); eq(await p.getAttribute(q, 'placeholder'), 'plenty'); ok((await text(p, '#pantryMessage')).includes('plenty'));
  await p.context().close();
});

test('I05 The weekly plan uses the stock: ingredient check shows needed / at home / left / to buy and the numbers add up', async () => {
  const p = await newPage();
  await specScenario(p);
  ok(await visible(p, '#inventoryCheckCard'));
  const rows = await checkRows(p);
  const by = f => rows.find(r => r.food === f);
  const initial = { rice: 2000, egg: 6, potato: 1000, milk: 500, lentils_daal: 500 };
  for (const f of Object.keys(initial)) {
    const r = by(f); ok(r, 'row ' + f);
    near(qty(r.home), initial[f], 0.001, f + ' at home');
    const needed = qty(r.needed), left = qty(r.left), buy = r.buy === '—' ? 0 : qty(r.buy.split('·')[0]);
    near(needed, (initial[f] - left) + buy, Math.max(1.1, needed * 0.02), `${f}: needed = used from home + to buy (${r.needed} | ${r.home} | ${r.left} | ${r.buy})`);
    ok(left <= initial[f], f + ' left <= at home');
    eq(r.status, buy > 0 ? 'short' : 'enough', f + ' status');
  }
  ok(rows.filter(r => r.status === 'none').every(r => r.home === '—'), 'items not at home show a dash');
  eq(await p.$$eval('#shoppingListContainer .shop-row', r => r.length), rows.filter(r => r.buy !== '—').length, 'shopping list has one line per item to buy');
  ok(await visible(p, '#inventorySummary'));
  eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
});

test('I06 Insufficient stock is flagged and the missing amount and its cost match the shopping list (only 2 eggs)', async () => {
  const p = await newPage();
  await p.click('#toggleWeekly'); await p.fill('#budgetInput', '2100'); await p.check('input[name="preference"][value="high-protein"]');
  await addItem(p, 'eggs', '2', 'piece'); await generate(p);
  const e = (await checkRows(p)).find(r => r.food === 'egg');
  eq(e.status, 'short'); ok(/Short by/.test(e.badge), e.badge);
  const buyQty = qty(e.buy.split('·')[0]), buyCost = num(e.buy.split('·')[1]);
  ok(buyQty > 0);
  near(qty(e.needed), 2 + buyQty, 0.001);
  const shopQty = await p.$$eval('.shop-row', rows => { const r = rows.find(x => x.dataset.foodId === 'egg'); return r ? { q: parseFloat(r.querySelector('.qty-input-field').value), c: r.querySelector('.shop-cost').textContent } : null; });
  eq(shopQty.q, buyQty, 'shopping list buys exactly the shortfall'); near(num(shopQty.c), buyCost, 0.001, 'same cost');
  ok(/not enough/i.test(await text(p, '#formStatusText')), 'notice in the banner');
  ok(/not fully covered/.test(await text(p, '#inventorySummary')));
  await p.context().close();
});

test('I07 Sufficient stock shows "Enough" with the remaining quantity; plenty-items show "Amount not set"', async () => {
  const p = await newPage();
  await p.click('#toggleWeekly'); await p.fill('#budgetInput', '1800');
  await addItem(p, 'rice', '50', 'kg');
  await p.click('.staple-chip[data-food="lentils_daal"]');
  await generate(p);
  const rows = await checkRows(p);
  const rice = rows.find(r => r.food === 'rice'); eq(rice.status, 'enough');
  const left = qty(rice.left), need = qty(rice.needed); near(left, 50000 - need, 1.1, 'remaining = stock - needed');
  const daal = rows.find(r => r.food === 'lentils_daal'); eq(daal.status, 'assumed'); eq(daal.left, '—'); ok(daal.home.includes('plenty'));
  eq(await p.$$eval('.shop-row', r => r.filter(x => ['rice', 'lentils_daal'].includes(x.dataset.foodId)).length), 0, 'nothing to buy for these two');
  await p.context().close();
});

test('I08 Limited stock raises the cost compared with unlimited; quantities change the plan live', async () => {
  const p = await newPage();
  await p.click('#toggleWeekly'); await p.fill('#budgetInput', '1800');
  await p.click('.staple-chip[data-food="rice"]'); await p.click('.staple-chip[data-food="egg"]'); await generate(p);
  const plenty = num(await text(p, '#summaryCostAmount'));
  await p.fill('#pantryTagsList .inventory-item:nth-child(2) .inv-qty', '2'); await p.press('#pantryTagsList .inventory-item:nth-child(2) .inv-qty', 'Tab');
  const fewEggs = num(await text(p, '#summaryCostAmount'));
  ok(fewEggs > plenty, `${fewEggs} > ${plenty}`);
  await p.selectOption('#pantryTagsList .inventory-item:nth-child(1) .inv-unit', 'g');                 // unit first (the amount is still empty)
  await p.fill('#pantryTagsList .inventory-item:nth-child(1) .inv-qty', '100'); await p.press('#pantryTagsList .inventory-item:nth-child(1) .inv-qty', 'Tab');
  const fewRice = num(await text(p, '#summaryCostAmount'));
  ok(fewRice > fewEggs, `${fewRice} > ${fewEggs}`);
  await p.click('#pantryTagsList .inventory-item:nth-child(1) .tag-remove');
  ok(num(await text(p, '#summaryCostAmount')) >= fewRice - 0.01, 'removing rice does not make it cheaper');
  await p.context().close();
});

test('I09 Roti/atta entered by weight is clearly an ESTIMATE (note on the item and flag in the check)', async () => {
  const p = await newPage();
  await addItem(p, 'atta', '1', 'kg');
  ok((await text(p, '#pantryTagsList .inv-note')).includes('estimate'), await text(p, '#pantryTagsList .inv-note'));
  ok((await text(p, '#pantryTagsList .inv-note')).includes('25'), 'about 25 rotis');
  await p.fill('#budgetInput', '300'); await generate(p);
  ok(await p.isVisible('#inventoryCheckBody .est-flag') || (await p.$$eval('.est-flag', e => e.length)) === 0, 'flag only if roti is used');
  await p.click('#langBn');
  ok((await text(p, '#pantryTagsList .inv-note')).includes('আনুমানিক'), 'estimate label in Bangla');
  await p.context().close();
});

test('I10 Same inventory + same plan in Bangla: identical numbers, Bangla labels and statuses', async () => {
  const p = await newPage();
  await specScenario(p);
  const en = await checkRows(p); const enCost = num(await text(p, '#summaryCostAmount')); const enShop = await p.$$eval('.shop-row .shop-cost', e => e.map(x => x.textContent));   // Bangla page text is converted back to ASCII below
  await p.click('#langBn');
  const bn = await checkRows(p);
  eq(bn.length, en.length);
  en.forEach((r, i) => {
    eq(bn[i].food, r.food); eq(bn[i].status, r.status);
    near(qty(bn[i].needed), qty(r.needed), 0.001, r.food + ' needed'); near(qty(bn[i].left || '0'), qty(r.left || '0'), 0.001, r.food + ' left');
    if (r.buy !== '—') near(qty(bn[i].buy.split('·')[0]), qty(r.buy.split('·')[0]), 0.001, r.food + ' buy');
  });
  eq(num(await text(p, '#summaryCostAmount')), enCost);
  eq((await p.$$eval('.shop-row .shop-cost', e => e.map(x => x.textContent))).map(toEn).join(), enShop.join(), 'shopping costs identical');
  ok(bn.some(r => /যথেষ্ট|কম পড়ছে|ঘরে নেই/.test(r.badge)), 'Bangla status labels');
  ok(await p.$eval('#inventoryCheckCard .card-title', e => /উপকরণ যাচাই/.test(e.textContent)));
  eq((await p.$$eval('#inventoryCheckBody .chk-head span', e => e.map(x => x.textContent.trim()).filter(Boolean))).join(','), 'লাগবে,ঘরে আছে,পরে বাকি,কিনতে হবে');
  await p.context().close();
});

test('I11 Daily plan with inventory also works (check card, depletion inside the day)', async () => {
  const p = await newPage();
  await p.fill('#budgetInput', '400'); await p.check('input[name="preference"][value="high-protein"]');
  await addItem(p, 'eggs', '1', 'piece'); await generate(p);
  ok(await visible(p, '#inventoryCheckCard'));
  const e = (await checkRows(p)).find(r => r.food === 'egg');
  eq(qty(e.home), 1); eq(qty(e.left), 0, 'the one egg is used up');
  const partial = await p.$$eval('.ing-status.partial', s => s.length);
  ok(partial >= 0);
  await p.context().close();
});

test('I12 Reset clears the inventory and the check card; language stays', async () => {
  const p = await newPage({ lang: 'bn' });
  await specScenario(p);
  await p.click('#btnReset');
  eq(await p.$$eval('#pantryTagsList .tag-item', t => t.length), 0);
  eq(await p.$$eval('#inventoryCheckBody .chk-row', t => t.length), 0);
  ok(!(await visible(p, '#inventoryCheckCard')) && !(await visible(p, '#resultsContent')));
  eq(await p.$eval('html', e => e.lang), 'bn', 'language kept after reset');
  eq(await p.$$eval('#ingredientUnit option', o => o.length), 5);
  eq(await p.inputValue('#ingredientQty'), '');
  await p.context().close();
});

test('I13 Weekly menu shows 7 day rows with 3 coloured meals, highlights the chosen day, and selects on click', async () => {
  const p = await newPage();
  await specScenario(p);
  eq(await p.$$eval('#weekMenu .week-row', r => r.length), 7);
  eq(await p.$$eval('#weekMenu .week-row:first-child .wr-meal', r => r.map(x => x.className.replace('wr-meal ', '')).join()), 'breakfast,lunch,dinner');
  ok(await p.$eval('#weekMenu .week-row:first-child', e => e.classList.contains('active')));
  await p.click('#weekMenu .week-row:nth-child(5)');
  eq(await p.getAttribute('#tab-day-4', 'aria-selected'), 'true');
  ok(await p.$eval('#weekMenu .week-row:nth-child(5)', e => e.classList.contains('active')));
  const dayMeals = await p.$$eval('#weekMenu .week-row:nth-child(5) .wr-meal', r => r.map(x => x.textContent.trim()));
  const cards = await p.$$eval('.meal-card .meal-title', r => r.map(x => x.textContent.trim()));
  eq(dayMeals.join('|'), cards.join('|'), 'menu row matches the meal cards');
  const dayNames = await p.$$eval('#weekMenu .week-row', rows => rows.map(r => [...r.querySelectorAll('.wr-meal')].map(x => x.textContent.trim()).join('|')));
  eq(new Set(dayNames).size, 7, 'no day repeats exactly');
  await p.context().close();
});

// ---------------------------------------------------------------------------
// DESIGN / RESPONSIVE / A11Y
// ---------------------------------------------------------------------------
test('D01 Responsive: no horizontal scrolling or overflowing cards at 1366/1024/820/390/360/320 px, in English AND Bangla, with the full weekly + inventory plan', async () => {
  for (const lang of ['en', 'bn']) {
    for (const w of [1366, 1024, 820, 390, 360, 320]) {
      const p = await newPage({ viewport: { width: w, height: 900 }, lang });
      await specScenario(p);
      const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      eq(over, 0, `${lang} ${w}px page overflow ${over}`);
      const bad = await p.evaluate(() => [...document.querySelectorAll('.card, .meal-card, .kpi, .shop-row, .chk-row, .week-row, .inventory-item, .alt-card-item')]
        .filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map(e => e.className.slice(0, 30)));
      eq(bad.length, 0, `${lang} ${w}px elements outside the viewport: ${bad.slice(0, 4)}`);
      const clipped = await p.evaluate(() => [...document.querySelectorAll('.inv-qty, .inv-unit, .btn-primary, .lang-btn, .chip-btn')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').length);
      eq(clipped, 0, `${lang} ${w}px clipped controls`);
      if (SHOT_DIR) await p.screenshot({ path: `${SHOT_DIR}/v2_${lang}_${w}.png`, fullPage: true });
      eq(p._errors.length, 0, p._errors.join('|')); await p.context().close();
    }
  }
});

test('D02 Contrast >= 4.5:1 for 40+ text styles including the new ones, in English and Bangla modes', async () => {
  for (const lang of ['en', 'bn']) {
    const p = await newPage({ lang });
    await specScenario(p);
    await p.fill('#budgetInput', '100'); await p.waitForTimeout(500);
    const low = await p.evaluate(() => {
      function lum(c) { const a = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * a[0] + .7152 * a[1] + .0722 * a[2]; }
      function parse(s) { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { c: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; }
      function bg(el) { let layers = []; let base = [255, 255, 255]; while (el) { if (el.matches && el.matches('.hero')) { base = [21, 128, 61]; layers.push(null); break; } /* gradient: use its LIGHTEST stop (worst case) */ const b = parse(getComputedStyle(el).backgroundColor); if (b && b.a > 0) layers.push(b); if (b && b.a > 0.95) break; el = el.parentElement; } for (let i = layers.length - 1; i >= 0; i--) { const l = layers[i]; if (!l) continue; base = base.map((v, k) => v * (1 - l.a) + l.c[k] * l.a); } return base; }
      const sels = ['.card-subtitle', '.form-hint', '.kpi-label', '.kpi-value', '.chips-label', '.nutri-ref', '.nutrition-note', '.ing-qty', '.meal-desc', '.shop-item-for', '.alt-desc', '.badge-subtle', '.macro-tile span', '.meal-value', '.btn-primary', '.brand-badge', '.footer-subtext', '.pref-body small', '.step legend', '.currency-code', '.meal-bengali-title',
        '.lang-btn.active', '.lang-btn:not(.active)', '.header-status', '.tag-label', '.inv-note', '.mini-label', '.chk-name', '.chk-cell', '.chk-badge.short', '.chk-badge.none', '.chk-badge.enough', '.chk-badge.assumed', '.wr-meal', '.wr-day', '.wr-cost', '.check-note', '.check-summary', '.ing-status.partial', '.ing-status.home', '.reason-badge-tag', '.week-menu-title', '.est-flag', '.empty-steps li', '.hero p', '.hero-points li', '.field-error', '.medical-note', '.status-box-content'];
      const out = []; let tested = 0;
      sels.forEach(s => { const el = document.querySelector(s); if (!el) return; const cs = getComputedStyle(el); if (cs.display === 'none') return; const fg = parse(cs.color).c; const b = bg(el); const L1 = lum(fg), L2 = lum(b); const r = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); tested++; if (r < 4.5) out.push(s + ' ' + r.toFixed(2)); });
      return { out, tested };
    });
    ok(low.tested >= 36, `${lang}: only ${low.tested} styles could be sampled`);
    eq(low.out.length, 0, `${lang} low contrast: ${low.out.join(', ')}`);
    await p.context().close();
  }
});

test('D03 Focus is visible on the new controls (language buttons, amount, unit, row selects) when using the keyboard', async () => {
  const p = await newPage();
  await addItem(p, 'rice', '2', 'kg');
  await p.keyboard.press('Tab');                                  // keyboard modality, so :focus-visible applies
  for (const sel of ['#langBn', '#ingredientQty', '#ingredientUnit', '#pantryTagsList .inv-qty', '#pantryTagsList .inv-unit']) {
    await p.focus(sel);
    const style = await p.$eval(sel, e => { const c = getComputedStyle(e); return { o: c.outlineStyle + ' ' + c.outlineWidth, b: c.boxShadow }; });
    ok(!/^none/.test(style.o) || style.b !== 'none', `${sel} focus indication ${JSON.stringify(style)}`);
  }
  await p.context().close();
});

test('D04 Controls are labelled in both languages (inputs, selects, rows, buttons)', async () => {
  for (const lang of ['en', 'bn']) {
    const p = await newPage({ lang });
    await specScenario(p);
    const bad = await p.$$eval('input, select, textarea, button', els => els.filter(e => e.type !== 'hidden' && e.offsetParent !== null && !(e.getAttribute('aria-label') || (e.labels && e.labels.length) || e.closest('label') || e.textContent.trim())).map(e => e.className || e.id));
    eq(bad.length, 0, `${lang} unlabeled: ${bad}`);
    const rowLabels = await p.$$eval('#pantryTagsList .inv-qty, #pantryTagsList .inv-unit, #pantryTagsList .tag-remove', e => e.map(x => x.getAttribute('aria-label')));
    ok(rowLabels.every(Boolean) && rowLabels.length === 15, 'row controls labelled');
    if (lang === 'bn') ok(rowLabels.every(l => /[\u0980-\u09FF]/.test(l)), 'Bangla aria-labels: ' + rowLabels.slice(0, 3));
    await p.context().close();
  }
});

test('D05 Every visible button works in both languages (clicking all of them throws no errors)', async () => {
  for (const lang of ['en', 'bn']) {
    const p = await newPage({ lang });
    await specScenario(p);
    const skip = new Set(['btnReset', 'btnPrint', 'btnCopyList', 'btnGenerate', 'langEn', 'langBn']);
    const n = await p.$$eval('button', b => b.length); let clicked = 0;
    for (let i = 0; i < n; i++) {
      const btns = await p.$$('button'); if (i >= btns.length) break;
      const id = await btns[i].getAttribute('id'); if (skip.has(id) || !(await btns[i].isVisible())) continue;
      try { await btns[i].click({ timeout: 800 }); clicked++; } catch (e) { /* replaced by a re-render */ }
    }
    ok(clicked > 25, `${lang}: clicked ${clicked}`);
    eq(p._errors.length, 0, `${lang}: ${p._errors.join('|')}`);
    await p.context().close();
  }
});

test('D06 Design details: hero art, KPI icons, title icons and meal colours are present; hover effects respect reduced motion', async () => {
  const p = await newPage();
  eq(await p.$$eval('#heroArt .art-chip svg', e => e.length), 5);
  await p.fill('#budgetInput', '250'); await generate(p);
  eq(await p.$$eval('.kpi-icon', e => e.length), 3); ok((await p.$$eval('.title-icon', e => e.length)) >= 6);
  const tops = await p.$$eval('.meal-card', c => c.map(x => getComputedStyle(x).boxShadow));
  ok(tops.every(Boolean) && new Set(tops).size === 3, 'each meal type has its own colour accent');
  await p.context().close();
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 900 } });
  const q = await ctx.newPage(); await q.goto(BASE);
  const dur = await q.$eval('.btn-primary', e => getComputedStyle(e).transitionDuration);
  ok(/^0s|0.00001s/.test(dur), 'reduced motion disables transitions: ' + dur);
  await ctx.close();
});

test('D07 Performance: page is light (no images/frameworks), loads and plans a full week fast', async () => {
  const p = await newPage();
  const res = await p.evaluate(() => performance.getEntriesByType('resource').map(r => ({ n: r.name.split('/').pop(), s: r.transferSize || r.encodedBodySize || 0 })));
  const local = res.filter(r => /\.(js|css)$/.test(r.n));
  ok(local.length <= 8, 'few local files: ' + local.map(x => x.n));
  const t0 = Date.now(); await specScenario(p); const ms = Date.now() - t0;
  ok(ms < 6000, 'full scenario took ' + ms + ' ms');
  const planMs = await p.evaluate(() => { const t = performance.now(); MealPlannerEngine.generateMealPlan({ budget: 2100, timeframe: 'weekly', preference: 'high-protein', inventory: [{ label: 'Rice', quantity: 2, unit: 'kg' }, { label: 'Eggs', quantity: 6, unit: 'piece' }] }); return performance.now() - t; });
  ok(planMs < 1500, 'engine weekly plan with inventory: ' + Math.round(planMs) + ' ms');
  await p.context().close();
});

// ---------------------------------------------------------------------------
(async () => {
  browser = await chromium.launch();
  let pass = 0, fail = 0;
  for (const t of results) {
    try {
      await t.fn(); pass++; console.log('  PASS  ' + t.name);
    } catch (e) { fail++; console.log('  FAIL  ' + t.name + '\n        -> ' + String(e.message).split('\n')[0].slice(0, 500)); }
  }
  console.log(`\n${pass} passed, ${fail} failed, ${results.length} total  (${BASE})`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
