import { SlidersHorizontal } from 'lucide-react';
import { advisorCategories } from '../../data/appData';

export function ChatTabs({ active, onChange }) {
  return (
    <div className="chat-tabs" role="tablist">
      <SlidersHorizontal size={18} />
      {advisorCategories.map((c) => (
        <button
          key={c.id}
          className={active === c.id ? 'active' : ''}
          onClick={() => onChange(c.id)}
          role="tab"
          aria-selected={active === c.id}
        >{c.label}</button>
      ))}
    </div>
  );
}
