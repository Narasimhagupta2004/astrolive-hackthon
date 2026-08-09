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
