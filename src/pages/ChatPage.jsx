import { useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ChatTabs } from '../components/astrologers/ChatTabs';
import { AdvisorCard } from '../components/astrologers/AdvisorCard';
import { astrologers, advisorCategories } from '../data/appData';
import { useSession } from '../state/SessionContext';

export function ChatPage({ onNavigate }) {
  const { startSession } = useSession();
  const [category, setCategory] = useState('all');

  const handleChat = (advisor) => {
    startSession(advisor, 'chat');
    onNavigate('conversation', { person: advisor, from: 'chat' });
  };

  const shown = category === 'all'
    ? astrologers
    : astrologers.filter((a) => (a.categories || []).includes(category));

  const label = advisorCategories.find((c) => c.id === category)?.label;

  return (
    <div className="app-screen">
      <AppHeader variant="home" onWallet={() => onNavigate('wallet')} onSearch={() => onNavigate('search')} onNotifications={() => onNavigate('notifications')} />
      <main className="chat-main">
        <ChatTabs active={category} onChange={setCategory} />
        {shown.map((a) => (
          <AdvisorCard key={a.id} advisor={a} onChat={handleChat} />
        ))}
        {shown.length === 0 && (
          <div className="cc-empty">
            <h3>Nobody free in {label} yet</h3>
            <p>Try another category — or browse everyone.</p>
            <button className="primary-btn full" onClick={() => setCategory('all')}>
              Show all astrologers
            </button>
          </div>
        )}
      </main>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
