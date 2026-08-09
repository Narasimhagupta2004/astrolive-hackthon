import { useEffect, useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { ChatPage } from '../pages/ChatPage';
import { AstroHubPage } from '../pages/AstroHubPage';
import { SettingsPage } from '../pages/SettingsPage';

export function App() {
  const [route, setRoute] = useState('home');

  useEffect(() => {
    const returnHome = () => setRoute('home');
    window.addEventListener('astro:return-home', returnHome);
    return () => window.removeEventListener('astro:return-home', returnHome);
  }, []);

  if (route === 'chat') return <ChatPage onNavigate={setRoute} />;
  if (route === 'hub') return <AstroHubPage onNavigate={setRoute} />;
  if (route === 'settings') return <SettingsPage onNavigate={setRoute} />;
  return <HomePage onNavigate={setRoute} />;
}
