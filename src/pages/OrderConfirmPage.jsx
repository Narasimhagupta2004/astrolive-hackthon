import { useState } from 'react';
import { MapPin, CheckCircle2, Home, CalendarClock, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useCart } from '../state/CartContext';
import { freeGift } from '../data/appData';
import { openCheckout, isConfigured } from '../utils/razorpay';

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
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (subtotal <= 0) return;
    setError(null);
    setPaying(true);
    const amount = subtotal;
    const eta = estimateDelivery(deliveryDay);
    const provisionalOrderId = 'SK-' + Date.now().toString(36).toUpperCase();
    try {
      const { paymentId } = await openCheckout({
        amount,
        orderId: provisionalOrderId,
        prefill: { name: address.name, phone: address.phone }
      });
      placeOrder(); // clears cart; we already have amount/eta captured
      setPlaced({ id: provisionalOrderId, amount, eta, paymentId });
    } catch (err) {
      setError(err?.message || 'Payment could not be completed');
    } finally {
      setPaying(false);
    }
  };

  if (placed) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Payment Successful" onBack={() => onNavigate('shubh-kart')} />
        <main className="confirm-main">
          <div className="order-success payment-success">
            <div className="confetti" aria-hidden>
              {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}
            </div>
            <div className="success-icon-wrap"><CheckCircle2 size={64} /></div>
            <h2>Payment Successful!</h2>
            <p>Thank you, <strong>{address?.name?.split(' ')[0] || 'friend'}</strong> — your order is confirmed.</p>

            <div className="pay-receipt">
              <div className="row"><span>Amount paid</span><strong>₹{placed.amount}</strong></div>
              <div className="row"><span>Order ID</span><strong>{placed.id}</strong></div>
              <div className="row"><span>Payment ID</span><strong className="mono">{placed.paymentId}</strong></div>
              <div className="row"><span>Estimated delivery</span><strong>{placed.eta}</strong></div>
            </div>

            <p className="mantra-line"><Sparkles size={12} /> Aarti mantra & prasad blessing sent to your phone.</p>

            <div className="success-actions">
              <button className="primary-btn" onClick={() => onNavigate('shubh-kart')}>Back to Shop</button>
              <button className="ghost-btn" onClick={() => onNavigate('home')}><Home size={16} /> Home</button>
            </div>
            <small className="powered">Powered by Shubh Kart · Secured by Razorpay</small>
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
          <div className="rzp-card">
            <div className="rzp-brand">
              <div className="rzp-logo">R</div>
              <div>
                <b>Razorpay Secure Checkout</b>
                <span>UPI · Cards · Netbanking · Wallets</span>
              </div>
              <div className="rzp-badge"><ShieldCheck size={14} /> Secure</div>
            </div>
            <div className="rzp-methods">
              <span>UPI</span><span>VISA</span><span>Mastercard</span><span>RuPay</span><span>Netbanking</span><span>Paytm</span>
            </div>
          </div>
          {!isConfigured() && (
            <p className="pay-warn">⚠️ Add your Razorpay Test Key ID in <code>src/config/razorpay.js</code> before paying.</p>
          )}
          {error && <p className="pay-warn">⚠️ {error}</p>}
        </section>

        <button className="primary-btn full pay-btn" onClick={handlePay} disabled={paying || !isConfigured()}>
          <Lock size={14} /> {paying ? 'Opening secure checkout…' : `Pay ₹${subtotal} Securely`}
        </button>
        <p className="pay-footnote">You'll be redirected to Razorpay's secure payment window.</p>
      </main>
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
