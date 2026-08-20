import { Send } from 'lucide-react';
import { intents } from '../../data/muhuratData';

export function IntentGrid({ selectedIntentId, freeText, onSelectIntent, onFreeTextChange }) {
  return (
    <div className="intent-picker">
      <div className="intent-grid">
        {intents.map((it) => (
          <button
            type="button"
            key={it.id}
            className={`intent-tile ${selectedIntentId === it.id ? 'selected' : ''}`}
            onClick={() => onSelectIntent(it.id)}
          >
            <span className="emoji">{it.emoji}</span>
            <span className="label">{it.label}</span>
          </button>
        ))}
      </div>

      <div className="intent-divider"><span>or type your own</span></div>

      <div className="freeform-field">
        <Send size={16} />
        <input
          type="text"
          placeholder="e.g. Start my YouTube channel"
          value={freeText}
          onChange={(e) => onFreeTextChange(e.target.value)}
        />
      </div>
    </div>
  );
}
