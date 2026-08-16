import { useState } from 'react';
import { MessageCircle, Phone, ShoppingBag, Zap } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { BottomSheet } from '../components/common/BottomSheet';
import { rashis, MAX_CONNECTS } from '../data/appData';
import { useSession } from '../state/SessionContext';
import { timeAgo } from '../utils/time';

const connectActions = [
  { id: 'chat', label: 'Resume consultation', hint: 'Pick the chat back up', Icon: MessageCircle },
  { id: 'call', label: 'Start a call', hint: 'Ring them for a voice reading', Icon: Phone },
  { id: 'suggest', label: 'Suggest a product', hint: 'Share a remedy from Shubh Kart', Icon: ShoppingBag }
];

const modeLabels = { chat: 'Chat', call: 'Call', suggest: 'Suggested a product' };

export function ConnectedUsersPage({ onNavigate }) {
  const { myUsers, connectUser } = useSession();
  const [activeUser, setActiveUser] = useState(null);

  const choose = (actionId) => {
    connectUser(activeUser.id, actionId);
    setActiveUser(null);
  };

  const rashiLabel = (id) => rashis.find((r) => r.id === id)?.label;

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Connected Users" onBack={() => onNavigate('settings')} />
      <main className="cu-main">
        <div className="section-heading">
          <h2>People you've consulted</h2>
          <span className="section-count">{myUsers.length} users</span>
        </div>

        {myUsers.map((u) => (
          <article className="cu-card" key={u.id}>
            <div className="cu-pic">
              <img src={u.image} alt={u.name} />
              {u.isOnline && <i className="online-dot" />}
            </div>
            <div className="cu-info">
              <div className="cu-title-row">
                <h3>{u.name}</h3>
                <span className="cu-rashi">{rashiLabel(u.rashi)}</span>
              </div>
              <p className="cu-status">
                {u.isOnline ? 'Online' : 'Offline'} · {modeLabels[u.lastMode]} · {timeAgo(u.lastAt)}
              </p>
              <p className="cu-meta">{u.consultations} consultations</p>
              <div className="cu-bottom">
                <span className="cu-quota">
                  {u.canConnect
                    ? `${u.connectsLeft} of ${MAX_CONNECTS} connects left`
                    : 'Connect limit reached'}
                </span>
                <button
                  className="cu-connect"
                  disabled={!u.canConnect}
                  onClick={() => setActiveUser(u)}
                >
                  <Zap size={13} /> Connect
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>

      <BottomSheet
        open={!!activeUser}
        title={activeUser ? `Connect with ${activeUser.name}` : ''}
        onClose={() => setActiveUser(null)}
      >
        <p className="cu-sheet-note">
          {activeUser?.connectsLeft} of {MAX_CONNECTS} connects left for this user.
        </p>
        {connectActions.map(({ id, label, hint, Icon }) => (
          <button key={id} className="cu-action" onClick={() => choose(id)}>
            <span className="cu-action-icon"><Icon size={18} /></span>
            <span>
              <b>{label}</b>
              <small>{hint}</small>
            </span>
          </button>
        ))}
      </BottomSheet>

      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
