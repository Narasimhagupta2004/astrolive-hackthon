import { Plus, Minus, CheckCircle2, Heart } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { useCart } from '../../state/CartContext';

export function ProductSheet({ product, open, onClose }) {
  const { items, add, setQty, isFav, toggleFav } = useCart();
  if (!product) return null;
  const line = items.find((it) => it.productId === product.id);
  const fav = isFav(product.id);

  return (
    <BottomSheet open={open} onClose={onClose} title={product.name}>
      <div className="ps-hero" style={{ backgroundImage: `url(${product.image})` }}>
        <div className="ps-hero-scrim">
          {product.tag && <span className="product-tag">{product.tag}</span>}
          <button
            className={`ps-fav ${fav ? 'on' : ''}`}
            aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleFav(product.id)}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="ps-priceline">
        <strong>₹{product.price}</strong>
        {product.oldPrice && <span className="old">₹{product.oldPrice}</span>}
        {product.oldPrice && <em className="off">{Math.round((1 - product.price / product.oldPrice) * 100)}% OFF</em>}
      </div>

      <div className="ps-meta">
        <div className="ps-meta-row">
          <span className="ps-meta-key">Category</span>
          <span>{product.category}</span>
        </div>
        <div className="ps-meta-row">
          <span className="ps-meta-key">Best worn on</span>
          <span>{product.bestDay} <em>({product.bestDayHint})</em></span>
        </div>
        <div className="ps-meta-row">
          <span className="ps-meta-key">Mantra</span>
          <span className="mantra">{product.mantra}</span>
        </div>
      </div>

      <h4 className="ps-h">Benefits</h4>
      <ul className="ps-benefits">
        {product.benefits.map((b) => (
          <li key={b}><CheckCircle2 size={14} /> {b}</li>
        ))}
      </ul>

      <div className="ps-cta-row">
        {line ? (
          <div className="qty-control large">
            <button aria-label="Decrease" onClick={() => setQty(product.id, line.qty - 1)}><Minus size={16} /></button>
            <span>{line.qty} in cart</span>
            <button aria-label="Increase" onClick={() => setQty(product.id, line.qty + 1)}><Plus size={16} /></button>
          </div>
        ) : (
          <button className="primary-btn full" onClick={() => { add(product); }}>
            <Plus size={16} /> Add to Cart · ₹{product.price}
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
