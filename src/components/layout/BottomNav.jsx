import { Hop as Home, MessageCircle, Orbit, ShoppingBag, CircleUser as UserCircle, Users } from 'lucide-react';
import { useSession } from '../../state/SessionContext';

const baseItems = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'chat', label: 'Chat', Icon: MessageCircle },
  { id: 'hub', label: 'AstroHub', Icon: Orbit },
  { id: 'shubh-kart', label: 'Shubh Kart', Icon: ShoppingBag },
  { id: 'menu', label: 'Menu', Icon: UserCircle }
];

const myUsersItem = { id: 'connected', label: 'My Users', Icon: Users };

export function BottomNav({ active, onNavigate }) {
  const { astrologerMode } = useSession();
  const items = astrologerMode
    ? [...baseItems.slice(0, 4), myUsersItem, baseItems[4]]
    : baseItems;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={active === id ? 'active' : ''}
          onClick={() => onNavigate(id === 'menu' ? 'settings' : id)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
