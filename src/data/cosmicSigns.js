export const signOrder = [
  'mesha', 'vrishabha', 'mithuna', 'karka', 'simha', 'kanya',
  'tula', 'vrischika', 'dhanu', 'makara', 'kumbha', 'meena'
];

export const signTraits = {
  mesha: { from: [3, 21], to: [4, 19], element: 'fire', modality: 'cardinal', ruler: 'Mangal', vibe: 'Bold starter' },
  vrishabha: { from: [4, 20], to: [5, 20], element: 'earth', modality: 'fixed', ruler: 'Shukra', vibe: 'Steady anchor' },
  mithuna: { from: [5, 21], to: [6, 20], element: 'air', modality: 'mutable', ruler: 'Budh', vibe: 'Restless talker' },
  karka: { from: [6, 21], to: [7, 22], element: 'water', modality: 'cardinal', ruler: 'Chandra', vibe: 'Deep feeler' },
  simha: { from: [7, 23], to: [8, 22], element: 'fire', modality: 'fixed', ruler: 'Surya', vibe: 'Warm performer' },
  kanya: { from: [8, 23], to: [9, 22], element: 'earth', modality: 'mutable', ruler: 'Budh', vibe: 'Quiet fixer' },
  tula: { from: [9, 23], to: [10, 22], element: 'air', modality: 'cardinal', ruler: 'Shukra', vibe: 'Peace broker' },
  vrischika: { from: [10, 23], to: [11, 21], element: 'water', modality: 'fixed', ruler: 'Mangal', vibe: 'All-in intense' },
  dhanu: { from: [11, 22], to: [12, 21], element: 'fire', modality: 'mutable', ruler: 'Guru', vibe: 'Free explorer' },
  makara: { from: [12, 22], to: [1, 19], element: 'earth', modality: 'cardinal', ruler: 'Shani', vibe: 'Long-game builder' },
  kumbha: { from: [1, 20], to: [2, 18], element: 'air', modality: 'fixed', ruler: 'Shani', vibe: 'Independent thinker' },
  meena: { from: [2, 19], to: [3, 20], element: 'water', modality: 'mutable', ruler: 'Guru', vibe: 'Dreamy empath' }
};

export const elementLabels = { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' };
export const modalityLabels = { cardinal: 'Cardinal', fixed: 'Fixed', mutable: 'Mutable' };

export function ymdFromInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  return Number(value.replace(/-/g, ''));
}

export function signFromYmd(ymd) {
  if (!ymd) return null;
  const m = Math.floor((ymd % 10000) / 100);
  const d = ymd % 100;
  for (const id of signOrder) {
    const [fm, fd] = signTraits[id].from;
    const [tm, td] = signTraits[id].to;
    if ((m === fm && d >= fd) || (m === tm && d <= td)) return id;
  }
  return 'makara';
}
