import { ArrowLeft, Search, WalletCards, Bell } from 'lucide-react';
import { AstroLiveLogo } from '../common/AstroLiveLogo';
import { CartBadge } from '../shop/CartBadge';

export function AppHeader({ variant = 'home', title, onBack, showCart = false, onCart }) {
  if (variant === 'back') {
    return (
      <header className="app-header back-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={26} /></button>
        <h1>{title}</h1>
      </header>
    );
  }
  return (
    <header className="app-header">
      <AstroLiveLogo />
      <nav className="header-actions">
        <button className="icon-btn" aria-label="Search"><Search size={21} /></button>
        {showCart ? <CartBadge onClick={onCart} /> : <button className="icon-btn" aria-label="Wallet"><WalletCards size={21} /></button>}
        <button className="icon-btn" aria-label="Notifications"><Bell size={21} /></button>
      </nav>
    </header>
  );
}
