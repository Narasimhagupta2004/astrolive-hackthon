import { useState } from 'react';
import { Sparkles, Loader2, RotateCcw, Zap } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { IntentGrid } from '../components/muhurat/IntentGrid';
import { MuhuratCard } from '../components/muhurat/MuhuratCard';
import { RashiInline } from '../components/muhurat/RashiInline';
import { useCart } from '../state/CartContext';
import { computeMuhurats } from '../utils/muhuratEngine';

export function MuhuratPage({ onNavigate }) {
  const { rashi } = useCart();
  const [intentId, setIntentId] = useState(null);
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canSubmit = (intentId || freeText.trim().length >= 3) && !loading;

  const handleFind = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await computeMuhurats({ intentId, intentText: freeText, rashiId: rashi });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIntentId(null);
    setFreeText('');
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Muhurat AI" onBack={() => onNavigate('hub')} />
      <main className="muhurat-main">
        {!result && (
          <>
            <div className="muhurat-intro">
              <Sparkles size={20} />
              <h2>Ask Guruji when</h2>
              <p>Pick what you're planning — I'll find 3 auspicious windows in the next 14 days.</p>
            </div>

            <RashiInline />

            <IntentGrid
              selectedIntentId={intentId}
              freeText={freeText}
              onSelectIntent={(id) => { setIntentId(id); setFreeText(''); }}
              onFreeTextChange={(t) => { setFreeText(t); setIntentId(null); }}
            />

            {error && <p className="pay-warn">⚠️ {error}</p>}

            <button
              className="primary-btn full muhurat-cta"
              onClick={handleFind}
              disabled={!canSubmit}
            >
              {loading ? (
                <><Loader2 size={16} className="spinning" /> Guruji is consulting the stars…</>
              ) : (
                <><Sparkles size={16} /> Find my muhurat</>
              )}
            </button>
          </>
        )}

        {result && (
          <div className="muhurat-results">
            <div className="muhurat-results-head">
              <h2>Guruji's 3 windows for you</h2>
              <p>Intent: <strong>{result.intent.emoji} {result.intent.label}</strong></p>
            </div>

            {result.windows.map((w, i) => (
              <MuhuratCard key={i} window={w} index={i} />
            ))}

            <button className="ghost-btn full ask-another" onClick={handleReset}>
              <RotateCcw size={16} /> Ask another muhurat
            </button>

            <div className="muhurat-powered">
              {result.poweredBy === 'gemini' ? (
                <><Zap size={12} /> Powered by Google Gemini</>
              ) : (
                <>Powered by AstroLive Vedic Engine</>
              )}
            </div>
          </div>
        )}
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
