# Foodsphere Nutritio Intelligence: Budget-Aware Meal Planner

A university project that plans **breakfast, lunch and dinner** from **Bangladeshi foods** inside a
**daily or weekly budget in Taka (৳ BDT)**. It shows estimated cost, calories, protein, carbohydrates
and fat for every meal, uses **what you already have at home (with quantities)**, tells you **how much
more to buy**, and builds a shopping list you can tick off. The whole app works in **English and বাংলা**.

It is plain **HTML + CSS + JavaScript**. There is nothing to install and no API key is needed.

> **Honest labels used in the app:** prices are *illustrative estimates* (not live market prices),
> nutrition values are *approximate and not laboratory-verified*, "needed" ingredient amounts are
> *estimates*, and the recommendations come from **transparent rules, not an AI model**.
> "Diabetic-friendly" is general food information only and **not medical advice**.

---

## 1. How to run it on Windows (pick ONE option)

### Option A: easiest (double-click)
1. Unzip the project folder.
2. Open the folder and **double-click `index.html`**. It opens in Chrome or Edge. Done.

### Option B: local server with `start.bat`
Needed only if you want the optional screen-test page (`tests/e2e.html`).
1. Double-click **`start.bat`**. A black window opens and your browser goes to `http://localhost:8000/index.html`.
2. Close the black window to stop it.
3. If Windows shows a Microsoft Store window instead, Python is not really installed. Close it and use Option A.

### Option C: VS Code "Live Server"
Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.

### Option D: Command line (if you have Python or Node)
```
python -m http.server 8000      (then visit http://localhost:8000)
npm start                       (needs Node.js; opens http://localhost:8000)
```

An internet connection is **optional**: it only loads nicer fonts (Plus Jakarta Sans for English, Hind Siliguri
for Bangla). Offline, the app uses Segoe UI / Nirmala UI, which Windows already has.

---

## 2. How to use the app
1. **Language:** use the **English | বাংলা** switch in the top bar at any time. Your choice is remembered
   in this browser. Switching language does **not** clear anything you entered (see section 4).
2. **Budget:** choose *Daily* or *Weekly (7 days)*, then type an amount or tap a quick-pick (৳150, ৳250 ...).
   Bangla digits (২৫০) work too. For weekly budgets the app shows the per-day amount.
3. **Food at home (inventory):** type a food, an **amount** and a **unit**, then **Add**
   (example: *Rice · 2 · kg*, *Eggs · 6 · pieces*, *Potatoes · 1 · kg*, *Milk · 500 · ml*, *Lentils · 500 · g*).
   * The unit list only offers units that make sense for that food (rice: kg/g, eggs: pieces, milk: L/ml).
   * **Leave the amount empty** to say "I have plenty" (this is how the quick buttons work).
   * You can **edit** an amount or unit later in the list (changing kg to g converts the number), or remove the item with **×**.
   * Duplicates are blocked; bad amounts (text, negative, 2.5 eggs, 5,000 kg) are refused with a clear message.
4. **Preference:** Balanced, High-protein, Vegetarian, Diabetic-friendly or Max savings.
5. Press **Generate meal plan**. Afterwards, everything updates live when you change any input.
6. Read the results:
   * **Weekly menu** and **week chart**: all 7 days at a glance; click a day to see its meals.
   * **Meal cards**: ingredients with quantities, which part is **at home** and which you **buy**, cost, nutrition, and *why this meal*.
   * **Ingredient check**: for every ingredient, how much the plan **needs**, how much is **at home**, how much is **left**, and how much you still **have to buy** (with price). Shortfalls are highlighted.
   * **Shopping list**: only the missing amounts, combined; tick items, change quantities, copy or print.
7. **Reset all** clears the form, inventory and results (your language stays).

If your budget is too low, the app **does not hide it**: it shows the cheapest possible plan, the shortfall,
the minimum budget, what your budget *can* cover, and money-saving tips.

---

## 3. Project structure
```
Foodsphere-Meal-Planner/
├── index.html              The page (layout; texts carry data-i18n keys)
├── css/style.css           Styling (green / cream / white theme, responsive, Bangla typography)
├── js/
│   ├── i18n.js             NEW: all English + Bangla sentences, language switch, Bangla digits
│   ├── plannerEngine.js    The "brain": validation, planning, stock/units, costs, nutrition, shopping list
│   ├── app.js              Screen logic: buttons, forms, drawing the results
│   └── icons.js            Hand-drawn SVG food pictures (work offline)
├── data/
│   ├── foods.js            10 foods: price in ৳, nutrition, names (EN/BN), aliases
│   └── recipes.js          23 Bangladeshi recipes (English + Bangla names and descriptions)
├── tests/
│   ├── unit.html           Double-click: engine tests (69 in the browser)
│   ├── e2e.html            Needs start.bat: 20 automatic click-through tests
│   ├── engine.tests.js     The engine test definitions (shared)
│   ├── run-node.js         Same engine tests + a translation-key scan: node tests/run-node.js (70)
│   ├── e2e-playwright.js   Optional advanced: 30 browser tests (original features)
│   └── e2e-v2-playwright.js Optional advanced: 30 browser tests (language, inventory, design)
├── docs/screenshots/       Pictures for your report
├── start.bat  package.json
├── README.md  DEMO_GUIDE.md  TEST_REPORT.md
```

