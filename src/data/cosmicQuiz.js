export const cosmicQuestions = [
  {
    id: 'q1',
    title: 'Mercury goes retrograde. The plan dies, your phone dies, the day is a mess.',
    hint: 'Chaos instinct',
    weight: [33, 21, 9, 2],
    options: [
      { emoji: '😂', label: 'Laugh and improvise', hint: 'Chaos is the story' },
      { emoji: '🛠️', label: 'Rebuild the plan', hint: 'Fix it, right now' },
      { emoji: '🫧', label: 'Reset first', hint: 'Quiet, then talk' },
      { emoji: '🪐', label: 'Blame the planets', hint: 'This is clearly a sign' }
    ]
  },
  {
    id: 'q2',
    title: "Full moon, 2am. They ask what you're actually thinking.",
    hint: 'How open you run',
    weight: [40, 25, 10, 0],
    options: [
      { emoji: '🌊', label: 'All of it, unfiltered', hint: 'You get the whole flood' },
      { emoji: '🗝️', label: 'The honest headline', hint: 'True, lightly edited' },
      { emoji: '🌙', label: 'Ask me tomorrow', hint: 'Nothing good is said at 2am' },
      { emoji: '🔒', label: '"Nothing, I\'m fine"', hint: 'The vault stays shut' }
    ]
  },
  {
    id: 'q3',
    title: 'The universe owes you one straight answer. You spend it on…',
    hint: 'What you chase',
    weight: [27, 18, 8, 2],
    options: [
      { emoji: '💞', label: 'Us', hint: 'Do we actually last?' },
      { emoji: '🧭', label: 'My purpose', hint: 'What am I here to do?' },
      { emoji: '🪙', label: 'The money', hint: 'Will I be safe?' },
      { emoji: '✈️', label: 'The next escape', hint: 'Where do I go from here?' }
    ]
  }
];

export const gapVerdicts = [
  { label: 'Perfectly aligned', emoji: '✅' },
  { label: 'Close enough', emoji: '👍' },
  { label: 'Friction', emoji: '⚡' },
  { label: 'Opposite poles', emoji: '💥' }
];

export const tiers = [
  {
    id: 'twin-flame', min: 90, name: 'Twin Flame Alignment', emoji: '🔥',
    verdict: "The charts and the answers agree. This is rare — don't be casual about it.",
    accent: '#eb468b', gradient: 'linear-gradient(90deg, #ff8f52, #eb468b)'
  },
  {
    id: 'golden', min: 75, name: 'Golden Conjunction', emoji: '✨',
    verdict: 'Strong pull, easy rhythm. The friction you have is the useful kind.',
    accent: '#e26912', gradient: 'linear-gradient(90deg, #ffa767, #ff8f52)'
  },
  {
    id: 'crescent', min: 55, name: 'Waxing Crescent', emoji: '🌙',
    verdict: 'Real potential, still forming. You need more conversations, not more signs.',
    accent: '#6b46eb', gradient: 'linear-gradient(90deg, #8e71f4, #6b46eb)'
  },
  {
    id: 'retrograde', min: 35, name: 'Retrograde Static', emoji: '☄️',
    verdict: 'Wires cross. You want similar things at very different speeds.',
    accent: '#635d80', gradient: 'linear-gradient(90deg, #9a94b5, #635d80)'
  },
  {
    id: 'eclipse', min: 0, name: 'Total Cosmic Eclipse', emoji: '🌌',
    verdict: 'Two different orbits. Beautiful from a distance — exhausting up close.',
    accent: '#3b1a42', gradient: 'linear-gradient(90deg, #6b4a73, #3b1a42)'
  }
];

export function tierFor(total) {
  return tiers.find((t) => total >= t.min) || tiers[tiers.length - 1];
}
