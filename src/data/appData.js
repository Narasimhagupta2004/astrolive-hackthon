const portrait = 'https://images.pexels.com/photos/17040892/pexels-photo-17040892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const portrait2 = 'https://images.pexels.com/photos/17633487/pexels-photo-17633487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const stars = 'https://images.pexels.com/photos/8148203/pexels-photo-8148203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const tarot = 'https://images.pexels.com/photos/7222056/pexels-photo-7222056.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const uiAssets = {
  hero: portrait,
  live1: portrait2,
  live2: portrait,
  live3: portrait2,
  toolBg1: stars,
  toolBg2: tarot,
  toolBg3: tarot,
  toolBg4: portrait2,
  toolBg5: stars
};

const astro1 = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const astro2 = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const astro3 = 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const astro4 = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const astro5 = 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const astro6 = 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const astrologers = [
  {
    id: 'as-01', name: 'Kridha', image: astro1,
    skills: ['Vedic', 'Tarot'], languages: ['English', 'Hindi'],
    ratePerMin: 12, oldRatePerMin: 15, rating: 4.8, orders: 22800,
    experienceYears: 5, isOnline: true, isLive: true, tag: 'Top Choice'
  },
  {
    id: 'as-02', name: 'Sanyogita', image: astro2,
    skills: ['Numerology'], languages: ['Hindi', 'Rajasthani', 'English'],
    ratePerMin: 20, oldRatePerMin: 25, rating: 4.9, orders: 31400,
    experienceYears: 3, isOnline: true, isLive: false
  },
  {
    id: 'as-03', name: 'Tashu', image: astro3,
    skills: ['Tarot'], languages: ['Hindi'],
    ratePerMin: 14, oldRatePerMin: 18, rating: 4.6, orders: 9200,
    experienceYears: 5, isOnline: true, isLive: true
  },
  {
    id: 'as-04', name: 'Madhuri', image: astro4,
    skills: ['Vedic', 'Palmistry'], languages: ['Hindi', 'English'],
    ratePerMin: 18, oldRatePerMin: 22, rating: 4.7, orders: 15600,
    experienceYears: 10, isOnline: false, isLive: false
  },
  {
    id: 'as-05', name: 'Devansh', image: astro5,
    skills: ['Vastu', 'Vedic'], languages: ['English', 'Gujarati'],
    ratePerMin: 25, oldRatePerMin: 30, rating: 4.9, orders: 44100,
    experienceYears: 12, isOnline: true, isLive: true, tag: 'Celebrity'
  },
  {
    id: 'as-06', name: 'Ananya', image: astro6,
    skills: ['Numerology', 'Tarot'], languages: ['English', 'Bengali'],
    ratePerMin: 10, oldRatePerMin: 14, rating: 4.5, orders: 6800,
    experienceYears: 2, isOnline: true, isLive: false
  }
];

const user1 = 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const user2 = 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const user3 = 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const user4 = 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const user5 = 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const MAX_CONNECTS = 3;

export const connectedUsers = [
  {
    id: 'usr-01', name: 'Priya Menon', image: user1, rashi: 'mesha',
    lastMode: 'chat', lastAtMinsAgo: 45, isOnline: true, consultations: 4
  },
  {
    id: 'usr-02', name: 'Rohan Desai', image: user2, rashi: 'vrishabha',
    lastMode: 'call', lastAtMinsAgo: 180, isOnline: true, consultations: 2
  },
  {
    id: 'usr-03', name: 'Meera Iyer', image: user3, rashi: 'kanya',
    lastMode: 'chat', lastAtMinsAgo: 1440, isOnline: false, consultations: 7
  },
  {
    id: 'usr-04', name: 'Arjun Nair', image: user4, rashi: 'simha',
    lastMode: 'chat', lastAtMinsAgo: 2880, isOnline: false, consultations: 1
  },
  {
    id: 'usr-05', name: 'Kavya Reddy', image: user5, rashi: 'tula',
    lastMode: 'call', lastAtMinsAgo: 4320, isOnline: true, consultations: 3
  }
];

