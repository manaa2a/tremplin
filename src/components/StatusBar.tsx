/** Fake iOS-style status bar (9:41 + signal/battery), purely decorative. */
export function StatusBar() {
  return (
    <div className="sbar">
      <span>9:41</span>
      <span className="dots">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" />
          <rect x="4" y="5" width="3" height="6" />
          <rect x="8" y="2" width="3" height="9" />
          <rect x="12" y="0" width="3" height="11" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="1" y="1" width="19" height="10" rx="2" />
          <rect x="3" y="3" width="13" height="6" fill="currentColor" stroke="none" />
          <rect x="21" y="4" width="2" height="4" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}
