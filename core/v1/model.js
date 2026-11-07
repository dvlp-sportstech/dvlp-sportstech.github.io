/* The one rules source (app-onboarding R2, R11–R17): pure functions, no DOM. Uses ANSWERS and PLANS (core/plans.json).
   The web loads it from go.dvlp.app/core/v{N}/, Code.gs inlines it, the app copies core/ (R3). A skill map is {BH, FW, FN, SH}: levels 1–3 or scores 4–12. */
var SKILL_KEYS = ['BH', 'FW', 'FN', 'SH'];
var SKILL_NAMES = { BH: 'Handles', FW: 'Footwork', FN: 'Finishing', SH: 'Shooting' };
var TIER_NAMES = ['ROOKIE', 'STARTER', 'PRO'];
/* the five rounds of 4 answers, Q1–Q20 in this order (questions.js QUIZ_ROUNDS); IQ is scored but no rule reads it (R11) */
var ROUND_KEYS = SKILL_KEYS.concat('IQ');

/* ===== scores (R11–R12): answers are 20 values of 1–3 ===== */
function scoresOf(answers) { const o = {}; ROUND_KEYS.forEach((k, i) => { o[k] = answers.slice(i * 4, i * 4 + 4).reduce((x, y) => x + y, 0); }); return o; }
function resultsOf(sc) { return SKILL_KEYS.reduce((x, k) => x + sc[k], 0); }
function bandOf(score) { return score <= 6 ? 1 : score <= 9 ? 2 : 3; }
function bandsOf(sc) { const o = {}; SKILL_KEYS.forEach(k => { o[k] = bandOf(sc[k]); }); return o; }
/* an athlete from answers: scores decide ties and the note, their bands decide plans and tier. An old-format row is {lv} alone (R16). */
function athleteOf(answers) { const sc = scoresOf(answers); return { sc, lv: bandsOf(sc) }; }

/* the quiz holds 0 for a skill not rated yet; it counts as level 1 */
function levels(lv) { const o = {}; SKILL_KEYS.forEach(k => { o[k] = lv[k] || 1; }); return o; }
function tierOf(lv) { const v = Object.values(levels(lv)); return Math.max(0, Math.min(2, Math.round(v.reduce((a, b) => a + b, 0) / 4) - 1)); }
function allEqual(sk) { const v = Object.values(levels(sk)); return v.every(x => x === v[0]); }
function archetypeOf(sk) {
  const L = levels(sk), mx = Math.max(...Object.values(L));
  return allEqual(sk) ? 'All-Around' : ({ BH: 'Playmaker', FW: 'Lockdown', FN: 'Slasher', SH: 'Sharpshooter' })[SKILL_KEYS.find(k => L[k] === mx)];
}
/* Best = first highest in skill order, Weakest = last lowest (design R9's tie rule) */
function bestWeakest(sk) { const L = levels(sk), v = SKILL_KEYS.map(k => L[k]); return [SKILL_KEYS[v.indexOf(Math.max(...v))], SKILL_KEYS[v.lastIndexOf(Math.min(...v))]]; }
/* the old card's 50/65/80 ratings from levels; the web card reads them until it moves to scores (roadmap p5) */
function ratingsOf(lv) {
  const B = [50, 65, 80], L = levels(lv), r = { HANDLES: B[L.BH - 1], FOOTWORK: B[L.FW - 1], FINISHING: B[L.FN - 1], SHOOTING: B[L.SH - 1] };
  return { r, o: Math.round(Object.values(r).reduce((a, b) => a + b, 0) / 4) };
}
/* the card back's coach's note (design D17); IQ is never named */
function noteLine(sk) { const [b, w] = bestWeakest(sk); return allEqual(sk) ? `Every skill is even. ${SKILL_NAMES[w]} gets extra work.` : `${SKILL_NAMES[b]} is the strength. ${SKILL_NAMES[w]} gets extra work.`; }

/* ===== plans (R13–R15). a = {lv, sc?}, or null for the no-details page ===== */
/* a skill and level's plans in order: _1, _2, _3 … */
function plansAt(k, level) { return PLANS.plans.filter(p => p.skill === k && p.level === level).sort((x, y) => x.id.localeCompare(y.id, 'en', { numeric: true })); }
function weakestOf(a) { return bestWeakest(a.sc || a.lv)[1]; }
/* the FOCUS plan: the weakest skill at its level. quest = plans finished, so after Day 5 it is _2, _3 … looping to _1 (D31d) */
function chosenPlan(a, quest = 0) {
  if (!Number.isInteger(quest) || quest < 0) throw new RangeError('quest must be a whole number of finished plans, got ' + quest);
  if (!a) return null;
  const w = weakestOf(a), p = plansAt(w, levels(a.lv)[w]);
  return p[quest % p.length];
}
/* a drill ID's exercise (core/plans.json keeps every drill ID as an alias), indexed on first use */
let exerciseIndex = null;
function exerciseOf(id) {
  if (!exerciseIndex) { exerciseIndex = {}; PLANS.exercises.forEach(x => x.aliases.forEach(d => { exerciseIndex[d] = x; })); }
  return exerciseIndex[id];
}
/* One day's drills (R15): HANDLES → FOOTWORK → FINISHING → SHOOTING. The FOCUS block is all of day d from the chosen plan;
   each other skill gets the first drill of day d of P{skill}{its level}_1. Reps are the exercise's for that block's level.
   No details: that first drill of each P{skill}1_1, all ROOKIE, no FOCUS. */
