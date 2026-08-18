import { Sparkles } from 'lucide-react';
import { rashis } from '../../data/appData';
import { signTraits } from '../../data/cosmicSigns';

export function SignEcho({ sign }) {
  if (!sign) return null;
  const r = rashis.find((x) => x.id === sign);
  const t = signTraits[sign];
  return (
    <div className="cc-echo">
      <Sparkles size={14} />
      <span className="cc-echo-sym">{r.symbol}</span>
      <b>{r.label}</b>
      <em>{r.en}</em>
      <span className="cc-echo-vibe">{t.vibe}</span>
    </div>
  );
}
