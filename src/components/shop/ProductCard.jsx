import { Plus, Minus, Star, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../../state/CartContext';

export function ProductCard({ product, onOpen }) {
  const { items, add, setQty, isFav, toggleFav, rashi } = useCart();
  const line = items.find((it) => it.productId === product.id);
  const fav = isFav(product.id);
  const isForYou = rashi && product.rashis?.includes(rashi);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className={`product-card ${isForYou ? 'for-you' : ''}`}>
      <div className="product-thumb-wrap">
        <button className="product-thumb-btn" onClick={() => onOpen?.(product)} style={{ backgroundImage: `url(${product.image})` }} aria-label={`View ${product.name}`}>
          {discount > 0 && <span className="discount-tag">{discount}% OFF</span>}
          {product.tag && <span className="product-tag">{product.tag}</span>}
          {product.rating && <span className="rating-pill"><Star size={10} fill="currentColor" /> {product.rating}</span>}
          {isForYou && <span className="for-you-tag"><Sparkles size={10} /> For You</span>}
        </button>
        <button
          className={`fav-btn ${fav ? 'on' : ''}`}
          aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }}
        >
          <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-body">
        <b className="product-name">{product.name}</b>
        <span className="product-cat">{product.category}</span>
        <div className="product-footer">
          <div className="price-block">
            <strong>₹{product.price}</strong>
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
          </div>
          {line ? (
            <div className="qty-control">
              <button aria-label="Decrease" onClick={() => setQty(product.id, line.qty - 1)}><Minus size={14} /></button>
              <span>{line.qty}</span>
              <button aria-label="Increase" onClick={() => setQty(product.id, line.qty + 1)}><Plus size={14} /></button>
            </div>
          ) : (
            <button className="add-btn" onClick={() => add(product)}><Plus size={14} /> Add</button>
          )}
        </div>
      </div>
    </article>
  );
}
