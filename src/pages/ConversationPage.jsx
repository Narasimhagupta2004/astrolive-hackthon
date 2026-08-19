import { useEffect, useRef, useState } from 'react';
import { Send, Phone } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { rashis } from '../data/appData';

const REPLIES = [
  'Let me check that against your chart before I answer properly.',
  'That aligns with what Guru is doing in your ninth house right now.',
  'Give it until the next full moon — the timing matters more than the choice.',
  'I would hold off on any signing until Wednesday.'
];

function seedThread(name) {
  return [
    { id: 1, from: 'them', text: 'Namaste 🙏 I have your chart open now.' },
    { id: 2, from: 'me', text: 'Thank you! I wanted to ask about my career this year.' },
    { id: 3, from: 'them', text: 'Shani is transiting your tenth house — a slow climb, but a solid one. Nothing collapses this year.' }
  ];
}

export function ConversationPage({ onNavigate, target }) {
  const person = target?.person;
  const back = target?.from || 'chat';
  const [messages, setMessages] = useState(() => seedThread(person?.name));
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, typing]);

  if (!person) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Consultation" onBack={() => onNavigate('chat')} />
        <main className="cv-main">
          <div className="cc-empty">
            <h3>No consultation open</h3>
            <p>Pick an astrologer to start a reading.</p>
            <button className="primary-btn full" onClick={() => onNavigate('chat')}>Browse astrologers</button>
          </div>
        </main>
        <BottomNav active="chat" onNavigate={onNavigate} />
      </div>
    );
  }

  const rashi = rashis.find((r) => r.id === person.rashi);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text }]);
    setDraft('');
    setTyping(true);
    const reply = REPLIES[replyIdx.current % REPLIES.length];
    replyIdx.current += 1;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'them', text: reply }]);
    }, 1100);
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title={person.name} onBack={() => onNavigate(back)} />
      <main className="cv-main">
        <div className="cv-who">
          <span className="cv-who-pic">
            <img src={person.image} alt="" />
            {person.isOnline && <i className="online-dot" />}
          </span>
          <div>
            <b>{person.name}</b>
            <small>{person.isOnline ? 'Online now' : 'Offline'}{rashi ? ` · ${rashi.label}` : ''}</small>
          </div>
          <button className="cv-call" onClick={() => onNavigate('call', { person, from: 'conversation' })}>
            <Phone size={15} /> Call
          </button>
        </div>

        <div className="cv-thread">
          {messages.map((m) => (
            <div key={m.id} className={`cv-msg ${m.from === 'me' ? 'mine' : 'theirs'}`}>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="cv-msg theirs cv-typing"><i /><i /><i /></div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      <form className="cv-composer" onSubmit={send}>
        <input
          type="text"
          placeholder={`Message ${person.name.split(' ')[0]}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" aria-label="Send" disabled={!draft.trim()}>
          <Send size={17} />
        </button>
      </form>

      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
