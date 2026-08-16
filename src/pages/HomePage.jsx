import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { HeroBanner } from '../components/home/HeroBanner';
import { LiveAstrologers } from '../components/home/LiveAstrologers';
import { FreeToolsSection } from '../components/home/FreeToolsSection';
import { QuickActions } from '../components/home/QuickActions';
import { ResumeSection } from '../components/home/ResumeSection';
import { RecentlyViewed } from '../components/home/RecentlyViewed';

export function HomePage({ onNavigate }) {
  return (
    <div className="app-screen">
      <AppHeader variant="home" />
      <main className="home-main">
        <ResumeSection onNavigate={onNavigate} />
        <RecentlyViewed onNavigate={onNavigate} />
        <HeroBanner />
        <div className="carousel-dots"><i /><i /><i /></div>
        <LiveAstrologers onViewAll={() => onNavigate('chat')} />
        <FreeToolsSection onViewAll={() => onNavigate('hub')} onNavigate={onNavigate} />
        <QuickActions onChat={() => onNavigate('chat')} onShop={() => onNavigate('shubh-kart')} />
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
