import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const tabs = ['All', 'Vedic', 'Tarot', 'Numerology'];

export function ChatTabs() {
  const [active, setActive] = useState('All');
  return (
    <div className="chat-tabs" role="tablist">
      <SlidersHorizontal size={18} />
      {tabs.map((t) => (
        <button
          key={t}
          className={active === t ? 'active' : ''}
          onClick={() => setActive(t)}
          role="tab"
          aria-selected={active === t}
        >{t}</button>
      ))}
    </div>
  );
}
