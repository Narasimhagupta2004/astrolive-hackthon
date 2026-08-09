import { MessageCircle } from 'lucide-react';
import { advisors } from '../../data/appData';

export function AdvisorCard({ advisor, onChat }) {
  return (
    <article className="advisor-card">
      <div className="advisor-pic">
        <img src={advisor.image} alt={advisor.name} />
        <i className="online-dot" />
      </div>
      <div className="advisor-info">
        <div className="advisor-title-row">
          <h3>{advisor.name}</h3>
          <span>Exp: {advisor.experience}</span>
        </div>
        <label className="advisor-skill">Tarot</label>
        <p className="advisor-langs">{advisor.languages}</p>
        {advisor.orders && <span className="advisor-orders">{advisor.orders}</span>}
        <div className="advisor-bottom">
          <div className="advisor-rating">★★★★★</div>
          <strong>{advisor.price}</strong>
          <button onClick={() => onChat(advisor)}><MessageCircle size={14} /> Chat</button>
        </div>
      </div>
    </article>
  );
}
