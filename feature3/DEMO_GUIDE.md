# Demonstration guide for the university judges (about 7 minutes)

The planner is **deterministic**: the same inputs always give the same result, so the numbers below should
appear on your screen exactly as written. Practise once before the demo.

**Before you start:** open `index.html` in Chrome/Edge, press **F11**, zoom 100%. Start in **English**.

---

## Part 1: The problem (30 seconds)
> "Many families plan food by budget first. My feature, the **Budget-Aware Meal Planner**, turns a Taka budget
> into breakfast, lunch and dinner with cost, nutrition and a shopping list. It knows what is already in the
> kitchen, works in English and Bangla, and is honest about what it cannot do."

Point to the header badge: **"Rule-based planner · no AI API connected"**. Say it first.

## Part 2: Daily plan with food at home (60 seconds)
1. Tap **৳250**. Tap **+ Rice** and **+ Eggs** (no amount = "plenty").
2. Press **Generate meal plan**.
3. Expected: **cost ৳24.05, remaining ৳225.95** (breakfast Quick Dim Khichuri ৳5.60, lunch Dim Bhuna & Ghono Daal ৳9.25, dinner Bhaat with Alu Bhorta ৳9.20).
4. Explain a meal card: ingredients, **At home** vs price, **"Why this meal?"**, calories and macros.
5. Press **Reset all**, tap ৳250, Generate: **৳115.25, remaining ৳134.75**, 7 shopping items. "Using what I already have saved ৳91."

## Part 3: The new home inventory with quantities, weekly plan (2 minutes) ★
1. **Reset all**, choose **Weekly**, type **1800** (hint: ≈ ৳257.14 per day).
2. Add food with amounts (type name, amount, unit, **Add**):
   **Rice 2 kg · Eggs 6 pieces · Potatoes 1 kg · Milk 500 ml · Lentils 500 g**.
   *Show that the unit list changes with the food (eggs: pieces only) and that "eggs, 2.5 pieces" or "rice, abc" is refused.*
3. Press **Generate meal plan**. Expected: **7 day tabs, estimated cost ৳290.60, remaining ৳1,509.40, 8 shopping items**
   (without any stock the same budget plans ৳718.65).
4. Show **Weekly menu** (7 rows, 3 coloured meals, no day repeated) and click a day.
5. Scroll to **Ingredient check** (all amounts are estimates, and the page says so):
   * **Eggs:** needed 7, at home 6, left 0, **to buy 1 (৳13.50), "Short by 1 pc"**
   * **Lentils:** needed 670 g, at home 500 g → **buy 170 g (৳23.80)**
   * **Milk:** needed 800 ml, at home 500 ml → **buy 300 ml (৳28.80)**
   * **Rice:** needed 1.64 kg, at home 2 kg → **Enough, 360 g left**; **Potatoes:** 790 g needed, **210 g left**
   * Fish, chicken, banana, vegetables, roti: **Not at home** → buy everything.
6. Change **Rice to 500 g** in the list (or kg → g to show the conversion): the plan, check and shopping list update live.
7. Shopping list: tick an item, press **+** on one: the cost and *Estimated cost* at the top follow; **Reset quantities** undoes it.

## Part 4: English ⇄ বাংলা (60 seconds) ★
1. Press **বাংলা** in the top bar. Everything switches: headings, forms, meal names and descriptions, explanations, tips,
   statuses, notices, buttons; numbers become Bangla digits (৳২৯০.৬০).
2. Point out: **nothing was reset**: same budget, same inventory, same day, same shopping edits, same numbers.
3. Type **২৫০** in the budget box (Bangla digits work). Reload the page: it **remembers Bangla**. Switch back to **English**.

## Part 5: Honesty when the budget is too low (60 seconds)
1. **Reset all**, Daily, type **30**, Generate. Expected: warning: cheapest plan costs **৳54.50**, **৳24.50 over**.
   **Smart alternatives**: minimum budget; "what ৳30 can cover" (only dinner, ৳16.25); "if you already had roti at home, the cheapest day would cost ৳22.25 less".
2. Type **-50**, **0**, **abc**, **999999** to show friendly validation (also in Bangla).

## Part 6: Preferences and safety (45 seconds)
* **Vegetarian** (৳300): no fish, chicken or eggs (cost ৳73.20).
* **Diabetic-friendly**: blue note **"Not medical advice… does not treat or prevent diabetes."** The planner also warns when a plan is low in calories (about 1,355 kcal/day at ৳300).

## Part 7: Quality evidence (30 seconds)
Open `tests/unit.html` → **69 passed** (+1 Node-only check that every translation key exists). Mention the randomised tests: 400 plans without
and **300 with quantity inventories** check that stock is never overdrawn and that cost, nutrition, remaining budget and shopping list always agree.
Show `TEST_REPORT.md`.

---

## Questions judges may ask (and honest answers)

**Is this real AI?** No, a transparent rule-based recommender. Costs and nutrition must be exact and explainable; the structure allows an AI later through a backend (README section 7).

**How does the inventory work?** Each meal uses home stock first; only the rest is bought. Stock is used up meal by meal and day by day. "Needed" = recipe portions added up (one serving per meal), so it is labelled an estimate.

**What if an ingredient has no amount?** It means "plenty" (the original behaviour); it never runs out and is shown as "Amount not set".

**Why is roti by weight "estimated"?** Recipes count rotis, not flour. The app assumes about 40 g of atta per roti and labels it as an estimate.

**Who wrote the Bangla?** It was written for this project and should be proofread by a native speaker before wider use. All text is in one file (`js/i18n.js`) so it is easy to fix.

**Where do prices/nutrition come from?** Illustrative estimates in `data/foods.js`; not live prices; not laboratory-verified. The app says so.

**What would you improve next?** More foods and recipes, per-person portions and calorie targets, editable prices, saving the inventory, oil/spice costs, a proof-read Bangla, and a backend AI assistant.

## If something goes wrong during the demo
* Page looks odd → **Ctrl+F5**. Fonts missing (offline) → harmless (falls back to Segoe UI / Nirmala UI).
* Clean slate quickly → **Reset all** (language stays).
