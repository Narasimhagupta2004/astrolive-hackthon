import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ToolCard } from '../components/common/ToolCard';
import { tools } from '../data/appData';

export function AstroHubPage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="home" />
      <main className="hub-main">
        <h2>Free Tools</h2>
        <div className="tools-grid hub-grid">
          {tools.map((t) => (
            <ToolCard
              key={t.title}
              tool={t}
              onClick={t.route ? () => onNavigate(t.route) : undefined}
            />
          ))}
        </div>
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
