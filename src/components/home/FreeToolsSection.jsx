import { ChevronRight } from 'lucide-react';
import { tools } from '../../data/appData';
import { ToolCard } from '../common/ToolCard';

export function FreeToolsSection({ onViewAll }) {
  return (
    <section className="free-tools">
      <div className="section-heading">
        <h2>Free Tools</h2>
        <button onClick={onViewAll}>View all <ChevronRight size={16} /></button>
      </div>
      <div className="tools-grid">
        {tools.map((t) => <ToolCard key={t.title} tool={t} />)}
      </div>
    </section>
  );
}