export const tools = [
  { title: 'Love Calculator', icon: 'heart', image: stars },
  { title: 'Daily Horoscope', icon: 'sun', image: tarot },
  { title: "Today's Panchanga", icon: 'grid', image: tarot },
  { title: "Kundli's Match", icon: 'rings', image: portrait2 },
  { title: 'Free Kundli', icon: 'heart', image: stars }
];

const rudraksha = 'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const bracelet = 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const gemstone = 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const yantra = 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const pooja = 'https://images.pexels.com/photos/6152394/pexels-photo-6152394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const diya = 'https://images.pexels.com/photos/6044226/pexels-photo-6044226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const incense = 'https://images.pexels.com/photos/6044743/pexels-photo-6044743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const mala = 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const shubhKartProducts = [
  {
    id: 'sk-01', name: '5 Mukhi Rudraksha', category: 'Sacred Items',
    price: 499, oldPrice: 899, image: rudraksha, tag: 'Best Seller', rating: 4.7,
    intents: ['peace', 'growth', 'protection'],
    rashis: ['mesha', 'vrishabha', 'mithuna', 'karka', 'simha', 'kanya', 'tula', 'vrischika', 'dhanu', 'makara', 'kumbha', 'meena'],
    bestDay: 'Monday', bestDayHint: 'Chandra',
    benefits: ['Calms an anxious mind', 'Boosts concentration in study', 'Neutralises Shani dosh'],
    mantra: 'ॐ ह्रीं नमः'
  },
  {
    id: 'sk-02', name: 'Evil Eye Bracelet', category: 'Sacred Items',
    price: 799, oldPrice: 1499, image: bracelet, rating: 4.6,
    intents: ['protection', 'love'],
    rashis: ['karka', 'vrischika', 'meena'],
    bestDay: 'Saturday', bestDayHint: 'Shani',
    benefits: ['Blocks negative gazes', 'Guards emotional wellbeing', 'Attracts positive company'],
    mantra: 'ॐ नज़र सुरक्षा'
  },
  {
    id: 'sk-03', name: 'Blue Sapphire Gemstone', category: 'Sacred Items',
    price: 2499, oldPrice: 4999, image: gemstone, tag: 'Premium', rating: 4.9,
    intents: ['wealth', 'career', 'growth'],
    rashis: ['makara', 'kumbha'],
    bestDay: 'Saturday', bestDayHint: 'Shani',
    benefits: ['Fast career elevation', 'Financial stability', 'Wear only after Kundli consult'],
    mantra: 'ॐ शं शनैश्चराय नमः'
  },
  {
    id: 'sk-04', name: 'Shri Yantra (Copper)', category: 'Sacred Items',
    price: 1199, oldPrice: 1999, image: yantra, rating: 4.8,
    intents: ['wealth', 'peace'],
    rashis: ['simha', 'kanya', 'tula'],
    bestDay: 'Friday', bestDayHint: 'Shukra',
    benefits: ['Invokes goddess Lakshmi', 'Removes financial blocks', 'Consecrate on Diwali/Friday'],
    mantra: 'ॐ श्रीं महालक्ष्म्यै नमः'
  },
  {
    id: 'sk-05', name: 'Tulsi Japa Mala', category: 'Sacred Items',
    price: 349, oldPrice: 599, image: mala, rating: 4.5,
    intents: ['peace', 'growth'],
    rashis: ['mesha', 'karka', 'dhanu', 'meena'],
    bestDay: 'Thursday', bestDayHint: 'Guru',
    benefits: ['Perfect for daily japa', '108 sacred beads', 'Purifies aura'],
    mantra: 'ॐ नमो नारायणाय'
  },
  {
    id: 'sk-06', name: 'Grahan Dosh Shanti Pooja', category: 'Pooja & Remedies',
    price: 1499, oldPrice: 2499, image: pooja, tag: 'Trending', rating: 4.8,
    intents: ['protection', 'peace'],
    rashis: ['karka', 'simha', 'makara', 'kumbha'],
    bestDay: 'Sunday', bestDayHint: 'Surya',
    benefits: ['Nullifies eclipse doshas in Kundli', 'Performed by certified pandits', 'Live streamed for you'],
    mantra: 'ॐ श्री सूर्याय नमः'
  },
  {
    id: 'sk-07', name: 'Guru Chandal Dosh Nivaran', category: 'Pooja & Remedies',
    price: 1899, oldPrice: 2999, image: diya, rating: 4.6,
    intents: ['career', 'growth'],
    rashis: ['dhanu', 'meena'],
    bestDay: 'Thursday', bestDayHint: 'Guru',
    benefits: ['Restores mentor & career luck', 'Removes Guru-Rahu clash', 'Pandit sends prasad by post'],
    mantra: 'ॐ बृं बृहस्पतये नमः'
  },
  {
    id: 'sk-08', name: 'Loan (Karz) Mukti Pooja', category: 'Pooja & Remedies',
    price: 2199, oldPrice: 3499, image: incense, tag: 'Newly Launched', rating: 4.9,
    intents: ['wealth', 'peace'],
    rashis: ['vrishabha', 'kanya', 'tula', 'makara'],
    bestDay: 'Tuesday', bestDayHint: 'Mangal',
    benefits: ['Speeds up debt closure', 'Attracts unexpected income', 'Includes Hanuman Chalisa recital'],
    mantra: 'ॐ ऋणमुक्तेश्वराय नमः'
  },
  {
    id: 'sk-09', name: 'Pitra Shanti Pooja', category: 'Pooja & Remedies',
    price: 1799, oldPrice: 2799, image: pooja, rating: 4.7,
    intents: ['protection', 'growth'],
    rashis: ['mesha', 'mithuna', 'vrischika'],
    bestDay: 'Sunday', bestDayHint: 'Surya',
    benefits: ['Honours ancestors', 'Removes pitra dosh from Kundli', 'Prasad + certificate delivered'],
    mantra: 'ॐ पितृ देवाय नमः'
  }
];

