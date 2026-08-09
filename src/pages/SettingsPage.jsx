import { useState } from 'react';
import { BellRing, Languages, Share2, Phone, CircleUser as UserCircle, FileText, LogIn, ChevronRight } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';

const rows = [
  { icon: BellRing, label: 'Notifications', toggle: true },
  { icon: Languages, label: 'Language & Activity' },
  { icon: Share2, label: 'Share' },
  { icon: Phone, label: 'Contact Us' },
  { icon: UserCircle, label: 'Account Management' },
  { icon: FileText, label: 'Terms & Conditions' },
  { icon: LogIn, label: 'Log out' }
];

export function SettingsPage({ onNavigate }) {
  const [notifOn, setNotifOn] = useState(true);
  return (
    <div className="app-screen settings-screen">
      <AppHeader variant="back" title="Settings" onBack={() => onNavigate('home')} />
      <main className="settings-main">
        {rows.map((r, i) => (
          <button
            className="setting-row"
            key={r.label}
            onClick={() => i === 0 && setNotifOn((v) => !v)}
          >
            <r.icon size={24} strokeWidth={1.8} />
            <span>{r.label}</span>
            {r.toggle
              ? <em className={`toggle ${notifOn ? 'on' : ''}`}><i /></em>
              : <ChevronRight size={24} />}
          </button>
        ))}
        <p className="version">Version 2.0.1&nbsp;&nbsp;(58)</p>
      </main>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
