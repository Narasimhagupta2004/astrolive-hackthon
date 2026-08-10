import { Gift, PartyPopper } from 'lucide-react';
import { useCart } from '../../state/CartContext';
import { freeGift } from '../../data/appData';

export function FreeGiftBar() {
  const { subtotal, giftUnlocked, giftRemaining } = useCart();
  const pct = Math.min(100, Math.round((subtotal / freeGift.threshold) * 100));

  return (
    <div className={`free-gift ${giftUnlocked ? 'unlocked' : ''}`}>
      <div className="free-gift-head">
        {giftUnlocked ? <PartyPopper size={18} /> : <Gift size={18} />}
        <span>
          {giftUnlocked
            ? <>You unlocked a FREE <b>{freeGift.name}</b> {freeGift.emoji}</>
            : <>Add <b>₹{giftRemaining}</b> more for a FREE <b>{freeGift.name}</b> {freeGift.emoji}</>
          }
        </span>
      </div>
      <div className="free-gift-track"><i style={{ width: pct + '%' }} /></div>
    </div>
  );
}
