import { useEffect, useState } from 'react';
import { Copy, Share2, WifiOff, Check } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { SignEcho } from '../components/cosmic/SignEcho';
import { signFromYmd } from '../data/cosmicSigns';
import { buildRoomUrl, buildInviteUrl, parsePastedLink, saveLastResult } from '../utils/cosmicLink';
import { useCosmic } from '../state/CosmicContext';

const SHARE_TEXT = "I just mapped my chart on AstroLive. Answer 3 questions and let's see our cosmic chemistry.";

export function CosmicSharePage({ onNavigate }) {
  const { me, code, degraded, watch, stopWatching, setPair } = useCosmic();
  const [copied, setCopied] = useState(false);
  const [paste, setPaste] = useState('');
  const [pasteError, setPasteError] = useState(false);

  useEffect(() => {
    if (!code) return undefined;
    watch(code, () => onNavigate('cc-reveal'));
    return stopWatching;
  }, [code, watch, stopWatching, onNavigate]);

  if (!me) {
    return (
      <div className="app-screen">
        <AppHeader variant="back" title="Cosmic Chemistry" onBack={() => onNavigate('cc-start')} />
        <main className="cc-main">
          <div className="cc-empty">
            <p>Start by answering your three questions.</p>
            <button className="primary-btn full" onClick={() => onNavigate('cc-start')}>Begin</button>
          </div>
        </main>
        <BottomNav active="hub" onNavigate={onNavigate} />
      </div>
    );
  }

  const link = code ? buildRoomUrl(code) : buildInviteUrl(me);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const share = () => {
    window.location.href = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${link} `)}`;
  };

  const reveal = () => {
    const parsed = parsePastedLink(paste);
    if (parsed && parsed.kind === 'result') {
      setPair({ a: parsed.a, b: parsed.b });
      saveLastResult(parsed.a, parsed.b);
      onNavigate('cc-reveal');
      return;
    }
    setPasteError(true);
  };

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Send the link" onBack={() => onNavigate('cc-start')} />
      <main className="cc-main">
        <SignEcho sign={signFromYmd(me.ymd)} />

        {degraded && (
          <div className="cc-degraded">
            <WifiOff size={14} />
            <span>Offline mode — live sync unavailable. The link still works.</span>
          </div>
        )}

        {code && (
          <div className="cc-room">
            <small>ROOM CODE</small>
            <b>{code}</b>
            <span className="cc-waiting"><i /><i /><i /> Waiting for them to join…</span>
          </div>
        )}

        <label className="field">
          <span>Their link</span>
          <input type="text" readOnly value={link} onFocus={(e) => e.target.select()} />
        </label>

        <button className="primary-btn full" onClick={share}>
          <Share2 size={16} /> Share on WhatsApp
        </button>
        <button className="ghost-btn cc-wide" onClick={copy}>
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}
        </button>

        <p className="cc-note">
          {code
            ? 'They answer on their phone. The moment they finish, this screen turns into your result — no refresh needed.'
            : 'They answer on their phone, then send you their result link. Nothing is stored on a server — the link is the data.'}
        </p>

        {!code && (
          <div className="cc-paste">
            <label className="field">
              <span>Got their result link?</span>
              <input
                type="text"
                placeholder="Paste it here"
                value={paste}
                onChange={(e) => { setPaste(e.target.value); setPasteError(false); }}
              />
            </label>
            {pasteError && <p className="cc-error">That doesn't look like a result link yet.</p>}
            <button className="ghost-btn cc-wide" onClick={reveal} disabled={!paste.trim()}>
              Reveal our chemistry
            </button>
          </div>
        )}
      </main>
      <BottomNav active="hub" onNavigate={onNavigate} />
    </div>
  );
}
