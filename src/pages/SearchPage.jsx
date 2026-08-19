import { useMemo, useState } from 'react';
import { Search, X, Star, MessageCircle, ShoppingBag } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { astrologers, shubhKartProducts, categoryChips, advisorCategories } from '../data/appData';
import { useSession } from '../state/SessionContext';

const SUGGESTIONS = ['Marriage', 'Career', 'Life Coach', 'Rudraksha', 'Auspicious'];

function matches(text, q) {
  return String(text || '').toLowerCase().includes(q);
}

export function SearchPage({ onNavigate }) {
  const { startSession } = useSession();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const { advisors, products } = useMemo(() => {
    if (!q) return { advisors: [], products: [] };
    const catIds = advisorCategories
      .filter((c) => matches(c.label, q) || matches(c.short, q))
      .map((c) => c.id);
    return {
      advisors: astrologers.filter(
        (a) => matches(a.name, q)
          || (a.categories || []).some((c) => catIds.includes(c))
          || (a.languages || []).some((l) => matches(l, q))
      ),
      products: shubhKartProducts.filter(
        (p) => matches(p.name, q) || matches(p.category, q)
      )
    };
  }, [q]);

  const openAdvisor = (a) => {
    startSession(a, 'chat');
    onNavigate('conversation', { person: a, from: 'search' });
  };

  const total = advisors.length + products.length;

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Search" onBack={() => onNavigate('home')} />
      <main className="se-main">
        <div className="se-box">
          <Search size={17} />
          <input
            type="text"
            autoFocus
            placeholder="Astrologers, remedies, topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="se-clear" aria-label="Clear search" onClick={() => setQuery('')}>
              <X size={15} />
            </button>
          )}
        </div>

        {!q && (
          <div className="se-suggest">
            <small>TRY SEARCHING</small>
            <div className="se-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="day-chip" onClick={() => setQuery(s)}><b>{s}</b></button>
              ))}
            </div>
          </div>
        )}

        {q && total === 0 && (
          <div className="cc-empty">
            <h3>No matches for “{query}”</h3>
            <p>Try a topic like Marriage or Career, or an astrologer's name.</p>
          </div>
        )}

        {advisors.length > 0 && (
          <>
            <h3 className="se-heading">Astrologers · {advisors.length}</h3>
            {advisors.map((a) => (
              <button className="se-row" key={a.id} onClick={() => openAdvisor(a)}>
                <span className="se-pic"><img src={a.image} alt="" />{a.isOnline && <i className="online-dot" />}</span>
                <span className="se-row-info">
                  <b>{a.name}</b>
                  <small>{categoryChips(a.categories)}</small>
                  <small className="se-meta"><Star size={9} fill="currentColor" strokeWidth={0} /> {a.rating} · ₹{a.ratePerMin}/min</small>
                </span>
                <span className="se-go"><MessageCircle size={14} /></span>
              </button>
            ))}
          </>
        )}

        {products.length > 0 && (
          <>
            <h3 className="se-heading">Remedies · {products.length}</h3>
            {products.map((p) => (
              <button className="se-row" key={p.id} onClick={() => onNavigate('shubh-kart')}>
                <span className="se-pic sq" style={{ backgroundImage: `url(${p.image})` }} />
                <span className="se-row-info">
                  <b>{p.name}</b>
                  <small>{p.category}</small>
                  <small className="se-meta">₹{p.price}</small>
                </span>
                <span className="se-go"><ShoppingBag size={14} /></span>
              </button>
            ))}
          </>
        )}
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
