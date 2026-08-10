import { useEffect } from 'react';
import { X } from 'lucide-react';

export function BottomSheet({ open, title, onClose, children, maxHeight = '80vh' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" style={{ maxHeight }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <header className="sheet-header">
          <h3>{title}</h3>
          <button className="sheet-close" aria-label="Close" onClick={onClose}><X size={22} /></button>
        </header>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
