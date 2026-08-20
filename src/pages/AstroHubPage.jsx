import { Sparkles, ArrowRight } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ToolCard } from '../components/common/ToolCard';
import { CosmicFeatureCard } from '../components/cosmic/CosmicFeatureCard';
import { tools } from '../data/appData';

const HERO_ROUTES = ['cc-start', 'muhurat'];

export function AstroHubPage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="home" onWallet={() => onNavigate('wallet')} onSearch={() => onNavigate('search')} onNotifications={() => onNavigate('notifications')} />
      <main className="hub-main">
        <button className="muhurat-hero" onClick={() => onNavigate('muhurat')}>
          <div className="mh-badge"><Sparkles size={12} /> AstroLive presents</div>
          <h2>Muhurat AI <span className="mh-sparkle">✨</span></h2>
          <p>Ask when to do anything — sacred timing in 5 seconds.</p>
          <div className="mh-cta">Consult now <ArrowRight size={14} /></div>
          <div className="mh-glow" aria-hidden />
        </button>
        <CosmicFeatureCard onStart={() => onNavigate('cc-start')} />
        <h2>Free Tools</h2>
        <div className="tools-grid hub-grid">
          {tools.filter((t) => !HERO_ROUTES.includes(t.route)).map((t) => (
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
