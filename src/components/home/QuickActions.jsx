import { MessageCircle, Phone } from 'lucide-react';

export function QuickActions({ onChat, onCall }) {
  return (
    <div className="quick-actions">
      <button onClick={onChat}><MessageCircle size={18} /> Chat</button>
      <button onClick={onCall}><Phone size={18} /> Call</button>
    </div>
  );
}
