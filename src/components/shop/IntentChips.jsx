import { useCart } from '../../state/CartContext';
import { intents } from '../../data/appData';

export function IntentChips() {
  const { intent, setIntent } = useCart();
  return (
    <div className="intent-chips" role="tablist" aria-label="Shop by intent">
      {intents.map((i) => (
        <button
          key={i.id}
          role="tab"
          aria-selected={intent === i.id}
          className={`intent-chip ${intent === i.id ? 'active' : ''}`}
          onClick={() => setIntent(i.id)}
        >
          <span className="emoji">{i.emoji}</span> {i.label}
        </button>
      ))}
    </div>
  );
}
