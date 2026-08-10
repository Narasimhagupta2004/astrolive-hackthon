import { Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { BottomSheet } from '../common/BottomSheet';
import { useCart } from '../../state/CartContext';
import { rashis } from '../../data/appData';

export function RashiPicker() {
  const { rashi, setRashi } = useCart();
  const [open, setOpen] = useState(false);
  const selected = rashis.find((r) => r.id === rashi);

  return (
    <>
      <button className={`rashi-pill ${selected ? 'active' : ''}`} onClick={() => setOpen(true)}>
        <Sparkles size={14} />
        {selected ? (
          <span><span className="rashi-sym">{selected.symbol}</span> {selected.label} <em>·</em> Personalising for you</span>
        ) : (
          <span>Choose your <b>Rashi</b> for personal picks</span>
        )}
        <ChevronDown size={14} />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Choose your Rashi">
        <p className="sheet-hint">We'll highlight products aligned to your zodiac.</p>
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
