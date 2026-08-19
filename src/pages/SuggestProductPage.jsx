import { useState } from 'react';
import { Check, CheckCircle2, Star } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { shubhKartProducts } from '../data/appData';
import { useSession } from '../state/SessionContext';

export function SuggestProductPage({ onNavigate, target }) {
  const person = target?.person;
  const back = target?.from || 'connected';
  const { viewProduct } = useSession();
  const [sent, setSent] = useState(null);

  if (!person) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Suggest a product" onBack={() => onNavigate('connected')} />
        <main className="sg-main">
          <div className="cc-empty">
            <h3>Nobody selected</h3>
            <p>Choose a connected user first, then suggest a remedy for them.</p>
            <button className="primary-btn full" onClick={() => onNavigate('connected')}>My users</button>
          </div>
        </main>
        <BottomNav active="menu" onNavigate={onNavigate} />
      </div>
    );
  }

  const share = (product) => {
    viewProduct(product);
    setSent(product);
  };

  if (sent) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Suggestion sent" onBack={() => onNavigate(back)} />
        <main className="sg-main">
          <div className="order-success payment-success">
            <span className="sg-tick"><CheckCircle2 size={40} /></span>
            <h2>Sent to {person.name}</h2>
            <p>They&apos;ll see <b>{sent.name}</b> in their chat with a note that you recommended it.</p>

            <div className="confirm-card sg-card">
              <header>What you shared</header>
              <div className="sg-row">
                <span className="sg-pic" style={{ backgroundImage: `url(${sent.image})` }} />
                <span className="sg-row-info">
                  <b>{sent.name}</b>
                  <small>{sent.category}</small>
                </span>
                <span className="sg-price">₹{sent.price}</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="primary-btn" onClick={() => onNavigate(back)}>Done</button>
              <button className="ghost-btn" onClick={() => setSent(null)}>Suggest another</button>
            </div>
          </div>
        </main>
        <BottomNav active="menu" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Suggest a product" onBack={() => onNavigate(back)} />
      <main className="sg-main">
        <p className="sg-note">
          Pick a remedy to recommend to <b>{person.name}</b>. They receive it as a message, not an order.
        </p>

        {shubhKartProducts.map((p) => (
          <article className="sg-item" key={p.id}>
            <span className="sg-pic" style={{ backgroundImage: `url(${p.image})` }} />
            <div className="sg-item-info">
              <b>{p.name}</b>
              <small>{p.category}</small>
              <span className="sg-item-meta">
                <span className="sg-rating"><Star size={10} fill="currentColor" strokeWidth={0} /> {p.rating}</span>
                <span className="sg-price">₹{p.price}</span>
              </span>
            </div>
            <button className="sg-share" onClick={() => share(p)}>
              <Check size={14} /> Share
            </button>
          </article>
        ))}
      </main>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
