import { useState, useEffect, useRef } from "react";

const FONT = "'Barlow Condensed', 'Impact', sans-serif";
const FONT_BODY = "'Barlow', 'Arial Narrow', sans-serif";

const COLORS = {
  bg: "#0a0c10", surface: "#12151c", card: "#181c26", border: "#1e2535",
  accent: "#2979ff", accentDim: "#1a3a6e", accentText: "#5b9bff",
  green: "#00e676", greenDim: "#003d1a", amber: "#ffab00", amberDim: "#3d2800",
  red: "#ff1744", text: "#e8eaf0", muted: "#5a6278", dimmed: "#2e3447",
};

const WORKOUT_PLAN = {
  "Mon": {
    name: "Upper Pull + Fingers", muscles: ["Back", "Biceps", "Forearms"],
    exercises: [
      { name: "Pull-ups", muscle: "Back", sets: 4, reps: "6–8" },
      { name: "Weighted Pull-ups", muscle: "Back", sets: 3, reps: "5–6" },
      { name: "Barbell Row", muscle: "Back", sets: 4, reps: "8–10" },
      { name: "Cable Row", muscle: "Back", sets: 3, reps: "10–12" },
      { name: "Hammer Curl", muscle: "Biceps", sets: 3, reps: "10–12" },
      { name: "Hangboard – Half Crimp", muscle: "Forearms", sets: 5, reps: "7s on / 3s off" },
      { name: "Wrist Roller", muscle: "Forearms", sets: 3, reps: "2 min" },
    ],
  },
  "Tue": { name: "Climbing", muscles: ["Full Body"], isClimbing: true, exercises: [] },
  "Wed": {
    name: "Push + Antagonist", muscles: ["Chest", "Shoulders", "Triceps"],
    exercises: [
      { name: "Bench Press", muscle: "Chest", sets: 4, reps: "6–8" },
      { name: "Overhead Press", muscle: "Shoulders", sets: 4, reps: "8–10" },
      { name: "Incline DB Press", muscle: "Chest", sets: 3, reps: "10–12" },
      { name: "Lateral Raise", muscle: "Shoulders", sets: 3, reps: "12–15" },
      { name: "Tricep Pushdown", muscle: "Triceps", sets: 3, reps: "12–15" },
      { name: "Chest-Supported Row", muscle: "Back", sets: 4, reps: "8–10" },
      { name: "Face Pull", muscle: "Shoulders", sets: 3, reps: "15–20" },
      { name: "Barbell Curl", muscle: "Biceps", sets: 3, reps: "10–12" },
    ],
  },
  "Thu": {
    name: "Legs + Core", muscles: ["Quads", "Hamstrings", "Core"],
    exercises: [
      { name: "Squat", muscle: "Quads", sets: 4, reps: "6–8" },
      { name: "Romanian Deadlift", muscle: "Hamstrings", sets: 4, reps: "8–10" },
      { name: "Leg Press", muscle: "Quads", sets: 3, reps: "10–12" },
      { name: "Hanging Leg Raise", muscle: "Core", sets: 3, reps: "12–15" },
      { name: "Ab Wheel Rollout", muscle: "Core", sets: 3, reps: "10–12" },
    ],
  },
  "Fri": { name: "Climbing", muscles: ["Full Body"], isClimbing: true, exercises: [] },
  "Sat": { name: "Rest", muscles: [], isRest: true, exercises: [] },
  "Sun": { name: "Rest", muscles: [], isRest: true, exercises: [] },
};

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const ALL_EXERCISES = [
  "Pull-ups", "Weighted Pull-ups", "Chin-ups", "Lat Pulldown",
  "Barbell Row", "Cable Row", "Chest-Supported Row",
  "Bench Press", "Incline DB Press", "Overhead Press",
  "Lateral Raise", "Face Pull", "Tricep Pushdown",
  "Squat", "Romanian Deadlift", "Leg Press", "Leg Curl Machine", "Leg Extension Machine",
  "Barbell Curl", "Hammer Curl", "Wrist Roller",
  "Hanging Leg Raise", "Ab Wheel Rollout", "Plank",
  "Hangboard – Half Crimp", "Hangboard – Open Hand",
];

const WARMUP = [
  "5 min light cardio (bike or row)",
  "Arm circles × 15", "Hip circles × 15",
  "Wrist mobility × 20", "Shoulder dislocates × 10", "Bodyweight squats × 10",
];

const COOLDOWN = [
  "Doorway chest stretch – 30s each side",
  "Lat stretch (overhead) – 30s each side",
  "Hip flexor lunge stretch – 45s each side",
  "Forearm flexor stretch – 30s each side",
  "Child's pose – 60s",
];

const MEAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Shared weekday breakfast
const WEEKDAY_BREAKFAST = {
  type: "Breakfast", name: "Egg & Cheese Wraps", kcal: 680, protein: 38,
  description: "4 scrambled eggs with cheese in two flour tortillas with butter. Quick, high protein, easy to make every morning.",
  ingredients: ["4 eggs", "2 flour tortillas", "50g cheese", "butter", "salt & pepper"],
  prepNote: "Your go-to every weekday. Ready in 10 min. Consistent = less decision fatigue.",
};

