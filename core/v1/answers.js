/* The one list of allowed quiz answers (training-plans I R6a). The build includes it in the quiz, the plan page and
   apps-script/Code.gs, so browser and server check against the same values. A11: height in inches, age instead of grade. */
var ANSWERS = {
  PLAYERS: [8, 9, 10, 11, 12, 13],
  OLD_PLAYERS: [1, 1, 2, 2, 4, 4, 5, 5], /* old 0–7 are still stored, so each draws its nearest cast member (research/1014-2) */
  GOALS: ['Make the team', 'Earn more minutes', 'Play in college', 'Go pro'],
  /* every inch from 4'0" to 7'2"; the ends stand for shorter and taller (quiz-landing §15.7) */
  HEIGHTS: Array.from({ length: 39 }, (_, i) => 48 + i),
  /* 8 stands for 8 or younger, 18 for 18 or older (§15.8) */
  AGES: Array.from({ length: 11 }, (_, i) => 8 + i),
  GENDERS: ['Female', 'Male', 'Skip'],
  POSITIONS: ['Guard', 'Wing', 'Big'],
  /* the 20-question quiz (quiz2 rows, app-onboarding R18): its four positions and the Q1–Q20 answer columns */
  QUIZ_POSITIONS: ['PG', 'WING', 'FWD', 'C'],
  Q_KEYS: Array.from({ length: 20 }, (_, i) => 'Q' + (i + 1)),
  WORK_HARD: ['all', 'sometimes', 'notyet'],
  EMAIL_FOR: ['player', 'parent'],
  ID_RE: /^[0-9A-HJKMNP-TV-Z]{16}$/,
  NAME_MAX: 12
};
function castOf(v) {
  var n = (typeof v === 'number' || typeof v === 'string') && v !== '' ? Number(v) : NaN, i = ANSWERS.PLAYERS.indexOf(n);
  if (i >= 0) return i;
  return Math.floor(n) === n && n >= 0 && n < ANSWERS.OLD_PLAYERS.length ? ANSWERS.OLD_PLAYERS[n] : null;
}
function heightLabel(n) { return Math.floor(n / 12) + "'" + (n % 12) + '"' + (n === 48 ? ' or under' : n === 86 ? ' or taller' : ''); }
function ageLabel(n) { return n === 8 ? '8 or younger' : n === 18 ? '18 or older' : String(n); }

/* ===== the shootout (A6, 30 s): the game's constants, the initials block list and the score caps, one copy for the game
   and apps-script/Code.gs (1010-10). The caps assume the 520 ms lock counts game time, the same clock as the 30 s. */
var SHOOT = {
  GAME_SEC: 30,
  RUSH_SEC: 10,
  SPOTS: [{ x: 9, y: 64, v: 3, n: 'CORNER' }, { x: 33, y: 40, v: 2, n: 'ELBOW' }, { x: 50, y: 4, v: 3, n: 'TOP' }, { x: 67, y: 40, v: 2, n: 'ELBOW' }, { x: 91, y: 64, v: 3, n: 'CORNER' }],
  /* the green zone's half-width per spot value; a swish is the middle 30% of it */
  ZONE: { 3: 0.085, 2: 0.12 },
  SWISH: 1,
  LOCK_MS: 520,
  SPEED_START: 1.05,
  SPEED_STEP: 0.07,
  /* meter widths per second */
  SPEED_MAX: 2.3,
  /* the 5th make in a row turns ON FIRE on; it doubles from the 6th */
  FIRE_AT: 5,
  INITIALS_RE: /^[A-Z]{3}$/,
  /* A6's 14, then more: spellings, slurs, sexual words, self-harm (KYS, KMS) */
  BLOCK: ['ASS', 'FUK', 'FUC', 'SEX', 'KKK', 'NIG', 'FAG', 'DIK', 'CUM', 'TIT', 'WTF', 'GAY', 'JEW', 'NAZ',
    'FUQ', 'FCK', 'FKU', 'FUX', 'FKN', 'NGR', 'NGA', 'FGT', 'FAP', 'DIC', 'DIX', 'DCK', 'CNT', 'KNT', 'CUN', 'KUM', 'JIZ', 'JZZ',
    'TWT', 'SLT', 'WHR', 'HOE', 'BCH', 'SHT', 'PIS', 'PSS', 'AZZ', 'ARS', 'VAG', 'PNS', 'COK', 'COC', 'KOK', 'SUK', 'XXX',
    'RPE', 'KYS', 'KMS', 'NZI', 'HTL', 'SPK', 'WOP', 'GOK', 'CHK']
};
/* Shots: the first tap shoots at 0 s, then one every LOCK_MS (a miss can go the moment the lock ends) while the clock is
   under 30 s: floor((30000 - 1) / 520) + 1 = 58. */
SHOOT.MAX_SHOTS = Math.floor((SHOOT.GAME_SEC * 1000 - 1) / SHOOT.LOCK_MS) + 1;
/* Makes: after the lock the needle restarts at an edge and must reach the wider (2-point) zone at the fastest sweep:
   floor((0.5 - 0.12) / 2.3 s) = 165 ms, so a make takes ≥ 520 + 165 = 685 ms. In 30 s: floor(29999 / 685) + 1 = 44;
   in MONEYBALL's last 10 s (both ends counted): floor(10000 / 685) + 1 = 15. */
SHOOT.MAKE_MS = SHOOT.LOCK_MS + Math.floor((0.5 - SHOOT.ZONE[2]) / SHOOT.SPEED_MAX * 1000);
SHOOT.MAX_MAKES = Math.floor((SHOOT.GAME_SEC * 1000 - 1) / SHOOT.MAKE_MS) + 1;
SHOOT.RUSH_MAKES = Math.floor(SHOOT.RUSH_SEC * 1000 / SHOOT.MAKE_MS) + 1;
/* Points: a make is at most 3 + swish 1 = 4, times ON FIRE ×2 (makes 6+ of one streak: made − 5) times MONEYBALL ×2
   (≤ RUSH_MAKES, best on the fire makes). 44 makes: 4 × (5 + 2·39 + 2·15) = 452. */
function shootMaxScore(made) {
  var fire = Math.max(made - SHOOT.FIRE_AT, 0), plain = made - fire, rush = Math.min(made, SHOOT.RUSH_MAKES);
  var rushFire = Math.min(rush, fire), rushPlain = Math.min(rush - rushFire, plain);
  return (3 + SHOOT.SWISH) * (plain + 2 * fire + 2 * rushFire + rushPlain);
}