export const rashis = [
  { id: 'mesha', label: 'Mesha', en: 'Aries', symbol: '♈' },
  { id: 'vrishabha', label: 'Vrishabha', en: 'Taurus', symbol: '♉' },
  { id: 'mithuna', label: 'Mithuna', en: 'Gemini', symbol: '♊' },
  { id: 'karka', label: 'Karka', en: 'Cancer', symbol: '♋' },
  { id: 'simha', label: 'Simha', en: 'Leo', symbol: '♌' },
  { id: 'kanya', label: 'Kanya', en: 'Virgo', symbol: '♍' },
  { id: 'tula', label: 'Tula', en: 'Libra', symbol: '♎' },
  { id: 'vrischika', label: 'Vrischika', en: 'Scorpio', symbol: '♏' },
  { id: 'dhanu', label: 'Dhanu', en: 'Sagittarius', symbol: '♐' },
  { id: 'makara', label: 'Makara', en: 'Capricorn', symbol: '♑' },
  { id: 'kumbha', label: 'Kumbha', en: 'Aquarius', symbol: '♒' },
  { id: 'meena', label: 'Meena', en: 'Pisces', symbol: '♓' }
];

export const intents = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'peace', label: 'Peace', emoji: '🕉️' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'career', label: 'Career', emoji: '💼' },
  { id: 'wealth', label: 'Wealth', emoji: '💰' },
  { id: 'protection', label: 'Protection', emoji: '🛡️' },
  { id: 'growth', label: 'Growth', emoji: '🌱' }
];

export const freeGift = {
  threshold: 1500,
  name: 'Tulsi Japa Mala',
  image: mala,
  emoji: '🌿'
};

export const featuredCollection = {
  title: 'Shravan Blessings',
  subtitle: 'Up to 45% OFF on sacred picks',
  cta: 'Shop the collection',
  productIds: ['sk-01', 'sk-04', 'sk-05']
};
