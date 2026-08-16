export const cosmicQuestions = [
  {
    id: 'q1',
    title: "It's 11pm and you've both had a rough day. What actually happens?",
    hint: 'Recharge style',
    weight: [33, 21, 9, 2],
    options: [
      { label: 'Talk it out', hint: 'Right now, out loud' },
      { label: 'Sit together, quiet', hint: 'Presence, no words' },
      { label: 'Distract me', hint: 'Food, a show, a drive' },
      { label: 'Give me space', hint: "I'll come back to it" }
    ]
  },
  {
    id: 'q2',
    title: 'The plan is set. They cancel 20 minutes before.',
    hint: 'Conflict trigger',
    weight: [40, 25, 10, 0],
    options: [
      { label: 'Totally fine', hint: 'Plans are suggestions' },
      { label: 'Tell me sooner', hint: 'Notice matters' },
      { label: 'I say it stings', hint: "I'll bring it up" },
      { label: 'I remember this', hint: 'It goes in the file' }
    ]
  },
  {
    id: 'q3',
    title: 'Three years out, the good version of us looks like…',
    hint: 'Future pull',
    weight: [27, 18, 8, 2],
    options: [
      { label: 'Locked in', hint: 'Home, plans, forever' },
      { label: 'Building something', hint: 'Work, money, ambition' },
      { label: 'Two passports', hint: 'Travel, novelty, chaos' },
      { label: 'No idea, happily', hint: "We'll find out" }
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
    accent: '#ff4d7d', gradient: 'linear-gradient(90deg, #ff8a3d, #ff4d7d)'
  },
  {
    id: 'golden', min: 75, name: 'Golden Conjunction', emoji: '✨',
    verdict: 'Strong pull, easy rhythm. The friction you have is the useful kind.',
    accent: '#be8900', gradient: 'linear-gradient(90deg, #ffd02e, #ff8a3d)'
  },
  {
    id: 'crescent', min: 55, name: 'Waxing Crescent', emoji: '🌙',
    verdict: 'Real potential, still forming. You need more conversations, not more signs.',
    accent: '#7b00db', gradient: 'linear-gradient(90deg, #a855f7, #7b00db)'
  },
  {
    id: 'retrograde', min: 35, name: 'Retrograde Static', emoji: '☄️',
    verdict: 'Wires cross. You want similar things at very different speeds.',
    accent: '#5b6b8c', gradient: 'linear-gradient(90deg, #8fa3c4, #5b6b8c)'
  },
  {
    id: 'eclipse', min: 0, name: 'Total Cosmic Eclipse', emoji: '🌌',
    verdict: 'Two different orbits. Beautiful from a distance — exhausting up close.',
    accent: '#3b3350', gradient: 'linear-gradient(90deg, #6b6480, #3b3350)'
  }
];

export function tierFor(total) {
  return tiers.find((t) => total >= t.min) || tiers[tiers.length - 1];
}
