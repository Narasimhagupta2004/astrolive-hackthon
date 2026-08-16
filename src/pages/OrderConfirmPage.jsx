import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle, Home, CalendarClock, Sparkles, ShieldCheck, Lock, Wallet, ShoppingBag, RotateCcw, CreditCard } from 'lucide-react';
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
  const [failed, setFailed] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState('razorpay');

  const handleSubmit = async () => {
    if (subtotal <= 0) return;
    setError(null);
    setFailed(null);
    const amount = subtotal;
    const eta = estimateDelivery(deliveryDay);
    const provisionalOrderId = 'SK-' + Date.now().toString(36).toUpperCase();

    if (method === 'cod') {
      placeOrder();
      setPlaced({ id: provisionalOrderId, amount, eta, paymentId: null, method: 'cod' });
      return;
    }

    setPaying(true);
    try {
      const { paymentId } = await openCheckout({
        amount,
        orderId: provisionalOrderId,
        prefill: { name: address.name, phone: address.phone, email: address.email }
      });
      placeOrder();
      setPlaced({ id: provisionalOrderId, amount, eta, paymentId, method: 'razorpay' });
    } catch (err) {
      setFailed({
        id: provisionalOrderId,
        amount,
        reason: err?.message || 'Payment could not be completed',
        cancelled: err?.code === 'dismissed'
      });
    } finally {
      setPaying(false);
    }
  };

  if (failed) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Payment Failed" onBack={() => setFailed(null)} />
        <main className="confirm-main">
          <div className="order-success payment-failed">
            <div className="fail-icon-wrap"><XCircle size={64} /></div>
            <h2>{failed.cancelled ? 'Payment Cancelled' : 'Payment Failed'}</h2>
            <p>{failed.cancelled
              ? 'You closed the payment window before completing.'
              : 'We couldn\'t process your payment. Your card was not charged.'}</p>

            <div className="pay-receipt">
              <div className="row"><span>Reason</span><strong className="reason">{failed.reason}</strong></div>
              <div className="row"><span>Attempted amount</span><strong>₹{failed.amount}</strong></div>
              <div className="row"><span>Order reference</span><strong>{failed.id}</strong></div>
            </div>

            <p className="fail-hint">💡 Your items are still safe in the cart — nothing was ordered yet.</p>

            <div className="success-actions">
              <button className="primary-btn" onClick={() => { setFailed(null); handleSubmit(); }}>
                <RotateCcw size={16} /> Try Again
              </button>
              <button className="ghost-btn" onClick={() => { setFailed(null); setMethod('cod'); }}>
                <CreditCard size={16} /> Change Method
              </button>
            </div>
            <small className="powered">Powered by AstroLive · Secured by Razorpay</small>
          </div>
        </main>
        <BottomNav active="shubh-kart" onNavigate={onNavigate} />
      </div>
    );
  }

  if (placed) {
    const paidByCard = placed.method === 'razorpay';
    return (
      <div className="app-screen">
        <AppHeader variant="back" title={paidByCard ? 'Payment Successful' : 'Order Placed'} onBack={() => onNavigate('shubh-kart')} />
        <main className="confirm-main">
          <div className="order-success payment-success">
            <div className="confetti" aria-hidden>
              {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}
            </div>
            <div className="success-icon-wrap"><CheckCircle2 size={64} /></div>
            <h2>{paidByCard ? 'Payment Successful!' : 'Order Placed!'}</h2>
            <p>Thank you, <strong>{address?.name?.split(' ')[0] || 'friend'}</strong> — your order is confirmed.</p>

            <div className="pay-receipt">
              <div className="row"><span>{paidByCard ? 'Amount paid' : 'Amount due on delivery'}</span><strong>₹{placed.amount}</strong></div>
              <div className="row"><span>Order ID</span><strong>{placed.id}</strong></div>
              {placed.paymentId && (
                <div className="row"><span>Payment ID</span><strong className="mono">{placed.paymentId}</strong></div>
              )}
              <div className="row"><span>Payment method</span><strong>{paidByCard ? 'Razorpay' : 'Cash on Delivery'}</strong></div>
              <div className="row"><span>Estimated delivery</span><strong>{placed.eta}</strong></div>
            </div>

            <p className="mantra-line"><Sparkles size={12} /> Aarti mantra & prasad blessing sent to your phone.</p>

            <div className="success-actions">
              <button className="primary-btn" onClick={() => onNavigate('shubh-kart')}><ShoppingBag size={16} /> Continue Shopping</button>
              <button className="ghost-btn" onClick={() => onNavigate('home')}><Home size={16} /> Home</button>
            </div>
            <small className="powered">Powered by AstroLive{paidByCard ? ' · Secured by Razorpay' : ''}</small>
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

  const isCod = method === 'cod';
  const ctaDisabled = paying || (method === 'razorpay' && !isConfigured());
  const ctaLabel = paying
    ? 'Opening secure checkout…'
    : isCod
      ? `Place Order · Pay ₹${subtotal} on Delivery`
      : `Pay ₹${subtotal} Securely`;

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

          <label className={`method-card ${method === 'razorpay' ? 'selected' : ''}`}>
            <input type="radio" name="pay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />
            <div className="method-body rzp-card">
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
          </label>

          <label className={`method-card cod ${method === 'cod' ? 'selected' : ''}`}>
            <input type="radio" name="pay" checked={method === 'cod'} onChange={() => setMethod('cod')} />
            <div className="method-body cod-body">
              <Wallet size={22} />
              <div>
                <b>Cash on Delivery</b>
                <span>Pay ₹{subtotal} in cash when your order arrives.</span>
              </div>
              <div className="cod-badge">No account needed</div>
            </div>
          </label>

          {method === 'razorpay' && !isConfigured() && (
            <p className="pay-warn">⚠️ Add your Razorpay Test Key ID in <code>src/config/razorpay.js</code> before paying.</p>
          )}
        </section>

        <button className={`primary-btn full ${isCod ? '' : 'pay-btn'}`} onClick={handleSubmit} disabled={ctaDisabled}>
          {isCod ? <Wallet size={16} /> : <Lock size={14} />} {ctaLabel}
        </button>
        <p className="pay-footnote">
          {isCod
            ? 'Our delivery agent will collect cash on arrival.'
            : "You'll be redirected to Razorpay's secure payment window."}
        </p>
      </main>
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
