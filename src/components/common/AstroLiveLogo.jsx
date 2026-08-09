export function AstroLiveLogo({ compact = false }) {
  return <div className={`astro-logo${compact ? ' compact' : ''}`} aria-label="AstroLive">
    <span className="logo-orbit"><span /></span>
    <span className="logo-word"><b>ASTRO</b><em>LIVE</em></span>
  </div>;
}
