import { useMemo, useState } from 'react';
import { Coins, CheckCircle2, Lock } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useCoins } from '../state/useCoins';
import {
  RECHARGE_AMOUNTS, coinsToRupees, maxRedeemable, redeemHint,
  REDEEM_MIN_RECHARGE, REDEEM_MAX_PCT
} from '../data/coins';

export function RechargePage({ onNavigate }) {
  const { balance, spend } = useCoins();
  const [amount, setAmount] = useState(RECHARGE_AMOUNTS[2]);
  const [useCoinsOn, setUseCoinsOn] = useState(true);
  const [done, setDone] = useState(null);

  // The cap is recomputed from the amount every render, never stored, so it
  // cannot drift out of step with the selected recharge.
  const redeemable = useMemo(() => maxRedeemable(amount, balance), [amount, balance]);
  const applied = useCoinsOn ? redeemable : 0;
  const discount = coinsToRupees(applied);
  const payable = amount - discount;

  const pay = () => {
    if (applied > 0) {
      const res = spend(applied, `Recharge ₹${amount}`);
      if (!res.ok) return;
    }
    setDone({ amount, applied, discount, payable });
  };

  if (done) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Recharge complete" onBack={() => onNavigate('home')} />
        <main className="rc-main">
          <div className="order-success rc-success">
            <span className="sg-tick"><CheckCircle2 size={40} /></span>
            <h2>₹{done.amount} added</h2>
            <p>
              {done.applied > 0
                ? `You paid ₹${done.payable} and saved ₹${done.discount} with ${done.applied} coins.`
                : `You paid ₹${done.payable}.`}
            </p>
            <div className="success-actions">
              <button className="primary-btn" onClick={() => onNavigate('home')}>Done</button>
              <button className="ghost-btn" onClick={() => onNavigate('wallet')}>View coins</button>
            </div>
          </div>
        </main>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Recharge wallet" onBack={() => onNavigate('wallet')} />
      <main className="rc-main">
        <h3 className="rc-heading">Choose an amount</h3>
        <div className="rc-amounts">
          {RECHARGE_AMOUNTS.map((a) => (
            <button
              key={a}
              className={`day-chip ${amount === a ? 'active' : ''}`}
              onClick={() => setAmount(a)}
            >
              <b>₹{a}</b>
            </button>
          ))}
        </div>

        <div className="rc-coins">
          <div className="rc-coins-head">
            <span><Coins size={16} /> <b>Use coins</b></span>
            <button
              className={`rc-toggle ${useCoinsOn ? 'on' : ''}`}
              onClick={() => setUseCoinsOn((v) => !v)}
              role="switch"
              aria-checked={useCoinsOn}
              aria-label="Use coins on this recharge"
              disabled={redeemable === 0}
            ><i /></button>
          </div>
          <p className="rc-hint">{redeemHint(amount, balance)}</p>
          <p className="rc-rule">
            Coins cover up to {Math.round(REDEEM_MAX_PCT * 100)}% of a recharge of ₹{REDEEM_MIN_RECHARGE} or more.
            You have {balance}.
          </p>
        </div>

        <div className="confirm-card rc-card">
          <header>Summary</header>
          <div className="pay-receipt">
            <div className="row"><span>Recharge</span><strong>₹{amount}</strong></div>
            <div className="row"><span>Coins applied<em>{applied} coins</em></span><strong>−₹{discount}</strong></div>
            <div className="row rc-total"><span>You pay</span><strong>₹{payable}</strong></div>
          </div>
        </div>

        <button className="primary-btn full" onClick={pay}>
          <Lock size={14} /> Pay ₹{payable}
        </button>
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
