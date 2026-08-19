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
import { ConversationPage } from '../pages/ConversationPage';
import { CallPage } from '../pages/CallPage';
import { SuggestProductPage } from '../pages/SuggestProductPage';
import { WalletPage } from '../pages/WalletPage';
import { RechargePage } from '../pages/RechargePage';
import { SearchPage } from '../pages/SearchPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { CosmicStartPage } from '../pages/CosmicStartPage';
import { CosmicSharePage } from '../pages/CosmicSharePage';
import { CosmicJoinPage } from '../pages/CosmicJoinPage';
import { CosmicRevealPage } from '../pages/CosmicRevealPage';
import { CartProvider } from '../state/CartContext';
import { SessionProvider } from '../state/SessionContext';
import { CosmicProvider } from '../state/CosmicContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import { getBootLink, isCosmicHash } from '../utils/cosmicLink';

export function App() {
  const [route, setRoute] = useState(() => getBootLink()?.route || 'home');
  const [target, setTarget] = useState(null);

  // onNavigate(route, payload): payload carries which person a screen is about,
  // since a route is just a string. Callers passing one argument are unaffected.
  const navigate = (next, payload) => {
    if (payload !== undefined) setTarget(payload);
    setRoute(next);
  };

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
  if (route === 'chat') page = <ChatPage onNavigate={navigate} />;
  else if (route === 'hub') page = <AstroHubPage onNavigate={navigate} />;
  else if (route === 'settings') page = <SettingsPage onNavigate={navigate} />;
  else if (route === 'shubh-kart') page = <ShubhKartPage onNavigate={navigate} />;
  else if (route === 'cart') page = <CartPage onNavigate={navigate} />;
  else if (route === 'address') page = <AddressPage onNavigate={navigate} />;
  else if (route === 'confirm') page = <OrderConfirmPage onNavigate={navigate} />;
  else if (route === 'connected') page = <ConnectedUsersPage onNavigate={navigate} />;
  else if (route === 'conversation') page = <ConversationPage onNavigate={navigate} target={target} />;
  else if (route === 'call') page = <CallPage onNavigate={navigate} target={target} />;
  else if (route === 'suggest') page = <SuggestProductPage onNavigate={navigate} target={target} />;
  else if (route === 'wallet') page = <WalletPage onNavigate={navigate} />;
  else if (route === 'recharge') page = <RechargePage onNavigate={navigate} />;
  else if (route === 'search') page = <SearchPage onNavigate={navigate} />;
  else if (route === 'notifications') page = <NotificationsPage onNavigate={navigate} />;
  else if (route === 'cc-start') page = <CosmicStartPage onNavigate={navigate} />;
  else if (route === 'cc-share') page = <CosmicSharePage onNavigate={navigate} />;
  else if (route === 'cc-join') page = <CosmicJoinPage onNavigate={navigate} />;
  else if (route === 'cc-reveal') page = <CosmicRevealPage onNavigate={navigate} />;
  else page = <HomePage onNavigate={navigate} />;

  return (
    <ReduxProvider store={store}>
      <CartProvider>
        <SessionProvider>
          <CosmicProvider>{page}</CosmicProvider>
        </SessionProvider>
      </CartProvider>
    </ReduxProvider>
  );
}
