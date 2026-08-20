import { Heart, Sun, Grid2x2X as Grid2X2, CircleDot } from 'lucide-react';

const iconMap = { heart: Heart, sun: Sun, grid: Grid2X2, rings: CircleDot };

export function ToolCard({ tool, onClick }) {
  const Icon = iconMap[tool.icon] || Heart;
  return (
    <button
      className="tool-card"
      style={{ backgroundImage: `linear-gradient(100deg, rgba(20,12,52,.82), rgba(58,12,110,.35)), url(${tool.image})` }}
      onClick={onClick}
    >
      {tool.badge && <span className="tool-badge">{tool.badge}</span>}
      <Icon size={26} strokeWidth={1.6} />
      <b>{tool.title}</b>
    </button>
  );
}
