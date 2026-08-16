import { useEffect, useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { ChatPage } from '../pages/ChatPage';
import { AstroHubPage } from '../pages/AstroHubPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ShubhKartPage } from '../pages/ShubhKartPage';
import { CartPage } from '../pages/CartPage';
import { AddressPage } from '../pages/AddressPage';
import { OrderConfirmPage } from '../pages/OrderConfirmPage';
import { ConnectedUsersPage } from '../pages/ConnectedUsersPage';
import { CosmicStartPage } from '../pages/CosmicStartPage';
import { CosmicSharePage } from '../pages/CosmicSharePage';
import { CosmicJoinPage } from '../pages/CosmicJoinPage';
import { CosmicRevealPage } from '../pages/CosmicRevealPage';
import { CartProvider } from '../state/CartContext';
import { SessionProvider } from '../state/SessionContext';
import { CosmicProvider } from '../state/CosmicContext';
import { getBootLink, isCosmicHash } from '../utils/cosmicLink';

export function App() {
  const [route, setRoute] = useState(() => getBootLink()?.route || 'home');

  useEffect(() => {
    const returnHome = () => setRoute('home');
    const onHash = () => {
      if (isCosmicHash(window.location.hash)) window.location.reload();
    };
    window.addEventListener('astro:return-home', returnHome);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('astro:return-home', returnHome);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  let page;
  if (route === 'chat') page = <ChatPage onNavigate={setRoute} />;
  else if (route === 'hub') page = <AstroHubPage onNavigate={setRoute} />;
  else if (route === 'settings') page = <SettingsPage onNavigate={setRoute} />;
  else if (route === 'shubh-kart') page = <ShubhKartPage onNavigate={setRoute} />;
  else if (route === 'cart') page = <CartPage onNavigate={setRoute} />;
  else if (route === 'address') page = <AddressPage onNavigate={setRoute} />;
  else if (route === 'confirm') page = <OrderConfirmPage onNavigate={setRoute} />;
  else if (route === 'connected') page = <ConnectedUsersPage onNavigate={setRoute} />;
  else if (route === 'cc-start') page = <CosmicStartPage onNavigate={setRoute} />;
  else if (route === 'cc-share') page = <CosmicSharePage onNavigate={setRoute} />;
  else if (route === 'cc-join') page = <CosmicJoinPage onNavigate={setRoute} />;
  else if (route === 'cc-reveal') page = <CosmicRevealPage onNavigate={setRoute} />;
  else page = <HomePage onNavigate={setRoute} />;

  return (
    <CartProvider>
      <SessionProvider>
        <CosmicProvider>{page}</CosmicProvider>
      </SessionProvider>
    </CartProvider>
  );
}
