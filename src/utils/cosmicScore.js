import { signOrder, signTraits, elementLabels, modalityLabels, signFromYmd } from '../data/cosmicSigns';
import { cosmicQuestions, gapVerdicts, tierFor } from '../data/cosmicQuiz';

const ELEMENT_MAX = 40;
const MODALITY_MAX = 25;
const ASPECT_MAX = 35;

const elementPairs = {
  'fire-fire': [40, 'Two open flames'],
  'earth-earth': [40, 'Same ground, same pace'],
  'air-air': [40, 'Endless conversation'],
  'water-water': [40, 'You feel the same weather'],
  'air-fire': [34, 'Air feeds the fire'],
  'earth-water': [34, 'Water shapes the earth'],
  'earth-fire': [22, 'Slow burn meets wildfire'],
  'air-water': [22, 'Logic meets undertow'],
  'fire-water': [14, 'Steam and silence'],
  'air-earth': [14, 'Ideas meet immovable ground']
};

const modalityPairs = {
  'cardinal-mutable': [25, 'One starts, one adapts'],
  'fixed-mutable': [20, 'One anchors, one flexes'],
  'cardinal-fixed': [15, 'Two agendas, one room'],
  'cardinal-cardinal': [12, 'Both want to lead'],
  'fixed-fixed': [12, 'Neither of you blinks first'],
  'mutable-mutable': [12, 'Nobody holds the plan']
};

const aspects = [
  [27, 'Conjunction 0°', 'Same lens on the world'],
  [12, 'Semi-sextile 30°', 'Adjacent, slightly out of step'],
  [31, 'Sextile 60°', 'Easy, low-effort spark'],
  [10, 'Square 90°', 'Productive tension, constant'],
  [35, 'Trine 120°', 'Effortless flow'],
  [8, 'Quincunx 150°', 'You keep missing each other'],
  [24, 'Opposition 180°', 'Opposites that complete']
];

function pairKey(a, b) {
  return [a, b].sort().join('-');
}

export function astroScore(signA, signB) {
  const ta = signTraits[signA];
  const tb = signTraits[signB];

  const [elementPts, elementNote] = elementPairs[pairKey(ta.element, tb.element)];
  const [modalityPts, modalityNote] = modalityPairs[pairKey(ta.modality, tb.modality)];

  const ia = signOrder.indexOf(signA);
  const ib = signOrder.indexOf(signB);
  const dist = Math.min((ia - ib + 12) % 12, (ib - ia + 12) % 12);
  const [aspectPts, aspectName, aspectNote] = aspects[dist];

  return {
    total: elementPts + modalityPts + aspectPts,
    element: {
      pts: elementPts,
      max: ELEMENT_MAX,
      label: `${elementLabels[ta.element]} + ${elementLabels[tb.element]}`,
      note: elementNote
    },
    modality: {
      pts: modalityPts,
      max: MODALITY_MAX,
      label: `${modalityLabels[ta.modality]} + ${modalityLabels[tb.modality]}`,
      note: modalityNote
    },
    aspect: { pts: aspectPts, max: ASPECT_MAX, label: aspectName, note: aspectNote }
  };
}

export function quizScore(answersA, answersB) {
  let total = 0;
  const rows = cosmicQuestions.map((q, i) => {
    const av = answersA[i];
    const bv = answersB[i];
    const gap = Math.abs(av - bv);
    const pts = q.weight[gap];
    total += pts;
    return {
      id: q.id,
      title: q.title,
      hint: q.hint,
      aLabel: q.options[av].label,
      bLabel: q.options[bv].label,
      gap,
      pts,
      max: q.weight[0],
      verdict: gapVerdicts[gap]
    };
  });
  return { total, rows };
}

function buildNotes(ta, tb, astro, quiz) {
  const notes = [];
  if (ta.ruler === tb.ruler) {
    notes.push(`Both ruled by ${ta.ruler} — you want the same things, at the same volume.`);
  }
  if (astro.element.pts >= 34) {
    notes.push(`${astro.element.note} — the chemistry is structural, not accidental.`);
  } else if (astro.element.pts <= 14) {
    notes.push(`${astro.element.note} — you will have to translate for each other.`);
  }
  if (astro.modality.pts <= 12) {
    notes.push(`${astro.modality.note} — decide who moves first, before it matters.`);
  }
  const weakest = quiz.rows.reduce((w, r) => (r.pts < w.pts ? r : w), quiz.rows[0]);
  if (weakest.gap >= 2) {
    notes.push(`Weakest link: ${weakest.hint.toLowerCase()} — you answered this very differently.`);
  }
  const strongest = quiz.rows.reduce((s, r) => (r.pts > s.pts ? r : s), quiz.rows[0]);
  if (strongest.gap === 0) {
    notes.push(`You both said "${strongest.aLabel}" — same instinct, no negotiation needed.`);
  }
  return notes.slice(0, 3);
}

export function computeChemistry(a, b) {
  const signA = signFromYmd(a.ymd);
  const signB = signFromYmd(b.ymd);
  const astro = astroScore(signA, signB);
  const quiz = quizScore(a.answers, b.answers);
  const total = Math.round(0.55 * astro.total + 0.45 * quiz.total);

  return {
    total,
    astro,
    quiz,
    tier: tierFor(total),
    signA,
    signB,
    sharedRuler: signTraits[signA].ruler === signTraits[signB].ruler ? signTraits[signA].ruler : null,
    notes: buildNotes(signTraits[signA], signTraits[signB], astro, quiz)
  };
}
