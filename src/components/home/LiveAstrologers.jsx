import { uiAssets } from '../../data/appData';

const liveAstrologers = [
  { name: 'Shree', image: uiAssets.live1 },
  { name: 'Tarot V...', image: uiAssets.live2 },
  { name: 'Pooja', image: uiAssets.live3 }
];

export function LiveAstrologers({ onViewAll }) {
  return (
    <section className="live-section" aria-label="Live astrologers">
      {liveAstrologers.map((a) => (
        <div className="live-person" key={a.name}>
          <img src={a.image} alt={a.name} />
          <span className="live-tag">Live</span>
          <p>{a.name}</p>
        </div>
      ))}
      <button className="view-all-btn" onClick={onViewAll}>View<br />all</button>
    </section>
  );
}
