import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SESSION_KEY = 'tj_announcement_dismissed';

export function AnnouncementBar(): React.ReactElement | null {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(SESSION_KEY);
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-denim-deep text-white h-[36px] flex items-center justify-between px-4 text-xs font-medium z-50 relative"
    >
      <div className="flex-1 text-center truncate pr-2">
        <span>Free local delivery above ₹1,999 · Use code </span>
        <span className="text-gold font-semibold">TRENDY10</span>
        <span> for 10% off</span>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
