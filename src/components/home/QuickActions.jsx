import { MessageCircle, ShoppingBag } from 'lucide-react';

export function QuickActions({ onChat, onShop }) {
  return (
    <div className="quick-actions">
      <button onClick={onChat}><MessageCircle size={18} /> Chat</button>
      <button onClick={onShop}><ShoppingBag size={18} /> Shop</button>
    </div>
  );
}
