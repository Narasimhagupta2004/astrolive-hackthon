import { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, PhoneOff, MessageCircle } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { rashis } from '../data/appData';

function clock(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function CallPage({ onNavigate, target }) {
  const person = target?.person;
  const back = target?.from || 'connected';
  const [phase, setPhase] = useState('ringing');
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    if (!person) return undefined;
    const t = setTimeout(() => setPhase('live'), 2200);
    return () => clearTimeout(t);
  }, [person]);

  useEffect(() => {
    if (phase !== 'live') return undefined;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  if (!person) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Call" onBack={() => onNavigate('connected')} />
        <main className="cl-main">
          <div className="cc-empty">
            <h3>No call in progress</h3>
            <p>Start a call from one of your connected users.</p>
            <button className="primary-btn full" onClick={() => onNavigate('connected')}>My users</button>
          </div>
        </main>
        <BottomNav active="menu" onNavigate={onNavigate} />
      </div>
    );
  }

  const rashi = rashis.find((r) => r.id === person.rashi);
  const status = phase === 'ringing' ? 'Ringing…' : phase === 'ended' ? 'Call ended' : clock(secs);

  const end = () => {
    setPhase('ended');
    setTimeout(() => onNavigate(back), 900);
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Voice reading" onBack={() => onNavigate(back)} />
      <main className="cl-main">
        <div className={`cl-stage${phase === 'ringing' ? ' ringing' : ''}`}>
          <span className="cl-avatar">
            <img src={person.image} alt={person.name} />
          </span>
          <h2>{person.name}</h2>
          {rashi && <p className="cl-rashi">{rashi.symbol} {rashi.label}</p>}
          <p className={`cl-status${phase === 'live' ? ' live' : ''}`}>{status}</p>

          {phase === 'live' && (
            <div className="cl-rec" role="status">
              <i aria-hidden />
              <span>Recording this call</span>
            </div>
          )}
          {phase === 'live' && (
            <small className="cl-rec-note">Saved to your consultation history for 30 days.</small>
          )}
        </div>

        <div className="cl-controls">
          <button
            className={`cl-ctl${muted ? ' on' : ''}`}
            onClick={() => setMuted((v) => !v)}
            aria-pressed={muted}
          >
            {muted ? <MicOff size={20} /> : <Mic size={20} />}
            <small>{muted ? 'Unmute' : 'Mute'}</small>
          </button>

          <button className="cl-ctl end" onClick={end} aria-label="End call">
            <PhoneOff size={22} />
            <small>End</small>
          </button>

          <button
            className={`cl-ctl${speaker ? ' on' : ''}`}
            onClick={() => setSpeaker((v) => !v)}
            aria-pressed={speaker}
          >
            <Volume2 size={20} />
            <small>Speaker</small>
          </button>
        </div>

        <button
          className="ghost-btn cc-wide"
          onClick={() => onNavigate('conversation', { person, from: back })}
        >
          <MessageCircle size={15} /> Switch to chat
        </button>
      </main>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
