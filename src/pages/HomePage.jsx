import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { HeroBanner } from '../components/home/HeroBanner';
import { LiveAstrologers } from '../components/home/LiveAstrologers';
import { FreeToolsSection } from '../components/home/FreeToolsSection';
import { QuickActions } from '../components/home/QuickActions';

export function HomePage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="home" />
      <main className="home-main">
        <HeroBanner />
        <div className="carousel-dots"><i /><i /><i /></div>
        <LiveAstrologers onViewAll={() => onNavigate('chat')} />
        <FreeToolsSection onViewAll={() => onNavigate('hub')} />
        <QuickActions onChat={() => onNavigate('chat')} onShop={() => onNavigate('shubh-kart')} />
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
