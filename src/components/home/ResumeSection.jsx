import { MessageCircle } from 'lucide-react';
import { useSession } from '../../state/SessionContext';
import { timeAgo } from '../../utils/time';

export function ResumeSection({ onNavigate }) {
  const { recentSessions } = useSession();
  if (!recentSessions.length) return null;

  return (
    <section className="resume-section" aria-label="Continue your consultation">
      <div className="section-heading">
        <h2>Continue your consultation</h2>
      </div>

      {recentSessions.map((s) => (
        <button key={s.astrologerId} className="resume-card" onClick={() => onNavigate('chat')}>
          <span className="resume-avatar">
            <img src={s.astrologer.image} alt={s.astrologer.name} />
            {s.astrologer.isOnline && <i className="online-dot" />}
          </span>
          <span className="resume-info">
            <strong>{s.astrologer.name}</strong>
            <span className="resume-meta">
              {s.mode === 'call' ? 'Call' : 'Chat'} · {timeAgo(s.startedAt)}
            </span>
          </span>
          <span className="resume-action">
            <MessageCircle size={13} /> Resume
          </span>
        </button>
      ))}
    </section>
  );
}
