import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Share2, RotateCcw } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { rashis } from '../data/appData';
import { signTraits } from '../data/cosmicSigns';
import { computeChemistry } from '../utils/cosmicScore';
import { useCosmic } from '../state/CosmicContext';

const COUNT_MS = 900;

function useCountUp(target) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const p = Math.min(1, (ts - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

function PersonCell({ person, sign }) {
  const r = rashis.find((x) => x.id === sign);
  return (
    <div className="rashi-cell cc-person">
      <span className="sym">{r.symbol}</span>
      <b>{person.name}</b>
      <span className="en">{r.label}</span>
    </div>
  );
}

export function CosmicRevealPage({ onNavigate }) {
  const { pair, restoreLast, resultLink, degraded } = useCosmic();
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!pair && !restored) {
      restoreLast();
      setRestored(true);
    }
  }, [pair, restored, restoreLast]);

  const result = useMemo(() => (pair ? computeChemistry(pair.a, pair.b) : null), [pair]);
  const shown = useCountUp(result ? result.total : 0);

  if (!pair || !result) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Cosmic Chemistry" onBack={() => onNavigate('home')} />
        <main className="cc-main">
          <div className="cc-empty">
            <h3>This result isn't on this device</h3>
            <p>Ask them to send the result link again, or start a fresh reading.</p>
            <button className="primary-btn full" onClick={() => onNavigate('cc-start')}>Start a reading</button>
          </div>
        </main>
        <BottomNav active="hub" onNavigate={onNavigate} />
      </div>
    );
  }

  const { tier, astro, quiz, notes, signA, signB } = result;
  const celebrate = tier.id === 'twin-flame' || tier.id === 'golden';

  const sendBack = () => {
    const text = `Our cosmic chemistry result is in 👀 ${resultLink} `;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="The Reveal" onBack={() => onNavigate('home')} />
      <main className="cc-main cc-reveal-main">
        <div className="order-success payment-success cc-reveal-body">
          {celebrate && (
            <div className="confetti" aria-hidden>
              {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}
            </div>
          )}

          <div className="cc-pair" style={{ '--s': 0 }}>
            <PersonCell person={pair.a} sign={signA} />
            <span className="cc-pair-div">✦</span>
            <PersonCell person={pair.b} sign={signB} />
          </div>

          <div className="cc-score" style={{ '--s': 1 }}>
            {shown}<small>/100</small>
          </div>

          <h2 style={{ '--s': 2 }}>{tier.name} {tier.emoji}</h2>
          <p style={{ '--s': 3 }}>{tier.verdict}</p>

          <div className="free-gift cc-meter" style={{ '--s': 4 }}>
            <div className="free-gift-track">
              <i style={{ width: `${shown}%`, background: tier.gradient }} />
            </div>
          </div>

          <div className="confirm-card cc-card" style={{ '--s': 5 }}>
            <header>Structural Compatibility · {astro.total}/100</header>
            <div className="pay-receipt">
              {[astro.element, astro.modality, astro.aspect].map((row) => (
                <div className="row" key={row.label}>
                  <span>{row.label}<em>{row.note}</em></span>
                  <strong>{row.pts}/{row.max}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="confirm-card cc-card" style={{ '--s': 6 }}>
            <header>Behavioural Agreement · {quiz.total}/100</header>
            {quiz.rows.map((row) => (
              <div className="cc-answer-row" key={row.id}>
                <small>{row.title}</small>
                <div className="cc-answer-pair">
                  <span className="day-chip active cc-pick-a"><b>{pair.a.name}</b><span>{row.aLabel}</span></span>
                  <span className="intent-chip active cc-pick-b"><b>{pair.b.name}</b> · {row.bLabel}</span>
                </div>
                <span className="cc-gap">{row.verdict.label} {row.verdict.emoji} · {row.pts}/{row.max}</span>
              </div>
            ))}
          </div>

          {notes.length > 0 && (
            <ul className="ps-benefits cc-notes" style={{ '--s': 7 }}>
              {notes.map((n) => <li key={n}><CheckCircle2 size={14} /> {n}</li>)}
            </ul>
          )}

          <div className="success-actions" style={{ '--s': 8 }}>
            <button className="primary-btn" onClick={sendBack}>
              <Share2 size={15} /> Send result to {pair.a.name}
            </button>
            <button className="ghost-btn" onClick={() => onNavigate('cc-start')}>
              <RotateCcw size={15} /> Try someone else
            </button>
          </div>

          <small className="powered">
            {signTraits[signA].vibe} × {signTraits[signB].vibe}
            {degraded ? ' · offline mode' : ''}
          </small>
        </div>
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
