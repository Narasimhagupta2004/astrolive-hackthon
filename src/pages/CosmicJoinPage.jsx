import { useEffect, useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { QuizBlock } from '../components/cosmic/QuizBlock';
import { SignEcho } from '../components/cosmic/SignEcho';
import { cosmicQuestions } from '../data/cosmicQuiz';
import { ymdFromInput, signFromYmd } from '../data/cosmicSigns';
import { rashis } from '../data/appData';
import { useCosmic } from '../state/CosmicContext';

const joinFailures = {
  'room-full': {
    title: 'This room is already taken',
    body: 'Someone already answered in this room. Ask them for a fresh link.'
  },
  'join-failed': {
    title: 'We could not reach the room',
    body: 'Something went wrong on the way to the server. Check your connection and try again.'
  },
  fallback: {
    title: 'This cosmic link is broken',
    body: 'We could not find that room. Ask them to resend the link.'
  }
};

export function CosmicJoinPage({ onNavigate }) {
  const { partner, code, broken, loadRoom, submitAsGuest, clearPending } = useCosmic();
  const [form, setForm] = useState({ name: '', dob: '' });
  const [answers, setAnswers] = useState([null, null, null]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);

  useEffect(() => {
    if (code && !partner) loadRoom(code);
  }, [code, partner, loadRoom]);

  const ymd = ymdFromInput(form.dob);
  const sign = signFromYmd(ymd);
  const isValid = form.name.trim().length > 0 && ymd !== null && answers.every((v) => v !== null);

  const setAnswer = (i, v) => setAnswers((prev) => prev.map((p, j) => (j === i ? v : p)));

  const leave = () => {
    clearPending();
    onNavigate('home');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isValid || busy) return;
    setBusy(true);
    const res = await submitAsGuest({ name: form.name.trim().slice(0, 24), ymd, answers });
    setBusy(false);
    if (res.ok) {
      onNavigate('cc-reveal');
      return;
    }
    setFailure(joinFailures[res.reason] || joinFailures.fallback);
  };

  if (broken || failure) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Cosmic Chemistry" onBack={leave} />
        <main className="cc-main">
          <div className="cc-empty">
            <h3>{failure ? failure.title : 'This cosmic link is broken'}</h3>
            <p>{failure ? failure.body : 'The room has expired, or the link was cut short when it was shared.'}</p>
            <button className="primary-btn full" onClick={() => onNavigate('cc-start')}>Start your own</button>
            <button className="ghost-btn cc-wide" onClick={leave}>Explore AstroLive</button>
          </div>
        </main>
        <BottomNav active="hub" onNavigate={onNavigate} />
      </div>
    );
  }

  const partnerSign = partner ? signFromYmd(partner.ymd) : null;
  const partnerRashi = partnerSign ? rashis.find((r) => r.id === partnerSign) : null;

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Cosmic Chemistry" onBack={leave} />
      <main className="cc-main cc-join-main">
        <div className="cc-invite">
          {partnerRashi && <span className="cc-invite-sym">{partnerRashi.symbol}</span>}
          <h2>{partner ? `${partner.name} wants to test your cosmic chemistry` : 'Someone wants to test your cosmic chemistry'}</h2>
          {partnerSign && <SignEcho sign={partnerSign} />}
          <p>Answer the same 3 questions. You won't see their answers until the reveal.</p>
        </div>

        <form className="address-form" onSubmit={submit}>
          <label className="field">
            <span>Your name</span>
            <input
              type="text"
              maxLength={24}
              placeholder="What should we call you?"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Date of birth</span>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </label>

          <SignEcho sign={sign} />

          {cosmicQuestions.map((q, i) => (
            <QuizBlock
              key={q.id}
              question={q}
              index={i}
              value={answers[i]}
              onChange={(v) => setAnswer(i, v)}
            />
          ))}

          <button type="submit" className="primary-btn full" disabled={!isValid || busy}>
            {busy ? 'Reading the sky…' : 'Reveal our chemistry'}
          </button>
        </form>

        <button className="ghost-btn cc-wide" onClick={leave}>Skip — explore AstroLive</button>
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
