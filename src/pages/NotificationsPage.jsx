import { BellOff } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';

export function NotificationsPage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Notifications" onBack={() => onNavigate('home')} />
      <main className="nt-main">
        <div className="nt-empty">
          <span className="nt-empty-icon"><BellOff size={30} /></span>
          <h3>Nothing here yet</h3>
          <p>Reading updates, order news, and coin rewards will show up here.</p>
          <button className="ghost-btn cc-wide" onClick={() => onNavigate('home')}>
            Back to home
          </button>
        </div>
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
