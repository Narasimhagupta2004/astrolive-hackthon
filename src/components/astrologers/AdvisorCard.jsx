import { MessageCircle } from 'lucide-react';

function formatOrders(n) {
  if (!n) return null;
  return n >= 1000 ? `(${(n / 1000).toFixed(1)}k Orders)` : `(${n} Orders)`;
}

export function AdvisorCard({ advisor, onChat }) {
  const orders = formatOrders(advisor.orders);

  return (
    <article className="advisor-card">
      <div className="advisor-pic">
        <img src={advisor.image} alt={advisor.name} />
        {advisor.isOnline && <i className="online-dot" />}
      </div>
      <div className="advisor-info">
        <div className="advisor-title-row">
          <h3>{advisor.name}</h3>
          <span>Exp: {advisor.experienceYears}Yrs</span>
        </div>
        <label className="advisor-skill">{advisor.skills.join(' · ')}</label>
        <p className="advisor-langs">{advisor.languages.join(' · ')}</p>
        {orders && <span className="advisor-orders">{orders}</span>}
        <div className="advisor-bottom">
          <div className="advisor-rating">★ {advisor.rating}</div>
          <strong>₹{advisor.ratePerMin}/min</strong>
          <button onClick={() => onChat(advisor)}><MessageCircle size={14} /> Chat</button>
        </div>
      </div>
    </article>
  );
}
