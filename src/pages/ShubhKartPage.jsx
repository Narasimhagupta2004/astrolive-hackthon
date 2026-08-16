import { useState } from 'react';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSheet } from '../components/shop/ProductSheet';
import { RashiPicker } from '../components/shop/RashiPicker';
import { IntentChips } from '../components/shop/IntentChips';
import { shubhKartProducts, featuredCollection } from '../data/appData';
import { useCart } from '../state/CartContext';
import { useSession } from '../state/SessionContext';

const categories = ['Sacred Items', 'Pooja & Remedies'];

export function ShubhKartPage({ onNavigate }) {
  const { count, subtotal, intent, rashi } = useCart();
  const { viewProduct } = useSession();
  const [activeProduct, setActiveProduct] = useState(null);

  const openProduct = (product) => {
    setActiveProduct(product);
    viewProduct(product);
  };

  const matches = (p) => intent === 'all' || (p.intents && p.intents.includes(intent));
  const filtered = shubhKartProducts.filter(matches);
  const forYouFirst = (a, b) => {
    if (!rashi) return 0;
    const ay = a.rashis?.includes(rashi) ? -1 : 0;
    const by = b.rashis?.includes(rashi) ? -1 : 0;
    return ay - by;
  };

  const featuredProducts = featuredCollection.productIds
    .map((id) => shubhKartProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="app-screen">
      <AppHeader variant="home" showCart onCart={() => onNavigate('cart')} />
      <main className="shop-main">
        <div className="shop-hero">
          <div>
            <small>SHUBH KART · COD AVAILABLE</small>
            <h1>Sacred picks,<br />chosen by the stars.</h1>
            <p>Personalised to your rashi · Blessed by our pandits</p>
          </div>
        </div>

        <RashiPicker />
        <IntentChips />

        <section className="featured-collection">
          <div className="fc-head">
            <div>
              <small>FEATURED THIS MONTH</small>
              <h2>{featuredCollection.title}</h2>
              <p>{featuredCollection.subtitle}</p>
            </div>
          </div>
          <div className="fc-strip">
            {featuredProducts.map((p) => (
              <button key={p.id} className="fc-tile" onClick={() => openProduct(p)} style={{ backgroundImage: `url(${p.image})` }}>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </section>

        {categories.map((cat) => {
          const inCat = filtered.filter((p) => p.category === cat).sort(forYouFirst);
          if (!inCat.length) return null;
          return (
            <section key={cat} className="shop-section">
              <div className="section-heading">
                <h2>{cat}</h2>
                <span className="section-count">{inCat.length} items</span>
              </div>
              <div className="product-grid">
                {inCat.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={openProduct} />
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-filter">
            <p>No products match this intent yet.</p>
            <button className="ghost-btn" onClick={() => window.location.reload()}>Reset filter</button>
          </div>
        )}
      </main>

      <ProductSheet product={activeProduct} open={!!activeProduct} onClose={() => setActiveProduct(null)} />

      {count > 0 && (
        <button className="cart-pill" onClick={() => onNavigate('cart')}>
          <ShoppingCart size={18} />
          <span>{count} item{count > 1 ? 's' : ''} · ₹{subtotal}</span>
          <em>View Cart <ChevronRight size={14} /></em>
        </button>
      )}
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
