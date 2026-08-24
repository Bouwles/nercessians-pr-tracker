// Navigation sidebar
import { useStore } from '../contexts/StoreContext';

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'exercises',
    label: 'Exercises',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 9l2 3-2 3M22 9l-2 3 2 3" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentView, onNavigate }) {
  const { profile, exercises } = useStore();
  const totalPRs = exercises.reduce((sum, ex) => sum + (ex.prs?.length || 0), 0);

  return (
    <aside className="w-56 flex-shrink-0 bg-surface-800 border-r border-zinc-800/60 flex flex-col">
      {/* Logo / Branding */}
      <div className="px-5 pt-6 pb-5 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">PR Tracker</div>
            <div className="text-xs text-zinc-500">{profile?.name || 'Set up profile'}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = currentView === item.id || (currentView === 'exercise-detail' && item.id === 'exercises');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-red-600/15 text-red-400 border border-red-600/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <span className={active ? 'text-red-400' : ''}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Stats summary */}
      <div className="px-4 py-4 border-t border-zinc-800/60">
        <div className="bg-surface-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Total Exercises</span>
            <span className="text-xs font-bold text-white">{exercises.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Total PRs Logged</span>
            <span className="text-xs font-bold text-red-400">{totalPRs}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <p className="text-[10px] text-zinc-600 text-center">Made by Paul Nercessian</p>
      </div>
    </aside>
  );
}
