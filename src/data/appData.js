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

export const advisors = [
  { name: 'Kridhа', experience: '5Yrs', languages: 'English · Hindi', price: '₹12/min', oldPrice: '₹15/min', image: portrait },
  { name: 'Sanyogita', experience: '3Yrs', languages: 'Hindi · Rajasthani · English', price: '₹20/min', oldPrice: '₹25/min', image: portrait2, badge: 'Top Choice', orders: '(22.8k Orders)' },
  { name: 'Tashu', experience: '5Yrs', languages: 'Hindi', price: '₹14/min', oldPrice: '₹18/min', image: portrait },
  { name: 'Madhuri', experience: '10Yrs', languages: 'Hindi · English', price: '₹18/min', oldPrice: '₹22/min', image: portrait2 }
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
