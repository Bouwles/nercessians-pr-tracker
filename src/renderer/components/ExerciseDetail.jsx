// Exercise detail — PR history, chart, log new entry
import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot,
} from 'recharts';
import { useStore } from '../contexts/StoreContext';
import {
  buildChartData, epley1RM, formatDate, getBestPR,
} from '../utils/calculations';
import { CATEGORY_COLORS } from '../data/exercises';
import LogPRModal from './LogPRModal';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-zinc-400 mb-1">{d.displayDate}</p>
      <p className="text-sm font-bold text-white">
        {payload[0].value} <span className="text-zinc-400 font-normal text-xs">{payload[0].name === 'oneRM' ? 'est. 1RM' : 'lbs'}</span>
      </p>
      <p className="text-xs text-zinc-400">{d.weight} × {d.reps} reps</p>
    </div>
  );
}

export default function ExerciseDetail({ exercise: exerciseProp, onBack }) {
  const { exercises, deletePR, deleteExercise } = useStore();
  // Keep in sync with store
  const exercise = exercises.find(e => e.id === exerciseProp.id) || exerciseProp;

  const [showLog, setShowLog] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [chartMetric, setChartMetric] = useState('weight'); // 'weight' | 'oneRM'
  const [confirmDelete, setConfirmDelete] = useState(null); // prId to delete
  const [confirmDeleteEx, setConfirmDeleteEx] = useState(false);

  const accentColor = CATEGORY_COLORS[exercise.category] || '#ef4444';
  const chartData = useMemo(() => buildChartData(exercise.prs), [exercise.prs]);
  const best = useMemo(() => getBestPR(exercise.prs), [exercise.prs]);
  const sortedPRs = useMemo(
    () => [...(exercise.prs || [])].sort((a, b) => b.date.localeCompare(a.date)),
    [exercise.prs]
  );

  async function handleDeletePR(prId) {
    await deletePR(exercise.id, prId);
    setConfirmDelete(null);
  }

  async function handleDeleteExercise() {
    await deleteExercise(exercise.id);
    onBack();
  }

  const bestOneRM = best ? epley1RM(best.weight, best.reps) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-zinc-800/60">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700/50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{exercise.name}</h1>
                {exercise.isCustom && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400">custom</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-sm text-zinc-400">{exercise.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {exercise.isCustom && (
              <button
                onClick={() => setConfirmDeleteEx(true)}
                className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-700/50 transition-colors"
                title="Delete exercise"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowLog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Log PR
            </button>
          </div>
        </div>

        {/* PR stats */}
        {best && (
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">All-Time Best</p>
              <p className="text-2xl font-bold text-white">
                {best.weight}
                <span className="text-sm text-zinc-400 font-normal ml-1">{best.weightUnit}</span>
                <span className="text-sm text-zinc-500 ml-2">× {best.reps} reps</span>
              </p>
            </div>
            <div className="w-px h-10 bg-zinc-800" />
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Est. 1RM</p>
              <p className="text-2xl font-bold" style={{ color: accentColor }}>
                {bestOneRM}
                <span className="text-sm text-zinc-400 font-normal ml-1">{best.weightUnit}</span>
              </p>
            </div>
            <div className="w-px h-10 bg-zinc-800" />
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Total Entries</p>
              <p className="text-2xl font-bold text-white">{exercise.prs?.length || 0}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Chart */}
        {chartData.length > 1 && (
          <div className="bg-surface-700 rounded-xl border border-zinc-800/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Progress Over Time</h2>
              <div className="flex bg-surface-600 rounded-lg overflow-hidden border border-zinc-700">
                {[['weight', 'Weight'], ['oneRM', 'Est. 1RM']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setChartMetric(val)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      chartMetric === val ? 'text-white' : 'text-zinc-500 hover:text-white'
                    }`}
                    style={chartMetric === val ? { backgroundColor: accentColor } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    tickFormatter={d => {
                      const dt = new Date(d + 'T00:00:00');
                      return `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()}`;
                    }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey={chartMetric}
                    stroke={accentColor}
                    strokeWidth={2.5}
                    dot={{ fill: accentColor, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: accentColor, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History table */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Entry History</h2>
          {sortedPRs.length === 0 ? (
            <div className="bg-surface-700 rounded-xl border border-zinc-800/60 p-8 text-center">
              <p className="text-zinc-500 text-sm">No entries yet. Click "Log PR" to add your first.</p>
            </div>
          ) : (
            <div className="bg-surface-700 rounded-xl border border-zinc-800/60 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-surface-800/50 border-b border-zinc-800/60">
                {['Date', 'Weight', 'Reps', 'Est. 1RM', ''].map((h, i) => (
                  <div key={i} className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</div>
                ))}
              </div>

              {sortedPRs.map((pr, i) => {
                const isBest = best && pr.id === best.id;
                const oneRM = epley1RM(pr.weight, pr.reps);
                return (
                  <div
                    key={pr.id}
                    className={`grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-zinc-700/30 ${
                      i < sortedPRs.length - 1 ? 'border-b border-zinc-800/60' : ''
                    }`}
                  >
                    <div className="text-sm text-zinc-300">{formatDate(pr.date)}</div>
                    <div className="text-sm font-medium text-white">
                      {pr.weight} <span className="text-zinc-500 text-xs">{pr.weightUnit}</span>
                    </div>
                    <div className="text-sm text-zinc-300">{pr.reps}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={isBest ? { color: accentColor } : { color: '#a1a1aa' }}>
                        {oneRM}
                      </span>
                      {isBest && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                        >
                          BEST
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditEntry(pr); setShowLog(true); }}
                        className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 transition-colors"
                        title="Edit"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(pr.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                    {/* Note row */}
                    {pr.note && (
                      <div className="col-span-5 -mt-1 pb-1">
                        <p className="text-xs text-zinc-500 italic">{pr.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLog && (
        <LogPRModal
          exercise={exercise}
          editEntry={editEntry}
          onClose={() => { setShowLog(false); setEditEntry(null); }}
        />
      )}

      {/* Confirm delete PR */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm">
            <h3 className="text-base font-bold text-white mb-2">Delete Entry?</h3>
            <p className="text-sm text-zinc-400 mb-5">This will permanently remove this PR entry.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => handleDeletePR(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete exercise */}
      {confirmDeleteEx && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm">
            <h3 className="text-base font-bold text-white mb-2">Delete Exercise?</h3>
            <p className="text-sm text-zinc-400 mb-5">This will permanently delete "{exercise.name}" and all its PR history.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteEx(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleDeleteExercise} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