const MEAL_PLAN = {
  "Mon": {
    prepTip: "Lunches are already prepped from Sunday — just grab a box from the fridge and pack it.",
    meals: [
      WEEKDAY_BREAKFAST,
      {
        type: "Lunch", name: "Minced Beef Pasta (batch)", kcal: 800, protein: 50,
        description: "Portion of Sunday's batch-cooked minced beef pasta. Pack in a container and microwave at school.",
        ingredients: ["prepped minced beef pasta from Sunday"],
        prepNote: "Batch cooked Sunday. Stores up to 4 days. Microwave 2–3 min.",
      },
      {
        type: "Snack", name: "Greek Yoghurt & Crispbread", kcal: 380, protein: 28,
        description: "250g full-fat Greek yoghurt with 4 crispbreads and a drizzle of honey.",
        ingredients: ["250g Greek yoghurt (full fat)", "4 crispbreads", "honey"],
      },
      {
        type: "Dinner", name: "Baked Salmon & Potato", kcal: 820, protein: 48,
        description: "200g fresh baked salmon fillet with 300g boiled potatoes and butter.",
        ingredients: ["200g fresh salmon fillet", "300g potatoes", "butter", "lemon", "dill"],
      },
    ],
  },
  "Tue": {
    prepTip: "Climbing day — eat your snack 60–90 min before the 16:00 session for best energy.",
    meals: [
      WEEKDAY_BREAKFAST,
      {
        type: "Lunch", name: "Minced Beef Pasta (batch)", kcal: 800, protein: 50,
        description: "Second portion of Sunday's minced beef pasta. Same box, same microwave, zero effort.",
        ingredients: ["prepped minced beef pasta from Sunday"],
        prepNote: "Day 2 of the batch. Still fresh, still good.",
      },
      {
        type: "Snack", name: "Bread with Butter, Honey & Banana", kcal: 480, protein: 16,
        description: "3 slices of bread with butter and honey, and a banana on the side. Eat 90 min before climbing.",
        ingredients: ["3 slices bread", "2 tbsp butter", "honey", "1 banana"],
        prepNote: "Pre-climbing fuel — easy carbs and energy. Simple and effective.",
      },
      {
        type: "Dinner", name: "Pork Tenderloin & Rice", kcal: 880, protein: 54,
        description: "250g pork tenderloin pan-fried with garlic butter, served with 150g cooked rice and broccoli.",
        ingredients: ["250g pork tenderloin", "150g rice (dry)", "broccoli", "garlic", "butter"],
      },
    ],
  },
  "Wed": {
    prepTip: "Heavy gym day. Make sure you eat your prepped lunch before training — don't skip it.",
    meals: [
      WEEKDAY_BREAKFAST,
      {
        type: "Lunch", name: "Chicken & Rice (batch)", kcal: 780, protein: 48,
        description: "Portion of Sunday's batch chicken — diced chicken thighs over rice with broccoli and soy sauce. Microwave at school.",
        ingredients: ["prepped chicken & rice from Sunday"],
        prepNote: "Batch cooked Sunday. Stores up to 4 days. Microwave 2–3 min.",
      },
      {
        type: "Snack", name: "Milk & Crispbread with Cheese", kcal: 400, protein: 22,
        description: "500ml whole milk with 4 crispbreads topped with cheese slices. Easy calories.",
        ingredients: ["500ml whole milk", "4 crispbreads", "cheese slices"],
      },
      {
        type: "Dinner", name: "Minced Beef & Potato Bake", kcal: 900, protein: 52,
        description: "300g minced beef fried with garlic and paprika, baked with diced potatoes in the oven until golden.",
        ingredients: ["300g minced beef", "350g potatoes", "garlic", "paprika", "olive oil", "butter", "salt"],
      },
    ],
  },
  "Thu": {
    prepTip: "Leg day — heaviest session of the week. Eat your prepped lunch at least 2h before training.",
    meals: [
      WEEKDAY_BREAKFAST,
      {
        type: "Lunch", name: "Chicken & Rice (batch)", kcal: 780, protein: 48,
        description: "Second portion of Sunday's batch chicken and rice. Pack it, microwave it, done.",
        ingredients: ["prepped chicken & rice from Sunday"],
        prepNote: "Day 2 of the chicken batch. Last one — good timing.",
      },
      {
        type: "Snack", name: "Greek Yoghurt & Fruit", kcal: 380, protein: 26,
        description: "300g full-fat Greek yoghurt with a handful of grapes or a sliced apple and a drizzle of honey.",
        ingredients: ["300g Greek yoghurt (full fat)", "grapes or apple", "honey"],
      },
      {
        type: "Dinner", name: "Chicken Thigh & Roasted Potatoes", kcal: 900, protein: 52,
        description: "4 chicken thighs roasted with olive oil and paprika, with 350g roasted potatoes.",
        ingredients: ["4 chicken thighs", "350g potatoes", "olive oil", "paprika", "garlic powder", "salt"],
        prepNote: "Make a double batch — Friday's lunch is sorted.",
      },
    ],
  },
  "Fri": {
    prepTip: "Climbing day again. Snack 90 min before 16:00. Keep dinner high protein for recovery.",
    meals: [
      WEEKDAY_BREAKFAST,
      {
        type: "Lunch", name: "Chicken Thigh & Potatoes (leftover)", kcal: 850, protein: 50,
        description: "Extra portion from Thursday's dinner. Pack in a container and microwave at school.",
        ingredients: ["leftover chicken thighs", "leftover roasted potatoes"],
        prepNote: "Thursday's double batch pays off. Microwave 2–3 min.",
      },
      {
        type: "Snack", name: "Bread with Butter, Honey & Banana", kcal: 460, protein: 14,
        description: "Same as Tuesday — butter, honey and banana on bread. Eat 90 min before your session.",
        ingredients: ["3 slices bread", "2 tbsp butter", "honey", "1 banana"],
        prepNote: "Consistent pre-climb meal = consistent energy.",
      },
      {
        type: "Dinner", name: "Baked Salmon & Potato", kcal: 820, protein: 48,
        description: "Repeat of Monday dinner — great post-climbing recovery meal. High protein, easy to cook.",
        ingredients: ["200g fresh salmon fillet", "300g potatoes", "butter", "lemon", "dill"],
      },
    ],
  },
  "Sat": {
    prepTip: "Start your Sunday prep today if you want — fry the minced beef and marinate the chicken overnight.",
    meals: [
      {
        type: "Breakfast", name: "Buttermilk Pancakes", kcal: 720, protein: 24,
        description: "8–10 fluffy pancakes made with eggs, flour, milk and butter. Top with honey and banana slices.",
        ingredients: ["3 eggs", "200g flour", "300ml milk", "2 tbsp butter", "1 tsp baking powder", "honey", "1 banana"],
        prepNote: "Weekend treat — slow breakfast, you've earned it.",
      },
      {
        type: "Lunch", name: "Egg Fried Rice", kcal: 780, protein: 38,
        description: "3 eggs scrambled into 200g cooked rice with butter, soy sauce and spring onion. Quick and filling.",
        ingredients: ["3 eggs", "200g cooked rice", "butter", "soy sauce", "spring onion", "sesame oil"],
      },
      {
        type: "Snack", name: "Milk & Bread with Cheese", kcal: 480, protein: 24,
        description: "500ml whole milk with 3 slices of bread topped with cheese slices. Easy calorie boost.",
        ingredients: ["500ml whole milk", "3 slices bread", "cheese slices"],
      },
      {
        type: "Dinner", name: "Beef Steak & Potatoes", kcal: 950, protein: 58,
        description: "250g beef steak pan-fried in butter and garlic, with 350g boiled potatoes and broccoli.",
        ingredients: ["250g beef steak", "350g potatoes", "broccoli", "butter", "garlic", "rosemary"],
      },
    ],
  },
  "Sun": {
    prepTip: "Prep day! Make batch 1 (minced beef pasta — 2 portions) and batch 2 (chicken & rice — 2 portions). Pack into 4 containers. Done for the week.",
    meals: [
      {
        type: "Breakfast", name: "Cheese & Ham Omelette", kcal: 680, protein: 44,
        description: "5-egg omelette stuffed with cheese and ham slices, fried in butter. Served with 2 slices of bread.",
        ingredients: ["5 eggs", "60g cheese", "3 slices ham", "butter", "2 slices bread", "salt & pepper"],
        prepNote: "Big Sunday breakfast before a prep session.",
      },
      {
        type: "Lunch", name: "Bread, Eggs & Cheese", kcal: 680, protein: 36,
        description: "3 fried eggs on 3 slices of bread with cheese melted on top. Fast and easy between prep tasks.",
        ingredients: ["3 eggs", "3 slices bread", "50g cheese", "butter"],
      },
      {
        type: "Snack", name: "Greek Yoghurt & Crispbread", kcal: 380, protein: 28,
        description: "250g full-fat Greek yoghurt with 4 crispbreads and honey.",
        ingredients: ["250g Greek yoghurt (full fat)", "4 crispbreads", "honey"],
      },
      {
        type: "Dinner", name: "Batch Cook Session", kcal: 880, protein: 54,
        description: "While you prep for the week: cook a big pot of minced beef pasta (2 school portions) AND a tray of chicken thighs with rice and broccoli (2 school portions). Eat one portion as dinner.",
        ingredients: ["500g minced beef", "200g pasta", "600g chicken thighs", "300g rice (dry)", "broccoli", "garlic", "parmesan", "olive oil", "paprika", "soy sauce"],
        prepNote: "Pack 4 containers while it's hot. Mon+Tue = beef pasta. Wed+Thu = chicken rice.",
      },
    ],
  },
};

