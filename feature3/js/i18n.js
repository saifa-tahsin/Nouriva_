/**
 * Foodsphere Nutritio Intelligence - English / Bangla (বাংলা) text.
 *
 * All sentences shown to the user live here, in two dictionaries (en, bn).
 * To change a word, edit it below. To add a language, add another dictionary.
 *
 *   I18N.t('key', { name: 'value' })   -> text in the current language ({name} placeholders)
 *   I18N.setLang('bn')                 -> switch language (remembered in this browser)
 *
 * In Bangla mode, digits shown on the page are displayed as Bangla digits (০-৯).
 * Typed values (budget, amounts) can use English or Bangla digits.
 */
const I18N = (() => {
  const STORAGE_KEY = 'foodsphere.lang';

  const en = {
    doc_title: "Foodsphere Nutritio Intelligence | Budget-Aware Meal Planner",
    skip_link: "Skip to main content",
    brand_badge: "Budget-Aware Meal Planner",
    header_status: "Rule-based planner · no AI API connected",
    header_status_title: "This planner uses transparent rules. No AI model or API is connected.",
    lang_label: "Language",
    lang_aria: "Language switch",
    hero_title: "Eat well within your Taka budget",
    hero_text: "Set a daily or weekly budget, tell us what you already have at home, and get a Bangladeshi meal plan with costs, nutrition and a ready shopping list.",
    hero_p1: "Costs in BDT (estimates)",
    hero_p2: "Calories & macros",
    hero_p3: "Smart shopping list",
    hero_points_label: "What you get",

    settings_title: "Plan settings",
    settings_sub: "Three quick steps, then press <strong>Generate</strong>.",
    step1: "Your budget",
    step2: "Food at home",
    step3: "Food preference",
    period_aria: "Budget period",
    daily: "Daily",
    weekly: "Weekly (7 days)",
    budget_daily: "Daily Budget",
    budget_weekly: "Weekly Budget",
    in_taka: " in Taka",
    budget_ph_daily: "e.g. 250",
    budget_ph_weekly: "e.g. 1800",
    currency_suffix: "BDT",
    hint_daily: "Your spending target for breakfast, lunch and dinner today.",
    hint_weekly: "Your spending target for 7 days of breakfast, lunch and dinner.",
    hint_conv: "{amount} per week is about {perday} per day for all 3 meals.",
    quick_pick: "Quick pick:",

    ing_label: "Add what you already have",
    ing_ph: "e.g. rice, eggs, আলু",
    add: "Add",
    qty_label: "Amount (optional)",
    qty_ph: "e.g. 2",
    unit_label: "Unit",
    pantry_msg_default: "Press Enter or Add. Separate several items with commas. Type an amount to track your stock, or leave it empty if you have plenty.",
    staples_label: "Common items (tap to add / remove):",
    inv_list_aria: "Food at home",
    inv_qty_aria: "{name} amount",
    inv_unit_aria: "{name} unit",
    inv_remove_aria: "Remove {name}",
    inv_not_set: "Amount not set (plenty assumed)",
    inv_est_rotis: "about {n} rotis (estimate, assuming about {g} g of atta per roti)",
    unknown_tip: "Not in our recipe database, so it will not change the plan.",
    unit_g: "g", unit_kg: "kg", unit_piece: "pieces", unit_ml: "ml", unit_l: "L",
    q_g: "{n} g", q_kg: "{n} kg", q_ml: "{n} ml", q_l: "{n} L",
    q_piece_one: "{n} pc", q_piece_other: "{n} pcs",

    pref_standard: "Balanced", pref_standard_sub: "Everyday Bengali meals",
    pref_high_protein: "High-protein", pref_high_protein_sub: "Fish, egg, chicken, daal",
    pref_vegetarian: "Vegetarian", pref_vegetarian_sub: "No meat, fish or eggs",
    pref_diabetic: "Diabetic-friendly", pref_diabetic_sub: "General food info only",
    pref_saver: "Max savings", pref_saver_sub: "Lowest-cost choices",
    medical_note: "<strong>Not medical advice.</strong> “Diabetic-friendly” only means more vegetables, lentils and whole-wheat roti. It does not treat or prevent diabetes. Please ask your doctor or a dietitian about your own needs.",
    generate: "Generate meal plan",
    planning: "Planning your meals…",
    reset: "Reset all",

    empty_title: "Your meal plan will appear here",
    empty_text: "Enter a budget, add what you have at home, then press <strong>Generate meal plan</strong>.",
    empty_s1: "Choose daily or weekly and type an amount in ৳",
    empty_s2: "Add food you already have at home (optional)",
    empty_s3: "Pick a food preference and generate",

    your_daily: "Your daily plan",
    your_week: "Your 7-day plan",
    waiting: "Waiting for input",
    print: "Print",
    kpi_budget_daily: "Daily budget",
    kpi_budget_weekly: "Weekly budget",
    kpi_cost: "Estimated cost",
    kpi_cost_week: "Estimated cost (7 days)",
    kpi_remaining: "Remaining",
    kpi_over: "Over budget by",
    within: "Within budget",
    over: "Over budget",
    pct_used: "{pct}% of budget used",
    left_amt: "{amount} left",
    short_amt: "{amount} short",
    adjust_note: "Includes your shopping-list changes ({sign}{amount} compared with the meals as planned).",
    budget_aria: "Budget used",

    ban_ready_day: "Your daily plan is ready.",
    ban_ready_week: "Your 7-day plan is ready.",
    ban_ready_text: "Estimated cost {cost} of your {budget} {span} budget, leaving {left}.",
    span_day: "day",
    span_week: "week",
    ban_low_title: "Your budget is too low for a full {span}.",
    ban_low_text: "The lowest-cost plan we can build costs {min}, which is {over} more than your {budget} budget. See “Smart alternatives” for realistic options.",

    week_title: "Week at a glance",
    week_sub: "Estimated spend per day (dashed line = your average daily allowance)",
    week_menu_title: "Weekly menu",
    day_n: "Day {n}",
    day_tabs_aria: "Choose a day",
    show_day: "Day {n}: {amount}. Show this day",
    slot_breakfast: "Breakfast", slot_lunch: "Lunch", slot_dinner: "Dinner",

    cost_badge: "Est. {amount}",
    nothing_to_buy_badge: "Nothing to buy",
    ingredients_title: "Ingredients & quantities",
    why_title: "Why this meal?",
    at_home: "At home",
    ing_partial: "{home} home + buy {buy}",
    kcal: "kcal", protein: "Protein", carbs: "Carbs", fat: "Fat", carbohydrates: "Carbohydrates", calories: "Calories",
    full_value: "Full recipe value {gross}",
    you_buy: " · you buy {amount}",
    macros_aria: "Estimated nutrition for this meal",

    nut_title_day: "Estimated daily nutrition",
    nut_title_week: "Estimated nutrition for the week",
    nut_sub_day: "Totals of the 3 meals shown above",
    nut_sub_week: "7-day totals of all meals. Average per day: {kcal} kcal, {protein} g protein. Selected day (Day {n}): {dkcal} kcal.",
    estimates: "Estimates",
    unit_kcal: "kcal", unit_gram: "g",
    ref_text: "{pct}% of a {ref} {unit} reference",
    macro_p: "Protein {n}%", macro_c: "Carbs {n}%", macro_f: "Fat {n}%",
    macro_share: "(share of macro energy)",
    macro_aria: "Share of macro energy",
    nut_note: "Bars compare with a generic 2,000 kcal reference day, for illustration only. Values are estimates from approximate food-table figures. They are <em>not</em> laboratory-verified and vary by cut, brand and cooking method. This is general food information, not medical advice.",

    chk_title: "Ingredient check: home stock vs this plan",
    chk_sub: "How much the plan needs, what you have at home, what is left and what to buy",
    chk_note: "“Needed” amounts are estimates: they add up the recipe portions (one serving of each meal) for every meal in this plan. Prices are estimates too.",
    chk_needed: "Needed", chk_home: "At home", chk_left: "Left after plan", chk_buy: "To buy",
    chk_enough: "Enough", chk_short: "Short by {amount}", chk_none: "Not at home", chk_assumed: "Amount not set", chk_unused: "Not needed",
    chk_plenty: "plenty (assumed)",
    chk_all_ok: "Your home stock covers every ingredient this plan needs.",
    chk_short_summary: "{n} ingredient(s) are not fully covered by your home stock. Buy the amounts shown below.",
    chk_est_flag: "estimate",

    shop_title: "Shopping list",
    shop_sub_day: "Only what is missing from your home stock",
    shop_sub_week: "Everything to buy for the week, combined",
    items_one: "{n} item", items_other: "{n} items",
    items_bought: "{items} · {b} bought",
    shop_empty_title: "Nothing to buy!",
    shop_empty_sub: "Everything for this plan is already at home, so your estimated shopping cost is ৳0.00.",
    shop_progress: "🛒 {b} of {n} bought",
    mark_all: "Mark all bought",
    unmark_all: "Unmark all",
    reset_qty: "Reset quantities",
    copy_list: "Copy list",
    shop_for: "For: {slots}",
    shop_used_one: "Used in {n} meal this week", shop_used_other: "Used in {n} meals this week",
    shop_dec_aria: "Decrease {name} quantity",
    shop_inc_aria: "Increase {name} quantity",
    shop_check_aria: "Mark {name} as purchased",
    shop_qty_aria: "{name} quantity in {unit}",
    tot_bought: "Already bought",
    tot_pending: "Still to buy",
    tot_grand: "Total estimated shopping cost",
    tot_aria: "Shopping totals",
    shop_hint: "Tick items as you buy them. Change a quantity with + / − or type a number. Prices are estimates, not live market prices.",
    copy_header: "Foodsphere shopping list (estimated prices in BDT)",
    copy_total: "Total",

    alt_title: "Smart alternatives",
    alt_sub: "Tips and swaps calculated from your plan",
    alt_empty_title: "Well optimised",
    alt_empty_sub: "No extra swaps are needed for this plan.",

    toast_added: "Added {name}",
    toast_added_n: "Added {n} items",
    toast_removed: "Removed {name}",
    toast_dup: "Already in your list",
    toast_updated: "Updated {name}",
    toast_plan_ready: "Meal plan ready",
    toast_plan_low: "Plan ready: budget is too low",
    toast_qty_reset: "Quantities reset",
    toast_copied: "Shopping list copied",
    toast_copy_fail: "Could not copy. Try Print instead.",
    toast_reset: "Everything was reset",
    toast_lang: "Language: English",

    pm_type_first: "Please type an ingredient name first, for example “rice”.",
    pm_added: "Added {names}.",
    pm_added_dup: "Added {names}. Already in your list: {dupes}.",
    pm_dup_one: "{names} is already in your list. No duplicate was added. To change the amount, edit it in the list.",
    pm_dup_other: "{names} are already in your list. No duplicates were added. To change an amount, edit it in the list.",
    inv_plenty_ph: "plenty",
    inv_unit_hint: "Unit",
    pm_removed: "Removed {name}.",
    pm_updated: "Updated {name}: {qty}.",
    pm_cleared: "{name}: amount cleared (plenty assumed).",
    qe_invalid: "Please enter a valid amount, for example 2 or 0.5.",
    qe_negative: "The amount cannot be negative.",
    qe_unit: "{name} is measured in {units}. Please choose one of those units.",
    qe_whole: "Please enter a whole number of pieces, for example 6.",
    qe_toolarge: "That amount is too large for a home kitchen. Please check it.",
    qe_multi: "To set an amount, add one item at a time. You can edit amounts in the list afterwards.",
    qe_unknown: "“{name}” isn’t in our recipes, so its amount is ignored.",
    pn_unknown: "Not used by the planner (not in our recipes): {items}. Cooking oil, onion, salt and spices are not counted in costs.",

    footer_main: "<strong>Foodsphere Nutritio Intelligence</strong> · University project · Budget-Aware Meal Planner",
    footer_sub: "Prices are illustrative estimates in BDT, <strong>not live market prices</strong>, and may differ in your area. Nutrition values are approximate, not laboratory-verified, and cover main ingredients only (oil, spices and salt are not counted). Recommendations come from transparent rules, not an AI model. This tool gives general food information and is not medical advice.",

    // ---- engine messages ----
    period_day: "day", period_week: "week",
    word_daily: "daily", word_weekly: "weekly",
    e_budget_empty: "Please enter a valid budget amount in Bangladeshi Taka (৳) to generate your meal plan.",
    e_budget_invalid: "That doesn't look like a valid amount. Please type a number such as 250 (digits only).",
    e_budget_negative: "Your budget must be greater than ৳0. A negative amount cannot be used for meal planning.",
    e_budget_zero: "Your budget must be greater than ৳0.",
    e_budget_toolarge: "That is more than a realistic personal food budget. Please enter a realistic amount (up to ৳{max} per {period}).",
    e_no_recipes: "No recipes found for the selected configuration. Please try standard preferences.",

    r_pantry_full_badge: "100% from home",
    r_pantry_full_text: "Made only from ingredients you already have ({names}), so ৳0 to buy.",
    r_pantry_use_badge: "Uses your home stock",
    r_pantry_use_text: "Uses {names} from home, saving about {saving}.",
    r_budget_small_badge: "Budget friendly",
    r_budget_small_text: "Costs about {cost}, a small part of your daily allowance.",
    r_budget_ok_badge: "Within budget",
    r_budget_ok_text: "Costs about {cost} and still fits your daily allowance.",
    r_budget_low_badge: "Lowest cost option",
    r_budget_low_text: "The most economical choice for this meal (about {cost}).",
    r_protein_badge: "Protein source",
    r_protein_text: "About {protein} g of protein, mainly from {source}.",
    src_fish: "fish", src_chicken: "chicken", src_eggs: "eggs", src_lentils: "lentils",
    r_fibre_badge: "Fibre & vitamins",
    r_fibre_text: "Includes seasonal vegetables for fibre and vitamins ({kcal} kcal).",
    r_roti_badge: "Whole-wheat energy",
    r_roti_text: "Whole-wheat roti provides steady carbohydrate energy.",
    r_veg_badge: "Vegetarian",
    r_veg_text: "Contains no meat, fish or eggs.",
    r_hp_badge: "High-protein choice",
    r_hp_text: "Chosen from higher-protein recipes to match your preference.",
    r_diab_badge: "Diabetic-friendly style",
    r_diab_text: "Emphasises vegetables, lentils or whole-wheat roti. General food information only, not medical advice.",
    r_save_badge: "Savings focus",
    r_save_text: "Chosen to keep your spending as low as possible.",
    x_uses: "uses {names} you already have",
    x_cost_fit: "costs about {cost} within your {allow} daily allowance",
    x_cost_low: "is the lowest-cost option for this meal ({cost})",
    x_gives: "gives {kcal} kcal and {protein} g protein",
    x_and: " and ",
    x_sentence: "Suggested because it {clauses}.",

    a_per_day: " (about {amount} per day)",
    a_low_title: "Your budget is too low for a full plan",
    a_low_desc: "Your {period} budget of {budget} is {short} short of the lowest-cost plan we can build ({min}). The cheapest plan is shown instead of hiding the gap.",
    a_low_tip: "Minimum estimated {period} budget: {min}{perday}.",
    a_cover_title: "What your budget can cover",
    a_cover_none: "Even the cheapest single meal ({meal}, about {cost}) costs more than your allowance of {allowance} per day.",
    a_cover_none_tip: "Try a higher budget, or add food you already have at home.",
    a_cover_some: "With about {allowance} per day you can afford {count} of 3 meals: {list}.",
    a_cover_item: "{slot} ({meal}, {cost})",
    a_cover_tip: "The other {n} meal(s) would need more budget or food from your home stock.",
    a_pantry_title: "If you already have {food} at home",
    a_pantry_desc: "The lowest-cost day would drop by about {saved} because you would not need to buy it.",
    a_pantry_tip: "Add it to “Food at home” to see the plan update.",
    a_swap_title: "Cheaper {slot}: {meal}",
    a_swap_desc: "Swapping “{from}” for “{to}” would save about {total}{weekly}. Nutrition change: {dcal} kcal, {dpro} g protein.",
    a_swap_week: " over the week ({n} meals)",
    a_swap_tip: "Choose the “Max savings” preference to get the lowest-cost plan automatically.",
    a_empty_title: "Home food tip",
    a_empty_desc: "No food at home is listed yet. Ingredients you already have at home are not charged to your food budget.",
    a_empty_tip: "Check your kitchen and add items under “Food at home”.",
    a_room_title: "Room left in your budget",
    a_room_desc: "This plan leaves {amount} unspent. You could save it, or try the “High-protein” preference to use more of your budget on protein foods.",

    n_broadened: "Not enough recipes matched your preference for every meal, so some meals come from the standard list.",
    n_medical: "Diabetic-friendly here means general food information only (more vegetables, lentils and whole-wheat roti). It is not medical advice and does not treat or prevent diabetes. Please ask your doctor or a dietitian about your own needs.",
    n_lowkcal: "This plan provides about {kcal} kcal per day, which may be low for many adults. Consider larger portions or extra food. These are rough estimates, not personal advice.",
    n_assume_week: "Items marked as plentiful at home are assumed to last the whole week.",
    n_stock_short: "{n} ingredient(s) at home are not enough for the whole plan. See “Ingredient check” for how much more to buy."
  };

  const bn = {
    doc_title: "Foodsphere Nutritio Intelligence | বাজেটভিত্তিক খাবার পরিকল্পনা",
    skip_link: "মূল অংশে যান",
    brand_badge: "বাজেটভিত্তিক খাবার পরিকল্পনা",
    header_status: "নিয়মভিত্তিক পরিকল্পনা · কোনো এআই যুক্ত নেই",
    header_status_title: "এই পরিকল্পনাকারী স্পষ্ট নিয়মে কাজ করে। কোনো এআই মডেল বা এপিআই যুক্ত নেই।",
    lang_label: "ভাষা",
    lang_aria: "ভাষা পরিবর্তন",
    hero_title: "আপনার টাকার বাজেটের মধ্যেই খান পুষ্টিকর খাবার",
    hero_text: "দৈনিক বা সাপ্তাহিক বাজেট ঠিক করুন, ঘরে কী কী আছে জানান, আর পেয়ে যান খরচ, পুষ্টি ও কেনাকাটার তালিকাসহ বাংলাদেশি খাবারের পরিকল্পনা।",
    hero_p1: "টাকায় খরচ (আনুমানিক)",
    hero_p2: "ক্যালরি ও পুষ্টি উপাদান",
    hero_p3: "স্মার্ট কেনাকাটার তালিকা",
    hero_points_label: "যা পাবেন",

    settings_title: "পরিকল্পনার সেটিং",
    settings_sub: "তিনটি সহজ ধাপ, তারপর <strong>পরিকল্পনা তৈরি করুন</strong> চাপুন।",
    step1: "আপনার বাজেট",
    step2: "ঘরে থাকা খাবার",
    step3: "খাবারের পছন্দ",
    period_aria: "বাজেটের মেয়াদ",
    daily: "দৈনিক",
    weekly: "সাপ্তাহিক (৭ দিন)",
    budget_daily: "দৈনিক বাজেট",
    budget_weekly: "সাপ্তাহিক বাজেট",
    in_taka: " (টাকায়)",
    budget_ph_daily: "যেমন ২৫০",
    budget_ph_weekly: "যেমন ১৮০০",
    currency_suffix: "টাকা",
    hint_daily: "আজকের সকাল, দুপুর ও রাতের খাবারের জন্য আপনার খরচের লক্ষ্য।",
    hint_weekly: "৭ দিনের সকাল, দুপুর ও রাতের খাবারের জন্য আপনার খরচের লক্ষ্য।",
    hint_conv: "সপ্তাহে {amount} মানে তিন বেলার জন্য দিনে প্রায় {perday}।",
    quick_pick: "দ্রুত বেছে নিন:",

    ing_label: "ঘরে যা আছে তা যোগ করুন",
    ing_ph: "যেমন চাল, ডিম, আলু",
    add: "যোগ করুন",
    qty_label: "পরিমাণ (ঐচ্ছিক)",
    qty_ph: "যেমন ২",
    unit_label: "একক",
    pantry_msg_default: "এন্টার চাপুন বা “যোগ করুন” চাপুন। একাধিক জিনিস কমা (,) দিয়ে আলাদা করুন। মজুতের হিসাব রাখতে পরিমাণ লিখুন; প্রচুর থাকলে ফাঁকা রাখুন।",
    staples_label: "সাধারণ জিনিস (যোগ বা বাদ দিতে চাপুন):",
    inv_list_aria: "ঘরে থাকা খাবার",
    inv_qty_aria: "{name} এর পরিমাণ",
    inv_unit_aria: "{name} এর একক",
    inv_remove_aria: "{name} বাদ দিন",
    inv_not_set: "পরিমাণ দেওয়া নেই (প্রচুর আছে ধরা হয়েছে)",
    inv_est_rotis: "প্রায় {n}টি রুটি (আনুমানিক, প্রতি রুটিতে প্রায় {g} গ্রাম আটা ধরে)",
    unknown_tip: "আমাদের রেসিপিতে নেই, তাই পরিকল্পনায় কোনো প্রভাব ফেলবে না।",
    unit_g: "গ্রাম", unit_kg: "কেজি", unit_piece: "টি", unit_ml: "মি.লি.", unit_l: "লিটার",
    q_g: "{n} গ্রাম", q_kg: "{n} কেজি", q_ml: "{n} মি.লি.", q_l: "{n} লিটার",
    q_piece_one: "{n}টি", q_piece_other: "{n}টি",

    pref_standard: "সুষম", pref_standard_sub: "প্রতিদিনের বাঙালি খাবার",
    pref_high_protein: "প্রোটিন বেশি", pref_high_protein_sub: "মাছ, ডিম, মুরগি, ডাল",
    pref_vegetarian: "নিরামিষ", pref_vegetarian_sub: "মাছ, মাংস ও ডিম ছাড়া",
    pref_diabetic: "ডায়াবেটিস-বান্ধব", pref_diabetic_sub: "শুধু সাধারণ খাদ্যতথ্য",
    pref_saver: "সর্বোচ্চ সাশ্রয়", pref_saver_sub: "সবচেয়ে কম খরচের বিকল্প",
    medical_note: "<strong>এটি চিকিৎসা পরামর্শ নয়।</strong> “ডায়াবেটিস-বান্ধব” মানে শুধু বেশি সবজি, ডাল ও আটার রুটি। এটি ডায়াবেটিস সারায় বা প্রতিরোধ করে না। নিজের প্রয়োজন জানতে ডাক্তার বা পুষ্টিবিদের সাথে কথা বলুন।",
    generate: "খাবারের পরিকল্পনা তৈরি করুন",
    planning: "পরিকল্পনা তৈরি হচ্ছে…",
    reset: "সব রিসেট করুন",

    empty_title: "আপনার খাবারের পরিকল্পনা এখানে দেখা যাবে",
    empty_text: "বাজেট লিখুন, ঘরে যা আছে যোগ করুন, তারপর <strong>খাবারের পরিকল্পনা তৈরি করুন</strong> চাপুন।",
    empty_s1: "দৈনিক বা সাপ্তাহিক বেছে নিন এবং টাকায় (৳) পরিমাণ লিখুন",
    empty_s2: "ঘরে যে খাবার আছে তা যোগ করুন (ঐচ্ছিক)",
    empty_s3: "খাবারের পছন্দ বেছে নিয়ে পরিকল্পনা তৈরি করুন",

    your_daily: "আপনার দৈনিক পরিকল্পনা",
    your_week: "আপনার ৭ দিনের পরিকল্পনা",
    waiting: "তথ্যের অপেক্ষায়",
    print: "প্রিন্ট",
    kpi_budget_daily: "দৈনিক বাজেট",
    kpi_budget_weekly: "সাপ্তাহিক বাজেট",
    kpi_cost: "আনুমানিক খরচ",
    kpi_cost_week: "আনুমানিক খরচ (৭ দিন)",
    kpi_remaining: "অবশিষ্ট",
    kpi_over: "বাজেটের চেয়ে বেশি",
    within: "বাজেটের মধ্যে",
    over: "বাজেটের বেশি",
    pct_used: "বাজেটের {pct}% খরচ হয়েছে",
    left_amt: "{amount} বাকি",
    short_amt: "{amount} কম পড়ছে",
    adjust_note: "আপনার কেনাকাটার তালিকার পরিবর্তনও হিসাবে ধরা হয়েছে (পরিকল্পিত খাবারের তুলনায় {sign}{amount})।",
    budget_aria: "বাজেট কতটা খরচ হয়েছে",

    ban_ready_day: "আপনার দৈনিক পরিকল্পনা তৈরি।",
    ban_ready_week: "আপনার ৭ দিনের পরিকল্পনা তৈরি।",
    ban_ready_text: "{span} {budget} বাজেটের মধ্যে আনুমানিক খরচ {cost}, হাতে থাকবে {left}।",
    span_day: "দৈনিক",
    span_week: "সাপ্তাহিক",
    ban_low_title: "পুরো {span} চালানোর জন্য আপনার বাজেট খুব কম।",
    ban_low_text: "আমাদের বানানো সবচেয়ে কম খরচের পরিকল্পনায় {min} লাগে, যা আপনার {budget} বাজেটের চেয়ে {over} বেশি। বাস্তবসম্মত বিকল্পের জন্য “স্মার্ট বিকল্প” দেখুন।",

    week_title: "এক নজরে সপ্তাহ",
    week_sub: "দিনপ্রতি আনুমানিক খরচ (ড্যাশ রেখা = গড় দৈনিক বরাদ্দ)",
    week_menu_title: "সাপ্তাহিক মেনু",
    day_n: "দিন {n}",
    day_tabs_aria: "দিন বেছে নিন",
    show_day: "দিন {n}: {amount}। এই দিনের খাবার দেখুন",
    slot_breakfast: "সকালের নাশতা", slot_lunch: "দুপুরের খাবার", slot_dinner: "রাতের খাবার",

    cost_badge: "প্রায় {amount}",
    nothing_to_buy_badge: "কিছু কিনতে হবে না",
    ingredients_title: "উপকরণ ও পরিমাণ",
    why_title: "কেন এই খাবার?",
    at_home: "ঘরে আছে",
    ing_partial: "ঘরে {home}, কিনতে {buy}",
    kcal: "ক্যালরি", protein: "প্রোটিন", carbs: "শর্করা", fat: "চর্বি", carbohydrates: "শর্করা", calories: "ক্যালরি",
    full_value: "পুরো রেসিপির মূল্য {gross}",
    you_buy: " · আপনি কিনবেন {amount}",
    macros_aria: "এই বেলার আনুমানিক পুষ্টি",

    nut_title_day: "দিনের আনুমানিক পুষ্টি",
    nut_title_week: "সপ্তাহের আনুমানিক পুষ্টি",
    nut_sub_day: "উপরের তিন বেলার খাবারের মোট",
    nut_sub_week: "৭ দিনের সব খাবারের মোট। দিনে গড়ে: {kcal} ক্যালরি, {protein} গ্রাম প্রোটিন। বেছে নেওয়া দিন (দিন {n}): {dkcal} ক্যালরি।",
    estimates: "আনুমানিক",
    unit_kcal: "ক্যালরি", unit_gram: "গ্রাম",
    ref_text: "{ref} {unit} রেফারেন্সের {pct}%",
    macro_p: "প্রোটিন {n}%", macro_c: "শর্করা {n}%", macro_f: "চর্বি {n}%",
    macro_share: "(খাদ্যশক্তিতে অংশ)",
    macro_aria: "খাদ্যশক্তিতে অংশ",
    nut_note: "বারগুলো তুলনার জন্য ২,০০০ ক্যালরির একটি সাধারণ রেফারেন্স দিনের সাথে মেলানো, শুধু উদাহরণ হিসেবে। মানগুলো আনুমানিক খাদ্য-তালিকার হিসাব থেকে নেওয়া; এগুলো ল্যাবরেটরিতে যাচাই করা <em>নয়</em> এবং কাটা, ব্র্যান্ড ও রান্নার পদ্ধতিভেদে বদলায়। এটি সাধারণ খাদ্যতথ্য, চিকিৎসা পরামর্শ নয়।",

    chk_title: "উপকরণ যাচাই: ঘরের মজুত বনাম এই পরিকল্পনা",
    chk_sub: "পরিকল্পনায় কত লাগবে, ঘরে কত আছে, কত বাকি থাকবে আর কত কিনতে হবে",
    chk_note: "“লাগবে” পরিমাণগুলো আনুমানিক: এই পরিকল্পনার প্রতিটি বেলার রেসিপির পরিমাণ (প্রতি বেলায় একজনের জন্য) যোগ করে হিসাব করা। দামও আনুমানিক।",
    chk_needed: "লাগবে", chk_home: "ঘরে আছে", chk_left: "পরে বাকি", chk_buy: "কিনতে হবে",
    chk_enough: "যথেষ্ট", chk_short: "{amount} কম পড়ছে", chk_none: "ঘরে নেই", chk_assumed: "পরিমাণ দেওয়া নেই", chk_unused: "লাগছে না",
    chk_plenty: "প্রচুর (ধরা হয়েছে)",
    chk_all_ok: "এই পরিকল্পনার সব উপকরণ আপনার ঘরের মজুতেই আছে।",
    chk_short_summary: "{n}টি উপকরণ ঘরের মজুতে পুরোপুরি নেই। নিচে দেখানো পরিমাণ কিনতে হবে।",
    chk_est_flag: "আনুমানিক",

    shop_title: "কেনাকাটার তালিকা",
    shop_sub_day: "ঘরের মজুতে নেই, শুধু এমন জিনিস",
    shop_sub_week: "পুরো সপ্তাহের জন্য কেনার সব জিনিস, একসাথে",
    items_one: "{n}টি জিনিস", items_other: "{n}টি জিনিস",
    items_bought: "{items} · {b}টি কেনা হয়েছে",
    shop_empty_title: "কিছু কিনতে হবে না!",
    shop_empty_sub: "এই পরিকল্পনার সবকিছু ঘরেই আছে, তাই আনুমানিক কেনাকাটার খরচ ৳0.00।",
    shop_progress: "🛒 {n}টির মধ্যে {b}টি কেনা হয়েছে",
    mark_all: "সব কেনা হয়েছে চিহ্নিত করুন",
    unmark_all: "সব চিহ্ন তুলুন",
    reset_qty: "পরিমাণ আগের মতো করুন",
    copy_list: "তালিকা কপি করুন",
    shop_for: "যে বেলায় লাগবে: {slots}",
    shop_used_one: "এই সপ্তাহে {n} বেলায় লাগবে", shop_used_other: "এই সপ্তাহে {n} বেলায় লাগবে",
    shop_dec_aria: "{name} এর পরিমাণ কমান",
    shop_inc_aria: "{name} এর পরিমাণ বাড়ান",
    shop_check_aria: "{name} কেনা হয়েছে বলে চিহ্নিত করুন",
    shop_qty_aria: "{name} এর পরিমাণ ({unit})",
    tot_bought: "ইতিমধ্যে কেনা",
    tot_pending: "এখনও কিনতে হবে",
    tot_grand: "মোট আনুমানিক কেনাকাটার খরচ",
    tot_aria: "কেনাকাটার মোট",
    shop_hint: "কেনা হলে টিক দিন। + / − দিয়ে বা সংখ্যা লিখে পরিমাণ বদলান। দাম আনুমানিক, বাজারের চলতি দাম নয়।",
    copy_header: "Foodsphere কেনাকাটার তালিকা (আনুমানিক দাম, টাকায়)",
    copy_total: "মোট",

    alt_title: "স্মার্ট বিকল্প",
    alt_sub: "আপনার পরিকল্পনা থেকে হিসাব করা পরামর্শ ও বদল",
    alt_empty_title: "ঠিকঠাক আছে",
    alt_empty_sub: "এই পরিকল্পনায় বাড়তি বদলের দরকার নেই।",

    toast_added: "{name} যোগ হয়েছে",
    toast_added_n: "{n}টি জিনিস যোগ হয়েছে",
    toast_removed: "{name} বাদ দেওয়া হয়েছে",
    toast_dup: "তালিকায় আগেই আছে",
    toast_updated: "{name} হালনাগাদ হয়েছে",
    toast_plan_ready: "খাবারের পরিকল্পনা তৈরি",
    toast_plan_low: "পরিকল্পনা তৈরি: বাজেট খুব কম",
    toast_qty_reset: "পরিমাণ আগের মতো করা হয়েছে",
    toast_copied: "কেনাকাটার তালিকা কপি হয়েছে",
    toast_copy_fail: "কপি করা যায়নি। বদলে প্রিন্ট করে দেখুন।",
    toast_reset: "সবকিছু রিসেট হয়েছে",
    toast_lang: "ভাষা: বাংলা",

    pm_type_first: "আগে একটি খাবারের নাম লিখুন, যেমন “চাল”।",
    pm_added: "{names} যোগ হয়েছে।",
    pm_added_dup: "{names} যোগ হয়েছে। আগেই তালিকায় আছে: {dupes}।",
    pm_dup_one: "{names} আগেই তালিকায় আছে, তাই আবার যোগ করা হয়নি। পরিমাণ বদলাতে তালিকা থেকেই বদলে নিন।",
    pm_dup_other: "{names} আগেই তালিকায় আছে, তাই আবার যোগ করা হয়নি। পরিমাণ বদলাতে তালিকা থেকেই বদলে নিন।",
    inv_plenty_ph: "প্রচুর",
    inv_unit_hint: "একক",
    pm_removed: "{name} বাদ দেওয়া হয়েছে।",
    pm_updated: "{name} হালনাগাদ হয়েছে: {qty}।",
    pm_cleared: "{name}: পরিমাণ মুছে ফেলা হয়েছে (প্রচুর আছে ধরা হবে)।",
    qe_invalid: "সঠিক পরিমাণ লিখুন, যেমন ২ বা ০.৫।",
    qe_negative: "পরিমাণ ঋণাত্মক হতে পারে না।",
    qe_unit: "{name} মাপা হয় {units} এককে। এর মধ্যে থেকে একটি বেছে নিন।",
    qe_whole: "টির সংখ্যা পূর্ণ সংখ্যায় লিখুন, যেমন ৬।",
    qe_toolarge: "এই পরিমাণ ঘরের জন্য অনেক বেশি। আবার দেখে নিন।",
    qe_multi: "পরিমাণ দিতে হলে একবারে একটি জিনিস যোগ করুন। পরে তালিকা থেকেও পরিমাণ বদলাতে পারবেন।",
    qe_unknown: "“{name}” আমাদের রেসিপিতে নেই, তাই এর পরিমাণ হিসাবে ধরা হয়নি।",
    pn_unknown: "পরিকল্পনায় ব্যবহার হয়নি (আমাদের রেসিপিতে নেই): {items}। রান্নার তেল, পেঁয়াজ, লবণ ও মসলার খরচ হিসাবে ধরা হয় না।",

    footer_main: "<strong>Foodsphere Nutritio Intelligence</strong> · বিশ্ববিদ্যালয় প্রকল্প · বাজেটভিত্তিক খাবার পরিকল্পনা",
    footer_sub: "দামগুলো টাকায় আনুমানিক ধারণা, <strong>বাজারের চলতি দাম নয়</strong>, এবং আপনার এলাকায় ভিন্ন হতে পারে। পুষ্টির মান আনুমানিক, ল্যাবরেটরিতে যাচাই করা নয়, আর শুধু মূল উপকরণ ধরে হিসাব করা (তেল, মসলা ও লবণ ধরা হয়নি)। সুপারিশ আসে স্পষ্ট নিয়ম থেকে, কোনো এআই মডেল থেকে নয়। এই টুল সাধারণ খাদ্যতথ্য দেয়, চিকিৎসা পরামর্শ নয়।",

    period_day: "দিন", period_week: "সপ্তাহ",
    word_daily: "দৈনিক", word_weekly: "সাপ্তাহিক",
    e_budget_empty: "খাবারের পরিকল্পনা তৈরি করতে টাকায় (৳) একটি সঠিক বাজেট লিখুন।",
    e_budget_invalid: "এটি সঠিক পরিমাণ নয়। ২৫০ এর মতো একটি সংখ্যা লিখুন (শুধু অঙ্ক)।",
    e_budget_negative: "আপনার বাজেট ৳0 এর চেয়ে বেশি হতে হবে। ঋণাত্মক পরিমাণ দিয়ে খাবারের পরিকল্পনা করা যায় না।",
    e_budget_zero: "আপনার বাজেট ৳0 এর চেয়ে বেশি হতে হবে।",
    e_budget_toolarge: "ব্যক্তিগত খাবারের বাজেট হিসেবে এটি বাস্তবসম্মত নয়। অনুগ্রহ করে বাস্তবসম্মত পরিমাণ লিখুন (প্রতি {period} সর্বোচ্চ ৳{max})।",
    e_no_recipes: "নির্বাচিত সেটিংয়ে কোনো রেসিপি পাওয়া যায়নি। সুষম পছন্দ দিয়ে চেষ্টা করুন।",

    r_pantry_full_badge: "পুরোটাই ঘরে আছে",
    r_pantry_full_text: "শুধু ঘরে থাকা উপকরণ ({names}) দিয়েই তৈরি, তাই কিনতে হবে ৳0।",
    r_pantry_use_badge: "ঘরের মজুত কাজে লাগছে",
    r_pantry_use_text: "ঘরে থাকা {names} ব্যবহার হচ্ছে, সাশ্রয় প্রায় {saving}।",
    r_budget_small_badge: "সাশ্রয়ী",
    r_budget_small_text: "খরচ প্রায় {cost}, যা আপনার দৈনিক বরাদ্দের সামান্য অংশ।",
    r_budget_ok_badge: "বাজেটের মধ্যে",
    r_budget_ok_text: "খরচ প্রায় {cost} এবং দৈনিক বরাদ্দের মধ্যেই আছে।",
    r_budget_low_badge: "সবচেয়ে কম খরচ",
    r_budget_low_text: "এই বেলার জন্য সবচেয়ে সাশ্রয়ী বিকল্প (প্রায় {cost})।",
    r_protein_badge: "প্রোটিনের উৎস",
    r_protein_text: "প্রায় {protein} গ্রাম প্রোটিন, মূলত {source} থেকে।",
    src_fish: "মাছ", src_chicken: "মুরগি", src_eggs: "ডিম", src_lentils: "ডাল",
    r_fibre_badge: "আঁশ ও ভিটামিন",
    r_fibre_text: "আঁশ ও ভিটামিনের জন্য মৌসুমি সবজি আছে ({kcal} ক্যালরি)।",
    r_roti_badge: "আটার শক্তি",
    r_roti_text: "আটার রুটি থেকে ধীরে ধীরে শক্তি পাওয়া যায়।",
    r_veg_badge: "নিরামিষ",
    r_veg_text: "এতে মাংস, মাছ বা ডিম নেই।",
    r_hp_badge: "প্রোটিন বেশি",
    r_hp_text: "আপনার পছন্দ অনুযায়ী বেশি প্রোটিনের রেসিপি থেকে বাছা হয়েছে।",
    r_diab_badge: "ডায়াবেটিস-বান্ধব ধরন",
    r_diab_text: "সবজি, ডাল বা আটার রুটির ওপর জোর দেওয়া হয়েছে। এটি শুধু সাধারণ খাদ্যতথ্য, চিকিৎসা পরামর্শ নয়।",
    r_save_badge: "সাশ্রয়ের দিকে নজর",
    r_save_text: "আপনার খরচ যতটা সম্ভব কম রাখতে বাছা হয়েছে।",
    x_uses: "আপনার ঘরে থাকা {names} ব্যবহার করে",
    x_cost_fit: "{allow} দৈনিক বরাদ্দের মধ্যে খরচ পড়বে প্রায় {cost}",
    x_cost_low: "এই বেলার সবচেয়ে কম খরচের বিকল্প ({cost})",
    x_gives: "{kcal} ক্যালরি ও {protein} গ্রাম প্রোটিন দেয়",
    x_and: " এবং ",
    x_sentence: "এটি সুপারিশ করা হয়েছে, কারণ এটি {clauses}।",

    a_per_day: " (দিনে প্রায় {amount})",
    a_low_title: "পুরো পরিকল্পনার জন্য আপনার বাজেট খুব কম",
    a_low_desc: "আপনার {period} বাজেট {budget}, আমাদের বানানো সবচেয়ে কম খরচের পরিকল্পনার ({min}) চেয়ে {short} কম। ফাঁকটা না লুকিয়ে সবচেয়ে সস্তা পরিকল্পনাটিই দেখানো হয়েছে।",
    a_low_tip: "ন্যূনতম আনুমানিক {period} বাজেট: {min}{perday}।",
    a_cover_title: "আপনার বাজেটে কী কী হবে",
    a_cover_none: "সবচেয়ে সস্তা এক বেলার খাবারটিও ({meal}, প্রায় {cost}) আপনার দৈনিক বরাদ্দ {allowance} এর চেয়ে বেশি।",
    a_cover_none_tip: "বাজেট বাড়ান, অথবা ঘরে থাকা খাবার যোগ করুন।",
    a_cover_some: "দিনে প্রায় {allowance} দিয়ে ৩ বেলার মধ্যে {count} বেলা চলবে: {list}।",
    a_cover_item: "{slot} ({meal}, {cost})",
    a_cover_tip: "বাকি {n} বেলার জন্য আরও বাজেট বা ঘরের মজুত লাগবে।",
    a_pantry_title: "ঘরে যদি {food} থাকে",
    a_pantry_desc: "তাহলে সবচেয়ে কম খরচের দিনটির খরচ প্রায় {saved} কমবে, কারণ এটি কিনতে হবে না।",
    a_pantry_tip: "“ঘরে থাকা খাবার” অংশে যোগ করুন, পরিকল্পনা নিজে থেকেই বদলে যাবে।",
    a_swap_title: "সস্তা {slot}: {meal}",
    a_swap_desc: "“{from}” বদলে “{to}” নিলে প্রায় {total} সাশ্রয় হবে{weekly}। পুষ্টির পরিবর্তন: {dcal} ক্যালরি, {dpro} গ্রাম প্রোটিন।",
    a_swap_week: " (সপ্তাহে {n} বেলায়)",
    a_swap_tip: "সবচেয়ে কম খরচের পরিকল্পনা নিজে থেকে পেতে “সর্বোচ্চ সাশ্রয়” পছন্দ বেছে নিন।",
    a_empty_title: "ঘরের খাবারের টিপ",
    a_empty_desc: "ঘরে থাকা কোনো খাবার এখনও যোগ করা হয়নি। ঘরে আগে থেকে থাকা উপকরণের দাম আপনার খাবারের বাজেট থেকে ধরা হয় না।",
    a_empty_tip: "রান্নাঘর দেখে নিন এবং “ঘরে থাকা খাবার” অংশে যোগ করুন।",
    a_room_title: "বাজেটে আরও জায়গা আছে",
    a_room_desc: "এই পরিকল্পনায় {amount} খরচ হচ্ছে না। চাইলে জমিয়ে রাখুন, অথবা প্রোটিনজাতীয় খাবারে বেশি খরচ করতে “প্রোটিন বেশি” পছন্দ চেষ্টা করুন।",

    n_broadened: "আপনার পছন্দের সাথে মেলে এমন যথেষ্ট রেসিপি সব বেলার জন্য নেই, তাই কিছু বেলার খাবার সাধারণ তালিকা থেকে নেওয়া হয়েছে।",
    n_medical: "এখানে “ডায়াবেটিস-বান্ধব” মানে শুধু সাধারণ খাদ্যতথ্য (বেশি সবজি, ডাল ও আটার রুটি)। এটি চিকিৎসা পরামর্শ নয় এবং ডায়াবেটিস সারায় বা প্রতিরোধ করে না। নিজের প্রয়োজনের জন্য ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।",
    n_lowkcal: "এই পরিকল্পনায় দিনে প্রায় {kcal} ক্যালরি মেলে, যা অনেক প্রাপ্তবয়স্কের জন্য কম হতে পারে। বড় পরিমাণে বা বাড়তি খাবার নেওয়ার কথা ভাবুন। এগুলো মোটামুটি আনুমানিক হিসাব, ব্যক্তিগত পরামর্শ নয়।",
    n_assume_week: "ঘরে প্রচুর আছে বলে চিহ্নিত জিনিস পুরো সপ্তাহ চলবে ধরে নেওয়া হয়েছে।",
    n_stock_short: "ঘরে থাকা {n}টি উপকরণ পুরো পরিকল্পনার জন্য যথেষ্ট নয়। আরও কত কিনতে হবে তা “উপকরণ যাচাই” অংশে দেখুন।"
  };

  const dict = { en, bn };
  const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  let lang = 'en';
  const listeners = [];

  const toBnDigits = str => String(str).replace(/[0-9]/g, d => BN_DIGITS[d]);
  const toEnDigits = str => String(str).replace(/[০-৯]/g, d => String(BN_DIGITS.indexOf(d)));

  function t(key, params) {
    let s = dict[lang] && dict[lang][key];
    if (s === undefined) s = dict.en[key];
    if (s === undefined) return key;
    return s.replace(/\{(\w+)\}/g, (m, k) => (params && params[k] !== undefined ? params[k] : m));
  }
  /** Singular/plural helper: uses keys "<key>_one" and "<key>_other". */
  function tn(key, n, params) {
    return t(key + (Number(n) === 1 ? '_one' : '_other'), Object.assign({ n }, params));
  }

  // ---- DOM helpers (only used in the browser) ----
  function applyStatic(root) {
    if (typeof document === 'undefined') return;
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
    scope.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(x => x.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.title = t('doc_title');
  }

  function convertTextNodes(root, fn) {
    if (!root) return;
    if (root.nodeType === 3) { const v = root.nodeValue, n = fn(v); if (n !== v) root.nodeValue = n; return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT)$/.test(root.tagName)) return;
    for (let c = root.firstChild; c; c = c.nextSibling) convertTextNodes(c, fn);
  }

  let observer = null;
  /** In Bangla mode every digit that appears as page text is shown as a Bangla digit. */
  function syncDigits() {
    if (typeof document === 'undefined' || !document.body) return;
    if (observer) { observer.disconnect(); observer = null; }
    if (lang === 'bn') {
      convertTextNodes(document.body, toBnDigits);
      if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(muts => {
          observer.disconnect();
          muts.forEach(m => {
            if (m.type === 'characterData') convertTextNodes(m.target, toBnDigits);
            else m.addedNodes.forEach(n => convertTextNodes(n, toBnDigits));
          });
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    } else {
      convertTextNodes(document.body, toEnDigits);
    }
  }

  function saved() {
    try { const v = localStorage.getItem(STORAGE_KEY); return v === 'bn' || v === 'en' ? v : null; } catch (e) { return null; }
  }

  /** Switches language, remembers it, updates static text and tells the app to redraw. */
  function setLang(next, opts) {
    if (!dict[next]) return;
    lang = next;
    if (typeof document !== 'undefined') document.documentElement.lang = next;
    if (!(opts && opts.remember === false)) { try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode: just don't remember */ } }
    if (typeof document !== 'undefined' && document.body) { convertTextNodes(document.body, toEnDigits); }
    applyStatic();
    listeners.forEach(fn => fn(next));
    syncDigits();
  }

  /** Call once at start: restores the saved language (English by default). */
  function init() {
    const s = saved();
    lang = s || 'en';
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }

  return {
    get lang() { return lang; },
    dict, t, tn, setLang, init, applyStatic, syncDigits, toBnDigits, toEnDigits,
    onChange(fn) { listeners.push(fn); }
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { I18N };
