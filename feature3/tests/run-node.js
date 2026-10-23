/* Runs the engine tests from the command line:  node tests/run-node.js  (needs Node.js) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { console }; vm.createContext(ctx);
['data/foods.js', 'data/recipes.js', 'js/i18n.js', 'js/plannerEngine.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }));
vm.runInContext('this.__E = MealPlannerEngine; this.__I = I18N; this.__F = BANGLADESHI_FOOD_DATABASE; this.__R = BANGLADESHI_RECIPE_DATABASE;', ctx);
const { defineEngineTests } = require('./engine.tests.js');

const results = [];
const t = {
  test: (name, fn) => results.push({ name, fn }),
  eq: (a, b, m) => { if (a !== b) throw new Error(`${m || 'eq'}: expected ${JSON.stringify(b)} but got ${JSON.stringify(a)}`); },
  ok: (c, m) => { if (!c) throw new Error('assertion failed' + (m ? ': ' + m : '')); },
  near: (a, b, tol, m) => { if (!(Math.abs(a - b) <= tol)) throw new Error(`${m || 'near'}: expected ~${b} but got ${a}`); }
};
defineEngineTests(t, ctx.__E, ctx.__F, ctx.__R, ctx.__I);
// ---- Node-only: every translation key used anywhere in the source exists in both languages ----
t.test('LANG (source scan): every key used in the code, HTML and engine exists in English and Bangla', () => {
  const keys = new Set(), dyn = [];
  const add = k => keys.add(k);
  ['js/app.js', 'js/plannerEngine.js', 'index.html'].forEach(f => {
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of src.matchAll(/\b(?:t|tx|tn)\(\s*'([a-z0-9_]+)'\s*[,)]/g)) {
      const isTn = /\btn\(/.test(src.slice(m.index, m.index + 3));
      if (isTn) { add(m[1] + '_one'); add(m[1] + '_other'); } else add(m[1]);
    }
    for (const m of src.matchAll(/\b(?:t|tx)\(\s*[^'()]*\?\s*'([a-z0-9_]+)'\s*:\s*'([a-z0-9_]+)'\s*[,)]/g)) { add(m[1]); add(m[2]); }   // t(cond ? 'a' : 'b')
    for (const m of src.matchAll(/data-i18n(?:-html)?="([a-z0-9_]+)"/g)) add(m[1]);
    for (const m of src.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(';').forEach(pair => add(pair.split(':')[1].trim()));
    for (const m of src.matchAll(/\b(?:t|tx)\(\s*'([a-z_]+_)'\s*\+/g)) dyn.push(m[1]);
  });
  const dict = ctx.__I.dict;
  const missing = [...keys].filter(k => !(k in dict.en) || !(k in dict.bn));
  t.eq(missing.join(', '), '', 'keys used in code but missing from the dictionaries');
  // dynamic keys: unit_<g|kg|ml|l|piece>, slot_<breakfast|lunch|dinner>
  ['g', 'kg', 'ml', 'l', 'piece'].forEach(u => t.ok('unit_' + u in dict.en && 'unit_' + u in dict.bn, 'unit_' + u));
  ['breakfast', 'lunch', 'dinner'].forEach(sl => t.ok('slot_' + sl in dict.en && 'slot_' + sl in dict.bn, 'slot_' + sl));
  t.ok(dyn.every(d => ['unit_', 'slot_'].includes(d)), 'unexpected dynamic key prefix: ' + dyn);
  const used = new Set([...keys, ...['g', 'kg', 'ml', 'l', 'piece'].map(u => 'unit_' + u), ...['breakfast', 'lunch', 'dinner'].map(s => 'slot_' + s)]);
  const unused = Object.keys(dict.en).filter(k => !used.has(k) && !keys.has(k.replace(/_(one|other)$/, '_one')) && !keys.has(k.replace(/_(one|other)$/, '_other')));
  if (unused.length) console.log('  (info) dictionary keys not referenced by a literal lookup: ' + unused.join(', '));
});

let pass = 0, fail = 0;
results.forEach(r => {
  try { r.fn(); pass++; console.log('  PASS  ' + r.name); }
  catch (e) { fail++; console.log('  FAIL  ' + r.name + '\n        -> ' + e.message); }
});
console.log(`\n${pass} passed, ${fail} failed, ${results.length} total`);
process.exit(fail ? 1 : 0);
