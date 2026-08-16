import { ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../state/CartContext';
import { useSession } from '../../state/SessionContext';

export function RecentlyViewed({ onNavigate }) {
  const { recentProducts } = useSession();
  const { count, subtotal } = useCart();

  const hasRecent = recentProducts.length > 0;
  const hasCart = count > 0;
  if (!hasRecent && !hasCart) return null;

  return (
    <section className="recent-section" aria-label="Recently viewed">
      {hasRecent && (
        <>
          <div className="section-heading">
            <h2>Recently viewed</h2>
            <button onClick={() => onNavigate('shubh-kart')}>
              See all <ChevronRight size={14} />
            </button>
          </div>

          <div className="recent-rail">
            {recentProducts.map((p) => (
              <button key={p.id} className="recent-card" onClick={() => onNavigate('shubh-kart')}>
                <span className="recent-pic" style={{ backgroundImage: `url(${p.image})` }}>
                  {p.tag && <span className="recent-tag">{p.tag}</span>}
                </span>
                <strong className="recent-name">{p.name}</strong>
                <span className="recent-rating">
                  <Star size={10} fill="currentColor" strokeWidth={0} /> {p.rating}
                </span>
                <span className="recent-price">
                  ₹{p.price}
                  {p.oldPrice && <s>₹{p.oldPrice}</s>}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {hasCart && (
        <button className="resume-card" onClick={() => onNavigate('cart')}>
          <span className="resume-avatar cart">
            <ShoppingBag size={22} />
          </span>
          <span className="resume-info">
            <strong>Your cart is waiting</strong>
            <span className="resume-meta">
              {count} {count === 1 ? 'item' : 'items'} · ₹{subtotal}
            </span>
          </span>
          <span className="resume-action">
            <ShoppingBag size={13} /> Checkout
          </span>
        </button>
      )}
    </section>
  );
}
