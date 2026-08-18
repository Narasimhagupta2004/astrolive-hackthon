import { Sparkles, ArrowRight } from 'lucide-react';
import { uiAssets } from '../../data/appData';

export function CosmicFeatureCard({ onStart }) {
  return (
    <section className="cc-feature" aria-label="Cosmic Chemistry">
      <img src={uiAssets.toolBg4} alt="" className="cc-feature-img" />
      <div className="cc-feature-body">
        <small><Sparkles size={12} /> FOR TWO</small>
        <h2>Cosmic Chemistry</h2>
        <p>Answer 3 questions. Send the link. See how you two really score.</p>
        <button onClick={onStart}>
          Start <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
