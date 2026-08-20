import { useState } from 'react';
import { Sparkles, Loader2, RotateCcw, Zap, Coins, Lock, Check, Crown } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { BottomSheet } from '../components/common/BottomSheet';
import { IntentGrid } from '../components/muhurat/IntentGrid';
import { MuhuratCard } from '../components/muhurat/MuhuratCard';
import { RashiInline } from '../components/muhurat/RashiInline';
import { useCart } from '../state/CartContext';
import { useCoins } from '../state/useCoins';
import { useSubscription } from '../state/useSubscription';
import { computeMuhurats } from '../utils/muhuratEngine';
import { MUHURAT_BONUS, REDEEM_MIN_RECHARGE, coinsToRupees } from '../data/coins';

const planPerks = (bonus) => [
  'Unlimited muhurat readings',
  'Personalised to your rashi every time',
  'Priority windows for weddings and property',
  `${bonus} bonus coins credited straight away`
];

const dateLabel = (ts) =>
  new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export function MuhuratPage({ onNavigate }) {
  const { rashi } = useCart();
  const { balance, freeMuhuratUsed, awardMuhurat } = useCoins();
  const {
    isSubscribed, lapsed, expiresAt, planLabel, canPay, price, termDays, planBonus, buy
  } = useSubscription();

  const [intentId, setIntentId] = useState(null);
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [earned, setEarned] = useState(0);
  const [payOpen, setPayOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [planEarned, setPlanEarned] = useState(0);

  // The free ask is spent once; after that only an active plan opens the gate.
  const locked = freeMuhuratUsed && !isSubscribed;
  const canSubmit = (intentId || freeText.trim().length >= 3) && !loading;

  const handleFind = async () => {
    if (!canSubmit) return;
    if (locked) { setPayOpen(true); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await computeMuhurats({ intentId, intentText: freeText, rashiId: rashi });
      setResult(res);
      // Credit only after a reading succeeded — a failed call must not burn the
      // free ask or hand out coins. Repeats are refused by the ledger's dedupe.
      const award = awardMuhurat(`Muhurat · ${res.intent.label}`);
      if (award.ok) setEarned(award.coins);
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
    setEarned(0);
  };

  const askAnother = () => {
    if (locked) { setPayOpen(true); return; }
    handleReset();
  };

  const handleSubscribe = async () => {
    setBuying(true);
    setPayError(null);
    const res = await buy('plus');
    setBuying(false);
    if (res.ok) {
      setPayOpen(false);
      handleReset();
      setPlanEarned(res.coins);
      return;
    }
    if (res.reason === 'cancelled') return; // user closed the modal; say nothing
    setPayError(
      res.reason === 'not-configured'
        ? 'Payments are not configured on this build.'
        : res.message || 'Payment could not be completed.'
    );
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

            {/* Say what the ask costs before it is spent, not after. */}
            <p className={`muhurat-quota${isSubscribed ? ' plus' : locked ? ' spent' : ''}`}>
              {isSubscribed ? (
                <><Crown size={13} /> {planLabel} active · unlimited until {dateLabel(expiresAt)}</>
              ) : locked ? (
                <><Lock size={13} /> Free reading used · {lapsed ? 'renew' : 'subscribe'} for unlimited</>
              ) : (
                <><Coins size={13} /> 1 free reading · earns you {MUHURAT_BONUS} coins</>
              )}
            </p>

            {planEarned > 0 && (
              <div className="muhurat-earned" role="status">
                <Coins size={16} />
                <span>
                  <b>Plus active · +{planEarned} coins added</b>
                  <small>Worth ₹{coinsToRupees(planEarned)} off a recharge of ₹{REDEEM_MIN_RECHARGE} or more.</small>
                </span>
                <button onClick={() => onNavigate('wallet')}>View</button>
              </div>
            )}

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
              ) : locked ? (
                <><Lock size={16} /> Unlock unlimited muhurats</>
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

            {earned > 0 && (
              <div className="muhurat-earned" role="status">
                <Coins size={16} />
                <span>
                  <b>+{earned} coins added to your wallet</b>
                  <small>Worth ₹{coinsToRupees(earned)} off a recharge of ₹{REDEEM_MIN_RECHARGE} or more.</small>
                </span>
                <button onClick={() => onNavigate('wallet')}>View</button>
              </div>
            )}

            {result.windows.map((w, i) => (
              <MuhuratCard key={i} window={w} index={i} />
            ))}

            <button className="ghost-btn full ask-another" onClick={askAnother}>
              {locked
                ? <><Lock size={16} /> Ask another — {lapsed ? 'renew' : 'subscribe'}</>
                : <><RotateCcw size={16} /> Ask another muhurat</>}
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

      <BottomSheet
        open={payOpen}
        title={lapsed ? 'Your plan has ended' : "You've used your free muhurat"}
        onClose={() => { if (!buying) { setPayOpen(false); setPayError(null); } }}
      >
        <p className="sheet-hint">
          Guruji reads the panchang fresh for every question. Keep asking with AstroLive Plus.
        </p>

        <div className="plan-card">
          <div className="plan-price">
            <b>₹{price}</b><span>for {termDays} days</span>
          </div>
          <ul className="plan-perks">
            {planPerks(planBonus).map((perk) => (
              <li key={perk}><Check size={14} /> {perk}</li>
            ))}
          </ul>
        </div>

        {payError && <p className="pay-warn">⚠️ {payError}</p>}

        <button
          className="primary-btn full"
          onClick={handleSubscribe}
          disabled={buying || !canPay}
        >
          {buying
            ? <><Loader2 size={16} className="spinning" /> Opening checkout…</>
            : <><Crown size={16} /> {lapsed ? 'Renew' : 'Subscribe'} · ₹{price}</>}
        </button>

        <p className="plan-note">
          {canPay
            ? `One payment, ${termDays} days. No auto-renewal — it simply ends.`
            : 'Payments are not configured on this build.'}
        </p>

        {/* The coins the free reading paid out only convert on a recharge, so
            that route stays open whether or not they take the plan. */}
        <button className="sheet-secondary" onClick={() => { setPayOpen(false); onNavigate('recharge'); }}>
          Use my {balance} coins on a recharge
        </button>
      </BottomSheet>

      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
