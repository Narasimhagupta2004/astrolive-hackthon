import { useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { QuizBlock } from '../components/cosmic/QuizBlock';
import { SignEcho } from '../components/cosmic/SignEcho';
import { cosmicQuestions } from '../data/cosmicQuiz';
import { ymdFromInput, signFromYmd } from '../data/cosmicSigns';
import { useCosmic } from '../state/CosmicContext';

export function CosmicStartPage({ onNavigate }) {
  const { startAsHost } = useCosmic();
  const [form, setForm] = useState({ name: '', dob: '' });
  const [answers, setAnswers] = useState([null, null, null]);
  const [busy, setBusy] = useState(false);

  const ymd = ymdFromInput(form.dob);
  const sign = signFromYmd(ymd);
  const isValid = form.name.trim().length > 0 && ymd !== null && answers.every((v) => v !== null);

  const setAnswer = (i, v) => setAnswers((prev) => prev.map((p, j) => (j === i ? v : p)));

  const submit = async (e) => {
    e.preventDefault();
    if (!isValid || busy) return;
    setBusy(true);
    await startAsHost({ name: form.name.trim().slice(0, 24), ymd, answers });
    setBusy(false);
    onNavigate('cc-share');
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Cosmic Chemistry" onBack={() => onNavigate('hub')} />
      <main className="cc-main">
        <div className="cc-intro">
          <b>Answer 3 questions. Send the link.</b>
          <p>We'll read both your charts and both your instincts, then score the two of you.</p>
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
            {busy ? 'Opening a room…' : 'Create my cosmic link'}
          </button>
        </form>
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