function dayDrills(a, d, quest = 0) {
  const L = a ? levels(a.lv) : { BH: 1, FW: 1, FN: 1, SH: 1 }, focus = chosenPlan(a, quest);
  const mk = (id, k, f) => { const x = exerciseOf(id); return { k, id, ex: x.id, n: x.name, r: x.reps[L[k]], equip: x.equipment, court: x.court, lvl: L[k] - 1, focus: f }; };
  return SKILL_KEYS.flatMap(k => focus && focus.skill === k ? focus.days[d - 1].map(id => mk(id, k, true)) : [mk(plansAt(k, L[k])[0].days[d - 1][0], k, false)]);
}

/* Saved progress (R24a): marks {plan, day, drill, state: 'd'|'s', at}; plan is the quest's plan id, drill a drill ID. The quest is
   the first plan in rotation order with a day left. gameSummary is GAME FOUND's slot (D28a); its drills count those done. */
function dayMarked(marks, planId, d, list) { return list.every(x => marks.some(m => m.plan === planId && m.day === d && m.drill === x.id)); }
function questDone(a, marks, q) { const id = chosenPlan(a, q).id; return [1, 2, 3, 4, 5].every(d => dayMarked(marks, id, d, dayDrills(a, d, q))); }
function questOf(a, marks) { const w = weakestOf(a), n = plansAt(w, levels(a.lv)[w]).length; let q = 0; while (q < n && questDone(a, marks, q)) q++; return q; }
function gameSummary(a, marks) {
  const w = weakestOf(a), q = questOf(a, marks), id = chosenPlan(a, q).id;
  const day = [1, 2, 3, 4, 5].find(d => !dayMarked(marks, id, d, dayDrills(a, d, q))) || 5;
  return { skill: SKILL_NAMES[w].toUpperCase(), tier: TIER_NAMES[levels(a.lv)[w] - 1], day, drills: marks.filter(m => m.state === 'd').length };
}

/* a whole number lo–hi, sent as a number or a numeric string; null otherwise */
function intIn(x, lo, hi) { if (typeof x !== 'number' && typeof x !== 'string') return null; const n = Number(x); return x !== '' && Number.isInteger(n) && n >= lo && n <= hi ? n : null; }
/* what both row formats share: name, player (v), goal, height and age (as indexes); null when any is unreadable */
function profileOf(row) {
  if (!row || typeof row !== 'object') return null;
  const name = row.name == null ? '' : String(row.name);
  if (name.length > ANSWERS.NAME_MAX) return null;
  const v = castOf(row.player) === null ? null : Number(row.player);
  const goal = ANSWERS.GOALS.indexOf(row.goal), h = ANSWERS.HEIGHTS.indexOf(intIn(row.height, 0, 999)), age = ANSWERS.AGES.indexOf(intIn(row.age, 0, 999));
  return v === null || goal < 0 || h < 0 || age < 0 ? null : { name, v, goal, h, age };
}
/* The "unreadable" test for a looked-up row (I R16), one per format: the athlete, or null for the no-details page.
   An old-format row: the four self-ratings as levels and Guard / Wing / Big. */
function validate(row) {
  const p = profileOf(row);
  if (!p || ANSWERS.POSITIONS.indexOf(row.position) < 0) return null;
  const lv = {};
  for (const k of SKILL_KEYS) { lv[k] = intIn(row[k], 1, 3); if (lv[k] === null) return null; }
  return { ...p, lv, pos: row.position };
}
/* a quiz2 row (R18): PG / WING / FWD / C and Q1–Q20 of 1–3; scores and levels come from the answers, never the row */
function validateQuiz2(row) {
  const p = profileOf(row);
  if (!p || ANSWERS.QUIZ_POSITIONS.indexOf(row.position) < 0) return null;
  const answers = ANSWERS.Q_KEYS.map(q => intIn(row[q], 1, 3));
  return answers.some(x => x === null) ? null : { ...p, pos: row.position, answers, ...athleteOf(answers) };
}
/* Progress on the phone (plan-videos I R8–R9): {v:1, days:{"<day>":{"<i>":["<drill name>","d"|"s"]}}}, one key per plan id.
   A mark counts only while the drill at that place keeps its name, so a content change reads as not started. */
function progressKey(id) { return 'dvlp-plan-' + id; }
function drillState(saved, day, i, name) {
  const m = saved && saved.v === 1 && saved.days && typeof saved.days === 'object' && saved.days[day] && saved.days[day][i];
  return Array.isArray(m) && m[0] === name && (m[1] === 'd' || m[1] === 's') ? m[1] : '';
}
/* the first day 1–5 with a drill neither done nor skipped; 5 when all are. plan = dayDrills for days 1…5 */
function firstOpenDay(saved, plan) {
  for (let d = 1; d <= 5; d++) if (!plan[d - 1].every((x, i) => drillState(saved, d, i, x.n))) return d;
  return 5;
}
function validId(p) { return typeof p === 'string' && ANSWERS.ID_RE.test(p); }
