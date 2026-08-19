import { useState } from 'react';
import { BellRing, Languages, Share2, Phone, CircleUser as UserCircle, FileText, LogIn, ChevronRight, Sparkles, Users, Info, Download } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useSession } from '../state/SessionContext';

// Served from public/, so it is a plain static file in dev and in the build.
const HLD_DOC = '/astrolive-architecture.html';

const rows = [
  { icon: Languages, label: 'Language & Activity' },
  { icon: Share2, label: 'Share' },
  { icon: Phone, label: 'Contact Us' },
  { icon: UserCircle, label: 'Account Management' },
  { icon: FileText, label: 'Terms & Conditions' },
  { icon: LogIn, label: 'Log out' }
];

export function SettingsPage({ onNavigate }) {
  const [notifOn, setNotifOn] = useState(true);
  const { astrologerMode, toggleAstrologerMode } = useSession();

  return (
    <div className="app-screen settings-screen">
      <AppHeader variant="back" title="Settings" onBack={() => onNavigate('home')} />
      <main className="settings-main">
        <button className="setting-row" onClick={() => setNotifOn((v) => !v)}>
          <BellRing size={24} strokeWidth={1.8} />
          <span>Notifications</span>
          <em className={`toggle ${notifOn ? 'on' : ''}`}><i /></em>
        </button>

        <button className="setting-row" onClick={toggleAstrologerMode}>
          <Sparkles size={24} strokeWidth={1.8} />
          <span>Astrologer mode</span>
          <em className={`toggle ${astrologerMode ? 'on' : ''}`}><i /></em>
        </button>

        {astrologerMode && (
          <button className="setting-row" onClick={() => onNavigate('connected')}>
            <Users size={24} strokeWidth={1.8} />
            <span>Connected Users</span>
            <ChevronRight size={24} />
          </button>
        )}

        {/* A real link, so the browser handles the download itself. Highlighted
            because nobody taps a document they were not looking for. */}
        <a
          className="setting-row featured"
          href={HLD_DOC}
          download="AstroLive-HLD.html"
          aria-label="Download the HLD document"
        >
          <Info size={24} strokeWidth={1.8} />
          <span>
            <b className="row-title">HLD Document <em className="new-flag">New</em></b>
            <small>Architecture &amp; feature design</small>
          </span>
          <Download size={22} className="dl-icon" />
        </a>

        {rows.map((r) => (
          <button className="setting-row" key={r.label}>
            <r.icon size={24} strokeWidth={1.8} />
            <span>{r.label}</span>
            <ChevronRight size={24} />
          </button>
        ))}
        <p className="version">Version 2.0.1&nbsp;&nbsp;(58)</p>
      </main>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
