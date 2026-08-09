import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ChatTabs } from '../components/astrologers/ChatTabs';
import { AdvisorCard } from '../components/astrologers/AdvisorCard';
import { advisors } from '../data/appData';

export function ChatPage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="home" />
      <main className="chat-main">
        <ChatTabs />
        {advisors.map((a) => (
          <AdvisorCard key={a.name} advisor={a} onChat={(adv) => alert(`Starting chat with ${adv.name}`)} />
        ))}
      </main>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
