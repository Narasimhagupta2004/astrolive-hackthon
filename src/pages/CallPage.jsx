import { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, PhoneOff, MessageCircle } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { rashis, FOLLOWUP_CALL_SECS } from '../data/appData';

function clock(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function CallPage({ onNavigate, target }) {
  const person = target?.person;
  const back = target?.from || 'connected';
  // A call placed from My Users is a follow-up, so it runs on the free 2-minute
  // cap. A call started anywhere else is a normal paid reading.
  const isFollowUp = back === 'connected';
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

  // The cap is enforced here, not left to the astrologer to honour.
  useEffect(() => {
    if (!isFollowUp || phase !== 'live' || secs < FOLLOWUP_CALL_SECS) return;
    setPhase('ended');
  }, [isFollowUp, phase, secs]);

  // Leaving is the same whether the astrologer hung up or the free follow-up ran
  // out, so both paths only set the phase and this handles the exit.
  useEffect(() => {
    if (phase !== 'ended') return undefined;
    const t = setTimeout(() => onNavigate(back), 1200);
    return () => clearTimeout(t);
  }, [phase, onNavigate, back]);

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
  const left = Math.max(0, FOLLOWUP_CALL_SECS - secs);
  const ended = isFollowUp && left === 0 ? 'Free follow-up ended' : 'Call ended';
  const status = phase === 'ringing' ? 'Ringing…' : phase === 'ended' ? ended : clock(secs);

  const end = () => setPhase('ended');

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

          {isFollowUp && phase !== 'ended' && (
            <p className={`cl-cap${left <= 30 && phase === 'live' ? ' low' : ''}`}>
              Free follow-up · {phase === 'live' ? `${clock(left)} left` : `${clock(FOLLOWUP_CALL_SECS)} limit`}
            </p>
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
