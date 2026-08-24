// Custom frameless window title bar with drag region + window controls
export default function TitleBar() {
  return (
    <div className="drag-region flex items-center justify-between h-9 bg-surface-900 border-b border-zinc-800/60 px-4 flex-shrink-0 z-50">
      {/* App name */}
      <span className="text-xs font-semibold text-zinc-500 tracking-widest uppercase no-drag">
        Nercessian's PR Tracker
      </span>

      {/* Window controls */}
      <div className="no-drag flex items-center gap-1">
        <button
          onClick={() => window.electronAPI.minimizeWindow()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          title="Minimize"
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
            <rect width="10" height="1.5" rx="0.75" />
          </svg>
        </button>

        <button
          onClick={() => window.electronAPI.maximizeWindow()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          title="Maximize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="0.75" y="0.75" width="8.5" height="8.5" rx="1" />
          </svg>
        </button>

        <button
          onClick={() => window.electronAPI.closeWindow()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-red-600 text-zinc-400 hover:text-white transition-colors"
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
