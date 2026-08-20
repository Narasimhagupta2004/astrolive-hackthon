export function AstroLiveLogo({ compact = false }) {
  return (
    <div className={`astro-logo${compact ? ' compact' : ''}`} aria-label="AstroLive">
      <svg className="logo-mark" viewBox="0 0 72 56" role="img" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="al-planet" cx="30%" cy="24%" r="72%">
            <stop offset="0" stopColor="#6b46eb" />
            <stop offset="24%" stopColor="#3b1f80" />
            <stop offset="58%" stopColor="#241041" />
            <stop offset="1" stopColor="#1e0a21" />
          </radialGradient>
          <linearGradient id="al-ring" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6b46eb" />
            <stop offset="44%" stopColor="#eb468b" />
            <stop offset="1" stopColor="#8e71f4" />
          </linearGradient>
          <linearGradient id="al-ring-hi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#8e71f4" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* rings behind the planet */}
        <g transform="rotate(-22 36 28)">
          <ellipse cx="36" cy="28" rx="31" ry="10.5" fill="none" stroke="url(#al-ring)" strokeWidth="4" />
          <ellipse cx="36" cy="28" rx="24.5" ry="7" fill="none" stroke="url(#al-ring-hi)" strokeWidth="2" />
        </g>

        <circle cx="36" cy="28" r="14.5" fill="url(#al-planet)" />

        {/* front halves, drawn over the planet */}
        <g transform="rotate(-22 36 28)">
          <path d="M 5 28 A 31 10.5 0 0 0 67 28" fill="none" stroke="url(#al-ring)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 11.5 28 A 24.5 7 0 0 0 60.5 28" fill="none" stroke="url(#al-ring-hi)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* drifting particles, kept clear of the ring's tilt */}
        <circle cx="12" cy="11" r="2.8" fill="#8e71f4" />
        <circle cx="60" cy="47" r="2.4" fill="#eb468b" />
        <circle cx="67" cy="6" r="1.7" fill="#ffa767" />
      </svg>
      <span className="logo-word"><b>ASTRO</b><em>LIVE</em></span>
    </div>
  );
}
