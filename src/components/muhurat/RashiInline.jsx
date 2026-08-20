import { Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { BottomSheet } from '../common/BottomSheet';
import { useCart } from '../../state/CartContext';
import { rashis } from '../../data/appData';

export function RashiInline() {
  const { rashi, setRashi } = useCart();
  const [open, setOpen] = useState(false);
  const selected = rashis.find((r) => r.id === rashi);

  return (
    <>
      <button className={`rashi-inline ${selected ? 'active' : ''}`} onClick={() => setOpen(true)}>
        <Sparkles size={14} />
        {selected ? (
          <span>For your rashi: <b>{selected.symbol} {selected.label}</b></span>
        ) : (
          <span>Pick your rashi to personalise</span>
        )}
        <em>Change</em>
        <ChevronDown size={14} />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Choose your Rashi">
        <p className="sheet-hint">Guruji will personalise every muhurat to your zodiac.</p>
        <div className="rashi-grid">
          {rashis.map((r) => (
            <button
              key={r.id}
              className={`rashi-cell ${rashi === r.id ? 'selected' : ''}`}
              onClick={() => { setRashi(r.id); setOpen(false); }}
            >
              <span className="sym">{r.symbol}</span>
              <b>{r.label}</b>
              <span className="en">{r.en}</span>
            </button>
          ))}
        </div>
        {rashi && (
          <button className="sheet-secondary" onClick={() => { setRashi(null); setOpen(false); }}>
            Clear selection
          </button>
        )}
      </BottomSheet>
    </>
  );
}
