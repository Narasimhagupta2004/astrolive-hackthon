import { useEffect, useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { ChatPage } from '../pages/ChatPage';
import { AstroHubPage } from '../pages/AstroHubPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ShubhKartPage } from '../pages/ShubhKartPage';
import { CartPage } from '../pages/CartPage';
import { AddressPage } from '../pages/AddressPage';
import { OrderConfirmPage } from '../pages/OrderConfirmPage';
import { CartProvider } from '../state/CartContext';

export function App() {
  const [route, setRoute] = useState('home');

  useEffect(() => {
    const returnHome = () => setRoute('home');
    window.addEventListener('astro:return-home', returnHome);
    return () => window.removeEventListener('astro:return-home', returnHome);
  }, []);

  let page;
  if (route === 'chat') page = <ChatPage onNavigate={setRoute} />;
  else if (route === 'hub') page = <AstroHubPage onNavigate={setRoute} />;
  else if (route === 'settings') page = <SettingsPage onNavigate={setRoute} />;
  else if (route === 'shubh-kart') page = <ShubhKartPage onNavigate={setRoute} />;
  else if (route === 'cart') page = <CartPage onNavigate={setRoute} />;
  else if (route === 'address') page = <AddressPage onNavigate={setRoute} />;
  else if (route === 'confirm') page = <OrderConfirmPage onNavigate={setRoute} />;
  else page = <HomePage onNavigate={setRoute} />;

  return <CartProvider>{page}</CartProvider>;
}
