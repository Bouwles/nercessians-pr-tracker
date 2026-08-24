// Dashboard — home screen with summary stats, recent activity, spotlight graphs
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useStore } from '../contexts/StoreContext';
import {
  countPRsThisMonth, getRecentlyUpdated, buildChartData, formatDate, getBestPR, generateCSV, totalTrainingVolume,
} from '../utils/calculations';
import { CATEGORY_COLORS } from '../data/exercises';

// Spotlight exercise names to show on the dashboard
const SPOTLIGHT = ['Bench Press (Barbell)', 'Squat (Barbell)', 'Deadlift', 'Overhead Press (Barbell)'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-zinc-400 mb-1">{payload[0]?.payload?.displayDate || label}</p>
      <p className="text-sm font-bold text-white">{payload[0]?.value} {payload[0]?.name === 'oneRM' ? '(Est. 1RM)' : 'lbs'}</p>
      {payload[0]?.payload?.reps && (
        <p className="text-xs text-zinc-400">{payload[0].payload.reps} reps</p>
      )}
    </div>
  );
}

function SpotlightCard({ exercise, onNavigate }) {
  const data = buildChartData(exercise.prs);
  const best = getBestPR(exercise.prs);
  const color = CATEGORY_COLORS[exercise.category] || '#ef4444';

  return (
    <div
      className="bg-surface-700 rounded-xl p-4 border border-zinc-800/60 hover:border-zinc-700 transition-colors cursor-pointer"
      onClick={onNavigate}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{exercise.name}</h3>
          <p className="text-xs text-zinc-500">{exercise.category}</p>
        </div>
        {best && (
          <div className="text-right">
            <p className="text-lg font-bold text-white">{best.weight}<span className="text-xs text-zinc-400 ml-1">{best.weightUnit}</span></p>
            <p className="text-xs text-zinc-500">× {best.reps} reps</p>
          </div>
        )}
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="weight" stroke={color} strokeWidth={2} dot={false} />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const { profile, exercises } = useStore();
  const [exporting, setExporting] = useState(false);

  const prsThisMonth = countPRsThisMonth(exercises);
  const recent = getRecentlyUpdated(exercises, 5);
  const totalPRs = exercises.reduce((s, e) => s + (e.prs?.length || 0), 0);
  const volume = totalTrainingVolume(exercises);

  const spotlightExercises = SPOTLIGHT.map(name =>
    exercises.find(e => e.name === name)
  ).filter(e => e && e.prs?.length > 0);

  async function handleExport() {
    setExporting(true);
    const csv = generateCSV(exercises);
    const date = new Date().toISOString().slice(0, 10);
    await window.electronAPI.exportCSV(csv, `pr-data-${date}.csv`);
    setExporting(false);
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}{profile?.name ? `, ${profile.name}` : ''}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {prsThisMonth > 0
              ? `You've logged ${prsThisMonth} PR${prsThisMonth !== 1 ? 's' : ''} this month. Keep grinding! 💪`
              : 'No PRs logged this month yet — time to hit the gym!'}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Exercises',
            value: exercises.length,
            color: 'text-blue-400',
            icon: '🏋️',
          },
          {
            label: 'Total PRs Logged',
            value: totalPRs,
            color: 'text-red-400',
            icon: '🏆',
          },
          {
            label: 'PRs This Month',
            value: prsThisMonth,
            color: 'text-emerald-400',
            icon: '📈',
          },
          {
            label: 'Logged Volume',
            value: volume > 0 ? volume.toLocaleString() : '—',
            color: 'text-amber-400',
            icon: 'VOL',
          },
        ].map(card => (
          <div key={card.label} className="bg-surface-700 rounded-xl p-4 border border-zinc-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{card.icon}</span>
              <span className={`text-xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-xs text-zinc-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Spotlight graphs */}
      {spotlightExercises.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Top Lifts</h2>
          <div className="grid grid-cols-2 gap-4">
            {spotlightExercises.map(ex => (
              <SpotlightCard
                key={ex.id}
                exercise={ex}
                onNavigate={() => onNavigate('exercise-detail', ex)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently updated */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Activity</h2>
          <div className="bg-surface-700 rounded-xl border border-zinc-800/60 overflow-hidden">
            {recent.map((ex, i) => {
              const best = getBestPR(ex.prs);
              const latest = ex.prs.reduce((a, b) => (a.date > b.date ? a : b));
              return (
                <button
                  key={ex.id}
                  onClick={() => onNavigate('exercise-detail', ex)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-700/50 transition-colors text-left ${
                    i < recent.length - 1 ? 'border-b border-zinc-800/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[ex.category] || '#ef4444' }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{ex.name}</p>
                      <p className="text-xs text-zinc-500">{ex.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {latest.weight} {latest.weightUnit} × {latest.reps}
                    </p>
                    <p className="text-xs text-zinc-500">{formatDate(latest.date)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recent.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <h3 className="text-lg font-semibold text-white mb-2">No PRs yet</h3>
          <p className="text-sm text-zinc-500 max-w-xs">
            Head to Exercises, pick a lift, and log your first PR to get started.
          </p>
        </div>
      )}
    </div>
  );
}
