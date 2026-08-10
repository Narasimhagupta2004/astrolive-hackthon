import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../state/CartContext';

export function CartLineItem({ line }) {
  const { setQty, remove } = useCart();
  const { product, qty, lineTotal } = line;

  return (
    <div className="cart-line">
      <img src={product.image} alt={product.name} />
      <div className="cart-line-body">
        <b>{product.name}</b>
        <span>₹{product.price} each</span>
        <div className="cart-line-controls">
          <div className="qty-control small">
            <button aria-label="Decrease" onClick={() => setQty(product.id, qty - 1)}><Minus size={12} /></button>
            <span>{qty}</span>
            <button aria-label="Increase" onClick={() => setQty(product.id, qty + 1)}><Plus size={12} /></button>
          </div>
          <strong>₹{lineTotal}</strong>
          <button className="line-remove" aria-label="Remove" onClick={() => remove(product.id)}><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}
