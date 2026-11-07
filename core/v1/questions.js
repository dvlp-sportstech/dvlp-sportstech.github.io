/* The 20-question assessment (app-onboarding R7), the Typeform's text verbatim from research/1015-2-typeform-quiz.md.
   "(ex: …)" parts are in hint. FORWARD's set is identical to WING's (diffed), so FWD reads WING's through questionsFor().
   label is the answer's short name (quiz-feel R18), quoted only by the scan captions and the FOCUS line; IQ is never quoted. */
var QUESTIONS = {
  PG: {
    HANDLES: [
      { text: "How comfortable are you dribbling with your weak hand?", hint: "", label: "Weak hand" },
      { text: "Can you execute advanced dribble moves under pressure?", hint: "", label: "Moves under pressure" },
      { text: "Are you effective in breaking down defenders one-on-one?", hint: "", label: "1-on-1" },
      { text: "Do you limit turnovers while handling the ball?", hint: "", label: "Turnovers" }
    ],
    FOOTWORK: [
      { text: "Can you create separation using jab steps and fakes?", hint: "", label: "Jab steps" },
      { text: "Are you able to explode past defenders with your first step?", hint: "", label: "First step" },
      { text: "Do you maintain balance when changing direction quickly?", hint: "", label: "Balance" },
      { text: "Are you able to score in the post?", hint: "", label: "Post scoring" }
    ],
    FINISHING: [
      { text: "How well can you finish through contact?", hint: "", label: "Through contact" },
      { text: "Are you proficient in using both hands around the rim?", hint: "", label: "Both hands" },
      { text: "Can you consistently make floaters?", hint: "", label: "Floaters" },
      { text: "Do you have a variety of finishing moves in your arsenal?", hint: "", label: "Finishing moves" }
    ],
    SHOOTING: [
      { text: "Are you consistent from mid-range?", hint: "", label: "Mid-range" },
      { text: "Are you consistent from 3 point range?", hint: "", label: "3s" },
      { text: "Can you make 3s and pull ups consistently off the dribble?", hint: "", label: "Pull-ups" },
      { text: "Can you consistently create your own shot?", hint: "", label: "Own shot" }
    ],
    IQ: [
      { text: "Do you watch game film of yourself?", hint: "", label: "" },
      { text: "Do you consistently make good decisions with the ball?", hint: "", label: "" },
      { text: "Do you know how to offensively impact the game without the ball?", hint: "ex: when to screen, cut & space", label: "" },
      { text: "Are you able to direct your teammates in live situations on executing plays or exposing offensive advantages?", hint: "ex: Telling a teammate where to go for plays or if you see a mismatch, do you recognize it and organize team to attack it", label: "" }
    ]
  },
  WING: {
    HANDLES: [
      { text: "How comfortable are you dribbling with your weak hand?", hint: "", label: "Weak hand" },
      { text: "Can you execute advanced dribble moves under pressure?", hint: "", label: "Moves under pressure" },
      { text: "Are you effective in breaking down defenders one-on-one?", hint: "", label: "1-on-1" },
      { text: "Do you limit turnovers while handling the ball?", hint: "", label: "Turnovers" }
    ],
    FOOTWORK: [
      { text: "Can you create separation using jab steps and fakes?", hint: "", label: "Jab steps" },
      { text: "Do you maintain balance when changing direction quickly?", hint: "", label: "Balance" },
      { text: "Are you able to explode past defenders with your first step?", hint: "", label: "First step" },
      { text: "Are you able to score in the post using pivots?", hint: "", label: "Post pivots" }
    ],
    FINISHING: [
      { text: "How well can you finish through contact?", hint: "", label: "Through contact" },
      { text: "Are you proficient in using both hands around the rim?", hint: "", label: "Both hands" },
      { text: "Do you consistently score in the paint?", hint: "", label: "Paint scoring" },
      { text: "Do you have a variety of finishing moves in your arsenal?", hint: "", label: "Finishing moves" }
    ],
    SHOOTING: [
      { text: "Are you consistent from mid-range?", hint: "", label: "Mid-range" },
      { text: "Are you consistent from 3 point range?", hint: "", label: "3s" },
      { text: "Can you make 3s and pull ups consistently off the dribble and/or ball screens?", hint: "", label: "Pull-ups" },
      { text: "Can you consistently create your own shot?", hint: "", label: "Own shot" }
    ],
    IQ: [
      { text: "Do you watch game film of yourself?", hint: "", label: "" },
      { text: "Do you consistently make good decisions with the ball?", hint: "", label: "" },
      { text: "Do you know how to offensively impact the game without the ball?", hint: "ex: when to screen, cut & space", label: "" },
      { text: "Can you guide your teammates during the game to run plays or take advantage of mismatches?", hint: "", label: "" }
    ]
  },
  C: {
    HANDLES: [
      { text: "How comfortable are you dribbling vs contact?", hint: "", label: "Dribbling vs contact" },
      { text: "Can you handle the ball out of P/R?", hint: "", label: "Pick-and-roll handle" },
      { text: "Are you effective in breaking down defenders one-on-one?", hint: "", label: "1-on-1" },
      { text: "Do you limit turnovers while handling the ball?", hint: "", label: "Turnovers" }
    ],
    FOOTWORK: [
      { text: "Can you create separation using jab steps and fakes?", hint: "", label: "Jab steps" },
      { text: "How strong is your pivot game in the post?", hint: "", label: "Post pivots" },
      { text: "Do you consistently maintain balance when taking contact?", hint: "", label: "Balance in contact" },
      { text: "Do you have good screen footwork in on/off ball screens?", hint: "", label: "Screen footwork" }
    ],
    FINISHING: [
      { text: "Are you proficient in using both hands around the rim?", hint: "", label: "Both hands" },
      { text: "How well can you finish through contact?", hint: "", label: "Through contact" },
      { text: "Do you have good touch in the paint/around rim?", hint: "", label: "Touch at the rim" },
      { text: "Do you have a variety of finishing moves in your arsenal?", hint: "", label: "Finishing moves" }
    ],
    SHOOTING: [
      { text: "Are you a consistent shooter from 15-17ft?", hint: "", label: "15–17 ft" },
      { text: "Are you consistent shooting from mid-post?", hint: "", label: "Mid-post" },
      { text: "Can you shoot out of a pick and roll?", hint: "", label: "Pick-and-roll shot" },
      { text: "Can you consistently make 3s?", hint: "", label: "3s" }
    ],
    IQ: [
      { text: "Do you watch game film of yourself?", hint: "", label: "" },
      { text: "Do you consistently make good decisions with the ball?", hint: "", label: "" },
      { text: "Do you know how to offensively impact the game without the ball?", hint: "ex: when to screen, cut & space", label: "" },
      { text: "Can you guide your teammates during the game to run plays or take advantage of mismatches?", hint: "", label: "" }
    ]
  }
};
var QUIZ_ROUNDS = ['HANDLES', 'FOOTWORK', 'FINISHING', 'SHOOTING', 'IQ'];
/* the 20 questions for a position, in round order (Q1–Q20) */
function questionsFor(pos) { var set = QUESTIONS[pos === 'FWD' ? 'WING' : pos]; return QUIZ_ROUNDS.flatMap(function (k) { return set[k]; }); }
var ANSWER_LEVELS = ['NEEDS WORK', 'INTERMEDIATE', 'ADVANCED'];
/* the FOCUS line under the weakest block (quiz-feel R20): the lowest-rated question in the weakest round, ties to the first, as
   "Because you said: {label} — {LEVEL}."; when every counted answer is ADVANCED, the round itself. a = a quiz2 athlete. */
function focusLine(a) {
  var w = weakestOf(a), round = ROUND_KEYS.indexOf(w), own = a.answers.slice(round * 4, round * 4 + 4);
  if (a.answers.slice(0, 16).every(function (x) { return x === 3; })) return "Because it's your lowest round: " + SKILL_NAMES[w] + '.';
  var q = own.indexOf(Math.min.apply(null, own));
  return 'Because you said: ' + questionsFor(a.pos)[round * 4 + q].label + ' — ' + ANSWER_LEVELS[own[q] - 1] + '.';
}
