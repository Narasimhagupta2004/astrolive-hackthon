import { Coins, Clock, Gift, Share2, Wallet, Info } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useCoins } from '../state/useCoins';
import { COIN_SOURCES } from '../store/coinsSlice';
import { coinsToRupees, COIN_TERMS, REVEAL_BONUS, REFERRAL_BONUS, REFERRAL_QUALIFY_RECHARGE } from '../data/coins';
import { timeAgo } from '../utils/time';

// Icons per ledger entry type; labels come from the source registry so a new
// coin source shows up here automatically.
const rowIcons = { reveal: Share2, referral: Gift, spend_recharge: Wallet };
const rowLabel = (type) =>
  type === 'spend_recharge' ? 'Used on recharge' : COIN_SOURCES[type]?.label || 'Coins';

export function WalletPage({ onNavigate }) {
  const { balance, expiringSoon, history } = useCoins();

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="AstroLive Coins" onBack={() => onNavigate('home')} />
      <main className="wl-main">
        <section className="wl-balance">
          <small>YOUR BALANCE</small>
          <b><Coins size={26} /> {balance}</b>
          <span>worth ₹{coinsToRupees(balance)} off your next recharge</span>
        </section>

        {expiringSoon > 0 && (
          <p className="wl-expiring">
            <Clock size={13} /> {expiringSoon} coins expire within 14 days.
          </p>
        )}

        <button className="primary-btn full" onClick={() => onNavigate('recharge')}>
          Use coins on a recharge
        </button>

        <div className="wl-how">
          <h3>How you earn</h3>
          <div className="wl-how-row">
            <span className="wl-how-icon"><Share2 size={15} /></span>
            <span><b>+{REVEAL_BONUS} coins</b><small>When someone new finishes a Cosmic Chemistry reading with you</small></span>
          </div>
          <div className="wl-how-row">
            <span className="wl-how-icon"><Gift size={15} /></span>
            <span><b>+{REFERRAL_BONUS} coins</b><small>When someone you referred makes their first recharge of ₹{REFERRAL_QUALIFY_RECHARGE}+</small></span>
          </div>
        </div>

        <h3 className="wl-heading">History</h3>
        {history.length === 0 && (
          <p className="wl-empty">Nothing yet. Share a Cosmic Chemistry reading to earn your first coins.</p>
        )}
        {history.map((h) => {
          const Icon = rowIcons[h.type] || Gift;
          return (
            <div className="wl-row" key={h.id}>
              <span className="wl-row-icon"><Icon size={15} /></span>
              <span className="wl-row-info">
                <b>{rowLabel(h.type)}</b>
                <small>{h.ref ? `${h.ref} · ` : ''}{timeAgo(h.at)}</small>
              </span>
              <strong className={h.coins < 0 ? 'out' : 'in'}>
                {h.coins < 0 ? '' : '+'}{h.coins}
              </strong>
            </div>
          );
        })}

        <div className="wl-terms">
          <h3><Info size={14} /> Terms</h3>
          <ul>
            {COIN_TERMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
