export const assetRoot = '/assets/images/';

export const screenshotAssets = {
  home: `${assetRoot}WhatsApp_Image_2026-08-09_at_2.10.55_PM.jpeg`,
  homeAlt: `${assetRoot}WhatsApp_Image_2026-08-09_at_2.11.16_PM.jpeg`,
  chat: `${assetRoot}WhatsApp_Image_2026-08-09_at_2.11.36_PM.jpeg`,
  tools: `${assetRoot}WhatsApp_Image_2026-08-09_at_2.14.15_PM.jpeg`,
  settings: `${assetRoot}WhatsApp_Image_2026-08-09_at_2.14.16_PM.jpeg`
};

export const advisors = [
  { name: 'Kridhа', experience: '5Yrs', languages: 'English · Hindi', price: '₹12/min', oldPrice: '₹15/min', image: screenshotAssets.chat },
  { name: 'Sanyogita', experience: '3Yrs', languages: 'Hindi · Rajasthani · English', price: '₹20/min', oldPrice: '₹25/min', image: screenshotAssets.homeAlt, badge: 'Top Choice', orders: '(22.8k Orders)' },
  { name: 'Tashu', experience: '5Yrs', languages: 'Hindi', price: '₹14/min', oldPrice: '₹18/min', image: screenshotAssets.tools },
  { name: 'Madhuri', experience: '10Yrs', languages: 'Hindi · English', price: '₹18/min', oldPrice: '₹22/min', image: screenshotAssets.settings }
];

export const tools = [
  { title: 'Love Calculator', icon: 'heart', image: screenshotAssets.home },
  { title: 'Daily Horoscope', icon: 'sun', image: screenshotAssets.homeAlt },
  { title: "Today's Panchanga", icon: 'grid', image: screenshotAssets.chat },
  { title: "Kundli's Match", icon: 'rings', image: screenshotAssets.settings },
  { title: 'Free Kundli', icon: 'heart', image: screenshotAssets.tools }
];
