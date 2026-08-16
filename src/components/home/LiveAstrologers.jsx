import { astrologers } from '../../data/appData';

export function LiveAstrologers({ onViewAll }) {
  const live = astrologers.filter((a) => a.isLive);

  return (
    <section className="live-section" aria-label="Live astrologers">
      {live.map((a) => (
        <div className="live-person" key={a.id}>
          <img src={a.image} alt={a.name} />
          <span className="live-tag">Live</span>
          <p>{a.name}</p>
        </div>
      ))}
      <button className="view-all-btn" onClick={onViewAll}>View<br />all</button>
    </section>
  );
}