## 4. How the new features work (good to explain to judges)

### English / বাংলা
* Every sentence lives in `js/i18n.js` (two dictionaries with identical keys). The page and the engine both ask it for text.
* Switching language redraws all text **from the same data**, so costs, nutrition and shopping totals never change.
  Your budget, period, pantry and amounts, preference, selected day, shopping-list quantity edits and ticks are kept.
* In Bangla mode numbers are shown with Bangla digits (০-৯), meals use their Bangla names and descriptions, and the layout uses a Bangla font
  with more line spacing. You can type English or Bangla digits.
* The selected language is saved with `localStorage` in your browser.

### Home inventory with quantities
* Every food has one base unit (g, ml or piece). Your amounts are converted (2 kg = 2000 g, 1 L = 1000 ml).
* The planner builds the week **day by day, meal by meal**: each meal first uses home stock, and only the rest is bought.
  Stock really runs out (6 eggs cannot feed 9 egg meals), so later days pay for what earlier days used.
* Plans prefer meals that use what you have (cheaper meals, "100% from home" meals score higher); identical whole days are avoided.
* **Ingredient check** = estimates: "needed" adds up the recipe portions (one serving per meal) for every meal in the plan.
  `needed = used from home + to buy`, `left = at home − used from home`.
* **Roti/atta by weight is an estimate:** the app assumes about 40 g of atta per roti (shown as "estimate"). Everything else uses exact recipe quantities.
* Items without an amount are treated as "plenty" (never run out), exactly like the original version.
* Oil, onion, salt and spices are **not** tracked.

## 5. How the calculations work
* **Recipe cost** = Σ (ingredient quantity ÷ reference quantity × price), rounded per ingredient line. Example: *Dim Khichuri* =
  60 g rice + 40 g daal + 1 egg = ৳4.20 + ৳5.60 + ৳13.50 = **৳23.30**. With stock at home only the part you must buy is charged.
* **Nutrition** is computed from the same quantities (including the part from your own stock).
* **Plan choice (rule-based):** try every breakfast + lunch + dinner combination for your preference, keep those within the day's
  budget, and pick the best score: use of home stock, food groups covered, calories, protein, variety, preference bonuses.
  If nothing fits, the **cheapest** plan is shown and the shortfall is reported.
* **Weekly:** days are planned one after another; leftover budget is spread over the remaining days; totals are sums of the 21 displayed meals.
* **Shopping list:** the amounts still to buy from all meals, combined. The cost and *Remaining* figures at the top follow the list.
* Budget limits: ৳5,000 per day / ৳35,000 per week.

## 6. Changing prices, foods, words
* Prices / foods: `data/foods.js`. Recipes (with `descriptionBn`): `data/recipes.js`.
* Any word on screen: `js/i18n.js` (edit the English or Bangla line with the same key).
* After editing, open `tests/unit.html`: it checks recipes, units, translations and calculations.

## 7. Adding a real AI model later (design notes)
Create a small **backend** that keeps the API key in an environment variable (**never** put a key in `app.js`), let it choose from the
recipe IDs in `data/recipes.js`, and call it from `runPlan` in `js/app.js`. Keep the rule-based planner as the offline fallback and keep
the "AI" label honest.

## 8. Known limitations
* Only **10 foods and 23 recipes**; no beef, mutton, hilsa, snacks, other fruit.
* Prices and nutrition are approximate reference numbers (not live, not verified against FCTB/USDA figure by figure).
* "Needed" amounts assume one serving per meal for one person. Oil, onion, salt and spices are not counted.
* Atta/roti by weight uses a rough 40 g-per-roti estimate.
* The Bangla text was written for this project and **has not been reviewed by a native-speaking proofreader**. Please read it before the demo.
* In Bangla mode, values you type (budget, amounts) stay in the digits you typed.
* Inventory and settings are not saved between page reloads (only the language is).
* Tested in headless Chromium on Linux with a fallback Bangla font. **Not yet run on a real Windows machine, Safari or Firefox** (see TEST_REPORT.md).

## 9. Troubleshooting
| Problem | Fix |
|---|---|
| Page looks unstyled | Keep the folder structure intact (css/, js/, data/ next to index.html). |
| `start.bat` opens Microsoft Store | Python is not installed. Use Option A (double-click `index.html`). |
| `tests/e2e.html` says "Cannot open the app frame" | Open it via `http://localhost:8000/tests/e2e.html` after running `start.bat`. |
| Bangla shows boxes | Use an up-to-date Chrome/Edge (Windows 10/11 include Bangla fonts: Nirmala UI). |
| Language does not stay | Browsers in private mode can block saving. Use a normal window. |
