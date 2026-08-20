export const intents = [
  {
    id: 'contract', label: 'Sign a contract', emoji: '📝',
    preferredNakshatras: ['Pushya', 'Uttara Phalguni', 'Hasta', 'Anuradha'],
    preferredHoras: ['Guru', 'Budh'],
    preferredTithis: ['Panchami', 'Ekadashi', 'Dashami'],
    houseAffinity: 10, avoidWeekdays: ['Saturday'],
    reasoningHook: 'ideal for career milestones and binding agreements'
  },
  {
    id: 'new-job', label: 'Start a new job', emoji: '💼',
    preferredNakshatras: ['Pushya', 'Uttara Phalguni', 'Shravana'],
    preferredHoras: ['Guru', 'Ravi'],
    preferredTithis: ['Panchami', 'Dashami', 'Trayodashi'],
    houseAffinity: 10, avoidWeekdays: ['Tuesday'],
    reasoningHook: 'launches new professional chapters with lasting momentum'
  },
  {
    id: 'vehicle', label: 'Buy a vehicle', emoji: '🚗',
    preferredNakshatras: ['Ashwini', 'Pushya', 'Chitra', 'Revati'],
    preferredHoras: ['Shukra', 'Budh'],
    preferredTithis: ['Panchami', 'Dashami'],
    houseAffinity: 4, avoidWeekdays: ['Saturday'],
    reasoningHook: 'blesses movement and prevents accidents'
  },
  {
    id: 'jewelry', label: 'Buy gold or jewelry', emoji: '💍',
    preferredNakshatras: ['Rohini', 'Uttara Phalguni', 'Hasta', 'Anuradha'],
    preferredHoras: ['Shukra', 'Guru'],
    preferredTithis: ['Panchami', 'Dashami', 'Purnima'],
    houseAffinity: 2, avoidWeekdays: ['Tuesday'],
    reasoningHook: 'attracts prosperity and lasting wealth'
  },
  {
    id: 'wedding', label: 'Wedding or engagement', emoji: '💒',
    preferredNakshatras: ['Rohini', 'Magha', 'Uttara Phalguni', 'Hasta', 'Anuradha', 'Swati', 'Revati'],
    preferredHoras: ['Shukra', 'Guru'],
    preferredTithis: ['Dwitiya', 'Panchami', 'Saptami', 'Ekadashi'],
    houseAffinity: 7, avoidWeekdays: ['Tuesday'],
    reasoningHook: 'blesses union and lasting harmony'
  },
  {
    id: 'property', label: 'Buy property', emoji: '🏠',
    preferredNakshatras: ['Rohini', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    preferredHoras: ['Shukra', 'Guru'],
    preferredTithis: ['Panchami', 'Dashami', 'Trayodashi'],
    houseAffinity: 4, avoidWeekdays: ['Tuesday'],
    reasoningHook: 'anchors long-lasting shelter and family stability'
  },
  {
    id: 'business', label: 'Start a business', emoji: '🚀',
    preferredNakshatras: ['Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra'],
    preferredHoras: ['Budh', 'Guru'],
    preferredTithis: ['Panchami', 'Dashami', 'Ekadashi'],
    houseAffinity: 11, avoidWeekdays: ['Saturday'],
    reasoningHook: 'plants the seed for enduring growth and gains'
  },
  {
    id: 'travel', label: 'Long journey', emoji: '✈️',
    preferredNakshatras: ['Ashwini', 'Pushya', 'Hasta', 'Revati'],
    preferredHoras: ['Budh', 'Chandra'],
    preferredTithis: ['Dwitiya', 'Saptami', 'Ekadashi'],
    houseAffinity: 3, avoidWeekdays: ['Tuesday'],
    reasoningHook: 'ensures safe travel and successful journeys'
  }
];

export const freeformKeywords = {
  contract: ['contract', 'agreement', 'sign', 'deed', 'lease', 'notary'],
  'new-job': ['job', 'offer', 'joining', 'appraisal', 'promotion', 'career'],
  vehicle: ['car', 'bike', 'scooter', 'vehicle', 'automobile', 'ev', 'tesla'],
  jewelry: ['gold', 'silver', 'jewelry', 'jewellery', 'ring', 'chain', 'ornament'],
  wedding: ['wedding', 'marriage', 'engagement', 'propose', 'roka', 'sangeet', 'nikah'],
  property: ['house', 'flat', 'apartment', 'property', 'land', 'plot', 'home', 'buy home'],
  business: ['business', 'startup', 'launch', 'venture', 'shop', 'company', 'youtube', 'channel', 'content'],
  travel: ['travel', 'journey', 'trip', 'flight', 'yatra', 'pilgrimage']
};

const HOUSE_MEANINGS = {
  1: 'self and vitality', 2: 'wealth and speech', 3: 'siblings and courage',
  4: 'home and mother', 5: 'creativity and children', 6: 'health and rivals',
  7: 'partnership and marriage', 8: 'transformation and inheritance',
  9: 'dharma and fortune', 10: 'career and honour',
  11: 'gains and community', 12: 'liberation and expenses'
};

export function houseFor(rashiId, rashisArray, houseAffinity) {
  const rashi = rashisArray?.find((r) => r.id === rashiId);
  if (!rashi) return null;
  return {
    rashiLabel: rashi.label,
    rashiSymbol: rashi.symbol,
    houseNumber: houseAffinity,
    houseMeaning: HOUSE_MEANINGS[houseAffinity] || 'life pursuits'
  };
}

// Panchang values are astrologically plausible — nakshatra & tithi cycle through
// their real sequences, but positions aren't computed from ephemeris. Rahu-Kaal
// & Abhijit are fixed to Hyderabad sunrise/sunset. Real product would compute
// per user location using Swiss Ephemeris.
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' }, { name: 'Bharani', lord: 'Shukra' },
  { name: 'Krittika', lord: 'Ravi' }, { name: 'Rohini', lord: 'Chandra' },
  { name: 'Mrigashira', lord: 'Mangal' }, { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Guru' }, { name: 'Pushya', lord: 'Shani' },
  { name: 'Ashlesha', lord: 'Budh' }, { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Shukra' }, { name: 'Uttara Phalguni', lord: 'Ravi' },
  { name: 'Hasta', lord: 'Chandra' }, { name: 'Chitra', lord: 'Mangal' },
  { name: 'Swati', lord: 'Rahu' }, { name: 'Vishakha', lord: 'Guru' },
  { name: 'Anuradha', lord: 'Shani' }, { name: 'Jyeshtha', lord: 'Budh' },
  { name: 'Mula', lord: 'Ketu' }, { name: 'Purva Ashadha', lord: 'Shukra' },
  { name: 'Uttara Ashadha', lord: 'Ravi' }, { name: 'Shravana', lord: 'Chandra' },
  { name: 'Dhanishta', lord: 'Mangal' }, { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Guru' }, { name: 'Uttara Bhadrapada', lord: 'Shani' },
  { name: 'Revati', lord: 'Budh' }
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima'
];

const RAHU_KAAL = {
  Sunday:    [16.5, 18], Monday: [7.5, 9], Tuesday: [15, 16.5],
  Wednesday: [12, 13.5], Thursday: [13.5, 15], Friday: [10.5, 12], Saturday: [9, 10.5]
};

const DAY_LORDS = {
  Sunday: 'Ravi', Monday: 'Chandra', Tuesday: 'Mangal', Wednesday: 'Budh',
  Thursday: 'Guru', Friday: 'Shukra', Saturday: 'Shani'
};
const HORA_ORDER = ['Ravi', 'Shukra', 'Budh', 'Chandra', 'Shani', 'Guru', 'Mangal'];

export function findHoraBlock(dateISO, weekday, targetHora, sunriseHour = 6) {
  const dayLord = DAY_LORDS[weekday];
  const startIdx = HORA_ORDER.indexOf(dayLord);
  for (let i = 0; i < 12; i++) {
    const hora = HORA_ORDER[(startIdx + i) % 7];
    if (hora === targetHora) {
      const startHour = sunriseHour + i;
      return { hora, startHour, endHour: startHour + 1 };
    }
  }
  return null;
}

export function fmtHour(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function buildPanchang14() {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Deterministic per day: starting indices seeded from day-of-year so the same
  // date always produces the same panchang across reloads.
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const nakStart = dayOfYear % NAKSHATRAS.length;
  const tithiStart = dayOfYear % TITHIS.length;

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const weekday = weekdayNames[d.getDay()];
    const nak = NAKSHATRAS[(nakStart + i) % NAKSHATRAS.length];
    const tithi = TITHIS[(tithiStart + i) % TITHIS.length];
    const [rkStart, rkEnd] = RAHU_KAAL[weekday];

    out.push({
      date: d.toISOString().slice(0, 10),
      dateLabel: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
      weekday,
      dayLord: DAY_LORDS[weekday],
      nakshatra: nak.name,
      nakshatraLord: nak.lord,
      tithi,
      rahuKaal: { start: fmtHour(rkStart), end: fmtHour(rkEnd), startHour: rkStart, endHour: rkEnd },
      abhijitMuhurta: { start: '11:52', end: '12:44', startHour: 11.87, endHour: 12.73 },
      sunrise: '05:56', sunset: '18:34'
    });
  }
  return out;
}