const GROCERY_LIST = [
  {
    section: "Meat & Fish", color: "#ff6b6b",
    items: [
      { name: "Chicken thighs", qty: "1 kg" },
      { name: "Minced beef 80/20", qty: "800 g" },
      { name: "Beef steak", qty: "250 g" },
      { name: "Fresh salmon fillets", qty: "400 g" },
      { name: "Pork tenderloin", qty: "250 g" },
      { name: "Ham slices", qty: "150 g" },
    ],
  },
  {
    section: "Dairy & Eggs", color: "#74c0fc",
    items: [
      { name: "Eggs", qty: "18 pack" },
      { name: "Greek yoghurt, full fat", qty: "800 g" },
      { name: "Cheese block (Norvegia/Jarlsberg)", qty: "400 g" },
      
      { name: "Butter", qty: "250 g" },
      { name: "Whole milk", qty: "2 L" },
      { name: "Parmesan", qty: "small block ~100 g" },
    ],
  },
  {
    section: "Produce", color: "#69db7c",
    items: [
      { name: "Bananas", qty: "2 bunches (~14 pcs)" },
      { name: "Grapes or apples", qty: "500 g" },
      { name: "Lemon", qty: "2 pcs" },
      { name: "Spring onion", qty: "1 bunch" },
      { name: "Garlic", qty: "1 head" },
      { name: "Frozen broccoli", qty: "1.5 kg (2 bags)" },
      { name: "Broccoli (extra)", qty: "500 g extra" },
    ],
  },
  {
    section: "Bread & Grains", color: "#ffd43b",
    items: [
      { name: "Rice", qty: "1 kg bag" },
      { name: "Pasta (penne or rigatoni)", qty: "500 g" },
      { name: "Flour tortillas", qty: "8 pack" },
      { name: "Bread loaf", qty: "1 loaf" },
      { name: "Crispbreads (Wasa or Ryvita)", qty: "1 pack ~300 g" },
      { name: "Cornflakes", qty: "400 g box" },
      { name: "Wheat flour (pancakes)", qty: "200 g" },
      { name: "Potatoes", qty: "2 kg" },
    ],
  },
  {
    section: "Pantry & Condiments", color: "#da77f2",
    items: [
      { name: "Olive oil", qty: "500 ml bottle" },
      { name: "Sesame oil", qty: "small bottle" },
      { name: "Soy sauce", qty: "150 ml" },
      { name: "Honey", qty: "250 g jar" },
      { name: "Paprika (sweet)", qty: "1 jar" },
      { name: "Chilli flakes", qty: "1 jar" },
      { name: "Dried dill", qty: "1 jar" },
      { name: "Dried rosemary", qty: "1 jar" },
      { name: "Baking powder", qty: "1 pack" },
      { name: "Salt & black pepper", qty: "if needed" },
    ],
  },
];

function formatTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function formatDate(d) { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function dayLabel(d) { return new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }

const SAMPLE_HISTORY = [
  { id: 1, day: "Mon", name: "Upper Pull + Fingers", date: "2024-03-04", duration: 3420, exercises: [{ name: "Pull-ups", muscle: "Back", sets: [{ weight: 0, reps: 7 }, { weight: 0, reps: 6 }, { weight: 0, reps: 6 }, { weight: 0, reps: 5 }] }, { name: "Barbell Row", muscle: "Back", sets: [{ weight: 50, reps: 10 }, { weight: 50, reps: 9 }, { weight: 50, reps: 9 }, { weight: 50, reps: 8 }] }, { name: "Hammer Curl", muscle: "Biceps", sets: [{ weight: 16, reps: 12 }, { weight: 16, reps: 11 }, { weight: 16, reps: 10 }] }], prs: ["Pull-ups"] },
  { id: 2, day: "Wed", name: "Push + Antagonist", date: "2024-03-06", duration: 3900, exercises: [{ name: "Bench Press", muscle: "Chest", sets: [{ weight: 60, reps: 8 }, { weight: 60, reps: 7 }, { weight: 60, reps: 7 }, { weight: 55, reps: 8 }] }, { name: "Overhead Press", muscle: "Shoulders", sets: [{ weight: 40, reps: 10 }, { weight: 40, reps: 9 }, { weight: 40, reps: 8 }, { weight: 37.5, reps: 9 }] }, { name: "Lateral Raise", muscle: "Shoulders", sets: [{ weight: 10, reps: 15 }, { weight: 10, reps: 14 }, { weight: 10, reps: 13 }] }], prs: ["Bench Press", "Overhead Press"] },
  { id: 3, day: "Thu", name: "Legs + Core", date: "2024-03-07", duration: 4200, exercises: [{ name: "Squat", muscle: "Quads", sets: [{ weight: 70, reps: 8 }, { weight: 70, reps: 7 }, { weight: 70, reps: 7 }, { weight: 65, reps: 8 }] }, { name: "Romanian Deadlift", muscle: "Hamstrings", sets: [{ weight: 65, reps: 10 }, { weight: 65, reps: 9 }, { weight: 65, reps: 9 }, { weight: 65, reps: 8 }] }, { name: "Hanging Leg Raise", muscle: "Core", sets: [{ weight: 0, reps: 14 }, { weight: 0, reps: 12 }, { weight: 0, reps: 12 }] }], prs: ["Squat"] },
];

const SAMPLE_PRs = {
  "Pull-ups": { weight: 0, reps: 7, date: "2024-03-04" },
  "Bench Press": { weight: 60, reps: 8, date: "2024-03-06" },
  "Squat": { weight: 70, reps: 8, date: "2024-03-07" },
  "Overhead Press": { weight: 40, reps: 10, date: "2024-03-06" },
  "Barbell Row": { weight: 50, reps: 10, date: "2024-03-04" },
};

export default function FitnessTracker() {
  const [tab, setTab] = useState("dashboard");
  const [mealDay, setMealDay] = useState("Mon");
  const [checkedItems, setCheckedItems] = useState({});
  const toggleGrocery = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const totalItems = GROCERY_LIST.reduce((a, s) => a + s.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const [history, setHistory] = useState(SAMPLE_HISTORY);
  const [prs, setPrs] = useState(SAMPLE_PRs);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [showExPicker, setShowExPicker] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (activeWorkout) { timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    else { clearInterval(timerRef.current); setElapsed(0); }
    return () => clearInterval(timerRef.current);
  }, [activeWorkout]);

  const startWorkout = (dayKey) => {
    const plan = WORKOUT_PLAN[dayKey];
    if (!plan || plan.isRest || plan.isClimbing) return;
    const exs = plan.exercises.map(e => ({ ...e, sets: Array(e.sets).fill(null).map((_, i) => ({ id: i, weight: "", reps: "", done: false, prev: history.flatMap(h => h.exercises).find(he => he.name === e.name)?.sets[i] || null })) }));
    setActiveWorkout({ dayKey, name: plan.name, exercises: exs, date: new Date().toISOString().slice(0, 10) });
    setTab("workout");
  };

  const updateSet = (exIdx, setIdx, field, val) => setActiveWorkout(w => ({ ...w, exercises: w.exercises.map((e, ei) => ei !== exIdx ? e : { ...e, sets: e.sets.map((s, si) => si !== setIdx ? s : { ...s, [field]: val }) }) }));
  const toggleSet = (exIdx, setIdx) => setActiveWorkout(w => ({ ...w, exercises: w.exercises.map((e, ei) => ei !== exIdx ? e : { ...e, sets: e.sets.map((s, si) => si !== setIdx ? s : { ...s, done: !s.done }) }) }));
  const addSet = (exIdx) => setActiveWorkout(w => ({ ...w, exercises: w.exercises.map((e, ei) => ei !== exIdx ? e : { ...e, sets: [...e.sets, { id: e.sets.length, weight: "", reps: "", done: false, prev: null }] }) }));
  const addExercise = (name) => { setActiveWorkout(w => ({ ...w, exercises: [...w.exercises, { name, muscle: "Other", sets: [{ id: 0, weight: "", reps: "", done: false, prev: null }] }] })); setShowExPicker(false); };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    const newPrs = { ...prs }; const prNames = [];
    activeWorkout.exercises.forEach(e => e.sets.forEach(s => {
      if (s.done && s.weight !== "" && s.reps !== "") {
        const w = parseFloat(s.weight), r = parseInt(s.reps), cur = newPrs[e.name];
        if (!cur || w > cur.weight || (w === cur.weight && r > cur.reps)) { newPrs[e.name] = { weight: w, reps: r, date: activeWorkout.date }; if (!prNames.includes(e.name)) prNames.push(e.name); }
      }
    }));
    setPrs(newPrs);
    setHistory(h => [{ id: Date.now(), day: activeWorkout.dayKey, name: activeWorkout.name, date: activeWorkout.date, duration: elapsed, exercises: activeWorkout.exercises, prs: prNames }, ...h]);
    setActiveWorkout(null); setTab("history");
  };

  const thisWeek = history.filter(h => { const d = new Date(h.date), now = new Date(), ws = new Date(now); ws.setDate(now.getDate() - now.getDay() + 1); return d >= ws; }).length;
  const streak = (() => { let s = 0; const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date)); let cur = new Date(); cur.setHours(0, 0, 0, 0); for (let i = 0; i < 30; i++) { if (sorted.some(h => h.date === cur.toISOString().slice(0, 10))) { s++; cur.setDate(cur.getDate() - 1); } else break; } return s; })();
  const topPRs = Object.entries(prs).slice(0, 3);
  const volumeByMuscle = (() => { const mv = {}; history.slice(0, 5).forEach(h => h.exercises.forEach(e => { const m = e.muscle || "Other", v = e.sets.reduce((a, s) => a + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0); mv[m] = (mv[m] || 0) + v; })); const max = Math.max(...Object.values(mv), 1); return Object.entries(mv).sort((a, b) => b[1] - a[1]).map(([m, v]) => ({ muscle: m, volume: v, pct: Math.round((v / max) * 100) })); })();
  const exerciseProgress = (() => { const em = {}; [...history].reverse().forEach(h => h.exercises.forEach(e => { if (!em[e.name]) em[e.name] = []; const mw = Math.max(...e.sets.map(s => parseFloat(s.weight) || 0)); if (mw > 0) em[e.name].push({ date: h.date, weight: mw }); })); return em; })();

  const s = {
    app: { background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: FONT_BODY, paddingBottom: 72 },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.surface, borderTop: `1px solid ${COLORS.border}`, display: "flex", zIndex: 100 },
    navBtn: (a) => ({ flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: a ? COLORS.accent : COLORS.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: FONT, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }),
    card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 },
    statCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 12px", textAlign: "center" },
    secTitle: { fontFamily: FONT, fontSize: 18, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: COLORS.text, marginBottom: 10 },
    btn: (c = COLORS.accent) => ({ background: c, color: c === COLORS.green ? COLORS.bg : "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }),
    btnO: { background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 18px", fontFamily: FONT, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" },
    pill: (c) => ({ background: c + "22", color: c, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontFamily: FONT, letterSpacing: 0.5, textTransform: "uppercase" }),
    inp: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "6px 10px", fontSize: 14, fontFamily: FONT_BODY, width: "100%", boxSizing: "border-box" },
    setRow: (done) => ({ display: "grid", gridTemplateColumns: "28px 1fr 80px 80px 36px", gap: 6, alignItems: "center", padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: done ? COLORS.greenDim : COLORS.surface, border: `1px solid ${done ? COLORS.green + "44" : COLORS.border}` }),
    chk: (done) => ({ width: 28, height: 28, borderRadius: 6, border: `2px solid ${done ? COLORS.green : COLORS.border}`, background: done ? COLORS.green : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
  };
  const page = { padding: "16px 16px 0", maxWidth: 600, margin: "0 auto" };

  const MealCard = ({ meal }) => (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{meal.type}</div>
          <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{meal.name}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontFamily: FONT, fontSize: 15, color: COLORS.accentText, fontWeight: 700 }}>{meal.kcal} kcal</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: COLORS.green }}>{meal.protein}g protein</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>{meal.description}</div>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Ingredients</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {meal.ingredients.map((ing, j) => <span key={j} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, color: COLORS.text, fontFamily: FONT }}>{ing}</span>)}
        </div>
      </div>
      {meal.prepNote && <div style={{ marginTop: 8, background: COLORS.accentDim, borderRadius: 6, padding: "6px 10px", fontSize: 12, color: COLORS.accentText }}>{meal.prepNote}</div>}
    </div>
  );

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: COLORS.text, letterSpacing: 1, textTransform: "uppercase" }}>Peak Tracker</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>Climb stronger. Eat bigger. Get there.</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT, fontSize: 13, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Goal</div>
            <div style={{ fontFamily: FONT, fontSize: 15, color: COLORS.accentText, fontWeight: 700 }}>63 → 75kg</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>3 months</div>
          </div>
        </div>
        {activeWorkout && (
          <div onClick={() => setTab("workout")} style={{ marginTop: 10, background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ fontFamily: FONT, fontSize: 14, color: COLORS.accentText, textTransform: "uppercase", letterSpacing: 0.5 }}>● Live: {activeWorkout.name}</span>
            <span style={{ fontFamily: FONT, fontSize: 16, color: COLORS.accent, fontWeight: 700 }}>{formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={page}>
          <div style={{ marginTop: 16, marginBottom: 18 }}>
            <div style={s.secTitle}>This Week</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
              <div style={s.statCard}><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>{streak}</div><div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Streak</div></div>
              <div style={s.statCard}><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>{thisWeek}</div><div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>This Week</div></div>
              <div style={s.statCard}><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>{history.length}</div><div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Total</div></div>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={s.secTitle}>Quick Launch</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DAYS_ORDER.map(d => { const plan = WORKOUT_PLAN[d]; return (
                <div key={d} style={{ ...s.card, padding: "12px 14px", marginBottom: 0, cursor: plan.isClimbing ? "default" : "pointer" }} onClick={() => !plan.isClimbing && startWorkout(d)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT, fontSize: 13, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{d}</span>
                    {plan.isClimbing && <span style={s.pill(COLORS.amber)}>Climb</span>}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: COLORS.text, textTransform: "uppercase", letterSpacing: 0.5 }}>{plan.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{plan.muscles.join(" · ")}</div>
                  {!plan.isClimbing && <div style={{ marginTop: 10, background: COLORS.accentDim, borderRadius: 6, padding: "6px 10px", textAlign: "center", fontFamily: FONT, fontSize: 13, color: COLORS.accentText, textTransform: "uppercase", letterSpacing: 0.5 }}>Start →</div>}
                </div>
              ); })}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={s.secTitle}>Top Personal Records</div>
            {topPRs.map(([name, pr]) => (
              <div key={name} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{name}</div><div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{formatDate(pr.date)}</div></div>
                <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: COLORS.amber }}>{pr.weight > 0 ? `${pr.weight}kg` : "BW"} × {pr.reps}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKOUT */}
      {tab === "workout" && (
        <div style={page}>
          {!activeWorkout ? (
            <div style={{ paddingTop: 40, textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontSize: 24, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>No Active Workout</div>
              <button style={s.btn()} onClick={() => setTab("dashboard")}>Go to Dashboard</button>
            </div>
          ) : (
            <div style={{ paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div><div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{activeWorkout.name}</div><div style={{ fontSize: 13, color: COLORS.muted }}>{formatDate(activeWorkout.date)}</div></div>
                <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{formatTime(elapsed)}</div>
              </div>
              <div style={{ ...s.card, borderLeft: `3px solid ${COLORS.green}`, marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Warmup</div>
                {WARMUP.map((w, i) => <div key={i} style={{ fontSize: 13, color: COLORS.muted, padding: "3px 0", borderBottom: i < WARMUP.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>{w}</div>)}
              </div>
              {activeWorkout.exercises.map((ex, exIdx) => (
                <div key={exIdx} style={{ ...s.card, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div><div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{ex.name}</div><span style={s.pill(COLORS.accentText)}>{ex.muscle}</span></div>
                    {prs[ex.name] && <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase" }}>PR</div><div style={{ fontFamily: FONT, fontSize: 15, color: COLORS.amber, fontWeight: 700 }}>{prs[ex.name].weight > 0 ? `${prs[ex.name].weight}kg` : "BW"} × {prs[ex.name].reps}</div></div>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 80px 80px 36px", gap: 6, padding: "0 10px 6px" }}>
                    {["#", "Prev", "kg", "Reps", ""].map((h, i) => <div key={i} style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase" }}>{h}</div>)}
                  </div>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} style={s.setRow(set.done)}>
                      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: set.done ? COLORS.green : COLORS.muted, textAlign: "center" }}>{setIdx + 1}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{set.prev ? `${set.prev.weight > 0 ? set.prev.weight + "kg" : "BW"} × ${set.prev.reps}` : "—"}</div>
                      <input type="number" placeholder="0" value={set.weight} onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)} style={{ ...s.inp, textAlign: "center" }} />
                      <input type="number" placeholder="0" value={set.reps} onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)} style={{ ...s.inp, textAlign: "center" }} />
                      <div style={s.chk(set.done)} onClick={() => toggleSet(exIdx, setIdx)}>{set.done && <svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 6,11 12,3" fill="none" stroke={COLORS.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}</div>
                    </div>
                  ))}
                  <button onClick={() => addSet(exIdx)} style={{ ...s.btnO, fontSize: 12, padding: "6px 14px", marginTop: 6 }}>+ Add Set</button>
                </div>
              ))}
              <button onClick={() => setShowExPicker(v => !v)} style={{ ...s.btnO, width: "100%", marginBottom: 12, padding: "12px" }}>+ Add Exercise</button>
              {showExPicker && (
                <div style={{ ...s.card, marginBottom: 16, border: `1px solid ${COLORS.accent}44` }}>
                  <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Pick Exercise</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {ALL_EXERCISES.map(ex => <button key={ex} onClick={() => addExercise(ex)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", color: COLORS.text, fontSize: 12, fontFamily: FONT, cursor: "pointer", textTransform: "uppercase" }}>{ex}</button>)}
                  </div>
                  <button onClick={() => setShowExPicker(false)} style={{ ...s.btnO, marginTop: 10, fontSize: 12, padding: "6px 14px" }}>Cancel</button>
                </div>
              )}
              <div style={{ ...s.card, borderLeft: `3px solid ${COLORS.accent}`, marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.accentText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Cooldown</div>
                {COOLDOWN.map((c, i) => <div key={i} style={{ fontSize: 13, color: COLORS.muted, padding: "3px 0", borderBottom: i < COOLDOWN.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>{c}</div>)}
              </div>
              <div style={{ display: "flex", gap: 10, paddingBottom: 16 }}>
                <button onClick={finishWorkout} style={{ ...s.btn(COLORS.green), flex: 2 }}>Finish Workout</button>
                <button onClick={() => { setActiveWorkout(null); setTab("dashboard"); }} style={{ ...s.btnO, flex: 1 }}>Discard</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MEALS */}
      {tab === "meals" && (
        <div style={page}>
          <div style={{ paddingTop: 16 }}>
            <div style={{ ...s.card, borderLeft: `3px solid ${COLORS.accent}`, marginBottom: 16 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, color: COLORS.accentText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Daily Targets</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>3100</div><div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>kcal / day</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: COLORS.green, lineHeight: 1 }}>155g</div><div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>protein / day</div></div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}>Based on 63kg bodyweight + 5 training days. 500 kcal surplus for muscle gain. 2.5g protein per kg.</div>
            </div>

            <div style={{ ...s.card, borderLeft: `3px solid ${COLORS.green}`, marginBottom: 16, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: COLORS.green, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Weekday Breakfast — Every Mon to Fri</div>
              <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Egg & Cheese Wraps</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>4 scrambled eggs · 2 flour tortillas · 50g cheese · butter — 680 kcal · 38g protein</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {MEAL_DAYS.map(d => (
                <button key={d} onClick={() => setMealDay(d)} style={{ flexShrink: 0, background: mealDay === d ? COLORS.accent : COLORS.card, color: mealDay === d ? "#fff" : COLORS.muted, border: `1px solid ${mealDay === d ? COLORS.accent : COLORS.border}`, borderRadius: 8, padding: "8px 16px", fontFamily: FONT, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer" }}>
                  {d}
                  {["Sat", "Sun"].includes(d) && <span style={{ display: "block", fontSize: 9, color: mealDay === d ? "#ffffffaa" : COLORS.muted, letterSpacing: 0.3 }}>special</span>}
                </button>
              ))}
            </div>

            {MEAL_PLAN[mealDay] && (() => {
              const day = MEAL_PLAN[mealDay];
              const totalKcal = day.meals.reduce((a, m) => a + m.kcal, 0);
              const totalProtein = day.meals.reduce((a, m) => a + m.protein, 0);
              return (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{mealDay}</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontFamily: FONT, fontSize: 14, color: COLORS.accentText }}>{totalKcal} kcal</span>
                      <span style={{ fontFamily: FONT, fontSize: 14, color: COLORS.green }}>{totalProtein}g protein</span>
                    </div>
                  </div>
                  {day.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
                  {day.prepTip && (
                    <div style={{ ...s.card, borderLeft: `3px solid ${COLORS.amber}`, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: COLORS.amber, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Meal Prep Tip</div>
                      <div style={{ fontSize: 13, color: COLORS.muted }}>{day.prepTip}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Grocery List</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, color: COLORS.muted }}>{checkedCount}/{totalItems}</span>
                  {checkedCount > 0 && (
                    <button onClick={() => setCheckedItems({})} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "3px 10px", fontFamily: FONT, fontSize: 11, color: COLORS.muted, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>Reset</button>
                  )}
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: COLORS.dimmed, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%`, background: COLORS.green, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
              {GROCERY_LIST.map((section, si) => {
                const sectionChecked = section.items.filter((_, ii) => checkedItems[`${si}-${ii}`]).length;
                return (
                  <div key={si} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: section.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: COLORS.text }}>{section.section}</span>
                      <span style={{ fontFamily: FONT, fontSize: 11, color: COLORS.muted, marginLeft: "auto" }}>{sectionChecked}/{section.items.length}</span>
                    </div>
                    {section.items.map((item, ii) => {
                      const checked = !!checkedItems[`${si}-${ii}`];
                      return (
                        <div key={ii} onClick={() => toggleGrocery(si, ii)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, marginBottom: 3, background: checked ? COLORS.greenDim : COLORS.surface, border: `1px solid ${checked ? COLORS.green + "33" : COLORS.border}`, cursor: "pointer", transition: "background 0.15s" }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${checked ? COLORS.green : COLORS.muted + "66"}`, background: checked ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {checked && <svg width="11" height="11" viewBox="0 0 11 11"><polyline points="1.5,5.5 4.5,8.5 9.5,2.5" fill="none" stroke={COLORS.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: checked ? COLORS.muted : COLORS.text, textDecoration: checked ? "line-through" : "none", flex: 1 }}>{item.name}</span>
                          <span style={{ fontFamily: FONT, fontSize: 12, color: checked ? COLORS.muted : section.color, flexShrink: 0, letterSpacing: 0.3 }}>{item.qty}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Est. weekly cost</span>
                <span style={{ fontFamily: FONT, fontSize: 17, color: COLORS.amber, fontWeight: 700 }}>~700–750 kr</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div style={page}>
          <div style={{ paddingTop: 16 }}>
            <div style={s.secTitle}>Workout History</div>
            {history.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.muted, fontFamily: FONT, fontSize: 18, textTransform: "uppercase" }}>No workouts yet</div>}
            {history.map(h => {
              const totalSets = h.exercises.reduce((a, e) => a + e.sets.length, 0);
              return (
                <div key={h.id} style={s.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h.name}</div>
                        {h.prs?.length > 0 && <span style={{ background: COLORS.amberDim, color: COLORS.amber, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontFamily: FONT }}>🏆 {h.prs.length} PR{h.prs.length > 1 ? "s" : ""}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{dayLabel(h.date)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FONT, fontSize: 18, color: COLORS.accentText, fontWeight: 700 }}>{formatTime(h.duration)}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{totalSets} sets</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                    {h.exercises.map((e, i) => <span key={i} style={{ background: COLORS.surface, border: `1px solid ${h.prs?.includes(e.name) ? COLORS.amber + "66" : COLORS.border}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, color: h.prs?.includes(e.name) ? COLORS.amber : COLORS.muted, fontFamily: FONT }}>{h.prs?.includes(e.name) ? "🏆 " : ""}{e.name}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <div style={page}>
          <div style={{ paddingTop: 16 }}>
            <div style={s.secTitle}>Volume by Muscle Group</div>
            <div style={s.card}>
              {volumeByMuscle.length === 0 && <div style={{ color: COLORS.muted, fontSize: 14 }}>No data yet. Complete some workouts!</div>}
              {volumeByMuscle.map(({ muscle, volume, pct }) => (
                <div key={muscle} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5 }}>{muscle}</span>
                    <span style={{ fontFamily: FONT, fontSize: 14, color: COLORS.accentText }}>{Math.round(volume).toLocaleString()} kg·rep</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: COLORS.dimmed, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: COLORS.accent, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={s.secTitle}>Exercise Trends</div>
            {Object.entries(exerciseProgress).map(([name, data]) => {
              if (!data.length) return null;
              const pr = prs[name], maxW = Math.max(...data.map(d => d.weight)), minW = Math.min(...data.map(d => d.weight)), range = maxW - minW || 1, W = 220, H = 50;
              const pts = data.map((d, i) => { const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * W, y = H - ((d.weight - minW) / range) * (H - 8) - 4; return `${x},${y}`; }).join(" ");
              return (
                <div key={name} style={{ ...s.card, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{name}</div>
                    {pr && <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase" }}>PR</div><div style={{ fontFamily: FONT, fontSize: 18, color: COLORS.amber, fontWeight: 700 }}>{pr.weight > 0 ? `${pr.weight}kg` : "BW"} × {pr.reps}</div></div>}
                  </div>
                  {data.length >= 2 ? (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
                      <polyline points={pts} fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      {data.map((d, i) => { const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * W, y = H - ((d.weight - minW) / range) * (H - 8) - 4; return <circle key={i} cx={x} cy={y} r="3" fill={COLORS.accent} />; })}
                    </svg>
                  ) : <div style={{ fontSize: 12, color: COLORS.muted }}>1 session logged — trend visible after 2+</div>}
                  {data.length >= 2 && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ fontSize: 10, color: COLORS.muted }}>{formatDate(data[0].date)}</span><span style={{ fontSize: 10, color: COLORS.muted }}>{formatDate(data[data.length - 1].date)}</span></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <nav style={s.nav}>
        {[
          { id: "dashboard", label: "Home", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.9"/><rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.9"/><rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.9"/><rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.5"/></svg> },
          { id: "workout", label: "Workout", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="8" width="4" height="4" rx="1.5" fill="currentColor"/><rect x="15" y="8" width="4" height="4" rx="1.5" fill="currentColor"/><rect x="5" y="6" width="2.5" height="8" rx="1" fill="currentColor"/><rect x="12.5" y="6" width="2.5" height="8" rx="1" fill="currentColor"/><rect x="7.5" y="9" width="5" height="2" rx="1" fill="currentColor"/></svg> },
          { id: "meals", label: "Meals", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3v14M4 10h5M9 3v14M14 3c0 0 3 2 3 5s-3 5-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { id: "history", label: "History", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
          { id: "progress", label: "Progress", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polyline points="2,15 7,9 11,12 17,5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="17" cy="5" r="2" fill="currentColor"/></svg> },
        ].map(({ id, label, icon }) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>{icon}{label}</button>
        ))}
      </nav>
    </div>
  );
}
