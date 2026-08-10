import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../state/CartContext';

export function CartBadge({ onClick }) {
  const { count } = useCart();
  return (
    <button className="icon-btn cart-badge" aria-label={`Cart (${count} items)`} onClick={onClick}>
      <ShoppingBag size={21} />
      {count > 0 && <em>{count}</em>}
    </button>
  );
}
