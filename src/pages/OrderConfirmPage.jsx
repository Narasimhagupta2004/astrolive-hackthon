import { useState } from 'react';
import { Wallet, MapPin, CheckCircle2, Home, CalendarClock, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useCart } from '../state/CartContext';
import { freeGift } from '../data/appData';

const dayLabels = {
  any: 'Any day (fastest)',
  monday: 'Monday · Chandra',
  thursday: 'Thursday · Guru',
  friday: 'Friday · Shukra',
  saturday: 'Saturday · Shani'
};

function estimateDelivery(day) {
  const base = new Date();
  base.setDate(base.getDate() + 3);
  const map = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
  if (day !== 'any' && map[day] !== undefined) {
    while (base.getDay() !== map[day]) base.setDate(base.getDate() + 1);
  }
  return base.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

export function OrderConfirmPage({ onNavigate }) {
  const { items, subtotal, address, placeOrder, deliveryDay, giftUnlocked } = useCart();
  const [placed, setPlaced] = useState(null);

  const handlePlace = () => {
    const paidAmount = subtotal;
    const eta = estimateDelivery(deliveryDay);
    const id = placeOrder();
    setPlaced({ id, amount: paidAmount, eta });
  };

  if (placed) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Order Placed" onBack={() => onNavigate('shubh-kart')} />
        <main className="confirm-main">
          <div className="order-success">
            <div className="success-icon-wrap"><CheckCircle2 size={64} /></div>
            <h2>Order Placed!</h2>
            <p>Your order <strong>{placed.id}</strong> has been booked.</p>
            <div className="success-eta">
              <CalendarClock size={16} /> Estimated delivery: <strong>{placed.eta}</strong>
            </div>
            <p className="hint">Pay <strong>₹{placed.amount}</strong> in cash when it arrives at your door.</p>
            <p className="mantra-line"><Sparkles size={12} /> Aarti mantra & prasad blessing sent to your phone.</p>
            <div className="success-actions">
              <button className="primary-btn" onClick={() => onNavigate('shubh-kart')}>Back to Shop</button>
              <button className="ghost-btn" onClick={() => onNavigate('home')}><Home size={16} /> Home</button>
            </div>
            <small className="powered">Powered by Shubh Kart</small>
          </div>
        </main>
        <BottomNav active="shubh-kart" onNavigate={onNavigate} />
      </div>
    );
  }

  if (!address || items.length === 0) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Order Confirmation" onBack={() => onNavigate('cart')} />
        <main className="confirm-main">
          <div className="cart-empty">
            <h3>Nothing to confirm</h3>
            <p>Add items and a delivery address to place an order.</p>
            <button className="primary-btn" onClick={() => onNavigate('shubh-kart')}>Shop now</button>
          </div>
        </main>
        <BottomNav active="shubh-kart" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Order Confirmation" onBack={() => onNavigate('address')} />
      <main className="confirm-main">
        <section className="confirm-card">
          <header><MapPin size={16} /> Delivering to</header>
          <p><strong>{address.name}</strong> · {address.phone}</p>
          <p>{address.addressLine}, {address.city} — {address.pincode}</p>
          <p className="soft"><CalendarClock size={14} /> Preferred day: <strong>{dayLabels[deliveryDay]}</strong></p>
        </section>

        <section className="confirm-card">
          <header>Order Summary</header>
          {items.map((line) => (
            <div className="summary-row" key={line.productId}>
              <span>{line.product.name} × {line.qty}</span>
              <strong>₹{line.lineTotal}</strong>
            </div>
          ))}
          {giftUnlocked && (
            <div className="summary-row bonus">
              <span>Bonus: {freeGift.name} {freeGift.emoji}</span>
              <strong className="pos">FREE</strong>
            </div>
          )}
          <div className="summary-row total"><span>Total</span><strong>₹{subtotal}</strong></div>
        </section>

        <section className="confirm-card">
          <header>Payment Method</header>
          <label className="pay-method-card selected">
            <input type="radio" name="pay" checked readOnly />
            <Wallet size={22} />
            <div>
              <b>Cash on Delivery</b>
              <span>Pay ₹{subtotal} in cash when your order arrives.</span>
            </div>
          </label>
          <p className="pay-soon">More payment methods (UPI · Cards · Wallets) coming soon 🚀</p>
        </section>

        <button className="primary-btn full" onClick={handlePlace}>Place Order</button>
      </main>
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
