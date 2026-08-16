import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ChatTabs } from '../components/astrologers/ChatTabs';
import { AdvisorCard } from '../components/astrologers/AdvisorCard';
import { astrologers } from '../data/appData';
import { useSession } from '../state/SessionContext';

export function ChatPage({ onNavigate }) {
  const { startSession } = useSession();

  const handleChat = (advisor) => {
    startSession(advisor, 'chat');
    alert(`Starting chat with ${advisor.name}`);
  };

  return (
    <div className="app-screen">
      <AppHeader variant="home" />
      <main className="chat-main">
        <ChatTabs />
        {astrologers.map((a) => (
          <AdvisorCard key={a.id} advisor={a} onChat={handleChat} />
        ))}
      </main>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
