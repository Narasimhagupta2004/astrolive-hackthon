import { screenshotAssets } from '../../data/appData';

export function HeroBanner() {
  return (
    <section className="hero-banner" aria-label="Free consultation offer">
      <img src={screenshotAssets.homeAlt} alt="Astrologer" className="hero-image" />
      <div className="hero-content">
        <small>FREE</small>
        <h1>GET YOUR FIRST<br />CONSULTATION FREE</h1>
        <button>CONNECT NOW</button>
      </div>
    </section>
  );
}
