import { Hop as Home, MessageCircle, Orbit, Phone, CircleUser as UserCircle } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'chat', label: 'Chat', Icon: MessageCircle },
  { id: 'hub', label: 'AstroHub', Icon: Orbit },
  { id: 'call', label: 'Call', Icon: Phone },
  { id: 'menu', label: 'Menu', Icon: UserCircle }
];

export function BottomNav({ active, onNavigate }) {
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
