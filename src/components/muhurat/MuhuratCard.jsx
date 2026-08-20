import { CalendarDays, Clock, Star, Sparkles } from 'lucide-react';

const RATING_STYLE = {
  Excellent: { className: 'excellent', emoji: '⭐' },
  Good: { className: 'good', emoji: '✨' },
  Auspicious: { className: 'auspicious', emoji: '🌙' }
};

export function MuhuratCard({ window, index }) {
  const style = RATING_STYLE[window.rating] || RATING_STYLE.Auspicious;
  return (
    <article className={`muhurat-card ${style.className}`}>
      <header className="mc-header">
        <span className={`mc-rating ${style.className}`}>
          {style.emoji} {window.rating}
        </span>
        <span className="mc-index">#{index + 1}</span>
      </header>

      <div className="mc-date">
        <CalendarDays size={16} />
        <b>{window.dateLabel}</b>
      </div>

      <div className="mc-time">
        <Clock size={16} />
        <b>{window.timeWindow}</b>
      </div>

      <div className="mc-meta">
        <span><Sparkles size={11} /> {window.nakshatra} nakshatra</span>
        <span><Star size={11} /> {window.hora} hora</span>
        <span>· {window.tithi}</span>
      </div>

      <p className="mc-reason">{window.reason}</p>
    </article>
  );
}
