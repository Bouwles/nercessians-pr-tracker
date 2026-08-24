// Profile page — name, height, weight units, body weight history
import { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useStore } from '../contexts/StoreContext';
import { formatDate, formatHeight, cmToFt, ftToCm, convertWeight } from '../utils/calculations';
import WeightLogModal from './WeightLogModal';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-zinc-400 mb-1">{formatDate(d.date)}</p>
      <p className="text-sm font-bold text-white">{d.value} {d.unit}</p>
    </div>
  );
}

export default function Profile() {
  const { profile, updateProfile, reloadData } = useStore();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [backupStatus, setBackupStatus] = useState('');

  // Form state — initialised from persisted profile
  const [form, setForm] = useState({
    name: profile?.name || '',
    heightValue: profile?.height?.value || '',
    heightUnit: profile?.height?.unit || 'cm',
    weightUnit: profile?.weightUnit || 'lbs',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      name: profile?.name || '',
      heightValue: profile?.height?.value || '',
      heightUnit: profile?.height?.unit || 'cm',
      weightUnit: profile?.weightUnit || 'lbs',
    });
  }, [profile]);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    const heightVal = parseFloat(form.heightValue);
    await updateProfile({
      ...profile,
      name: form.name.trim(),
      height: {
        value: isNaN(heightVal) ? null : heightVal,
        unit: form.heightUnit,
      },
      weightUnit: form.weightUnit,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleBackupExport() {
    setBackupStatus('');
    const result = await window.electronAPI.exportBackup();
    setBackupStatus(result?.success ? 'Backup exported.' : 'Backup was not exported.');
    setTimeout(() => setBackupStatus(''), 2400);
  }

  async function handleBackupImport() {
    setBackupStatus('');
    const result = await window.electronAPI.importBackup();
    if (result?.success) {
      await reloadData();
      setBackupStatus('Backup imported.');
    } else {
      setBackupStatus(result?.error || 'Backup was not imported.');
    }
    setTimeout(() => setBackupStatus(''), 2400);
  }

  // Weight log data for the chart
  const weightLog = profile?.weightLog || [];
  const chartData = useMemo(
    () =>
      [...weightLog]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(w => ({ ...w })),
    [weightLog]
  );
  const latestWeight = weightLog.length ? weightLog[weightLog.length - 1] : null;
  const earliestWeight = weightLog.length > 1 ? weightLog[0] : null;

  const weightChange = useMemo(() => {
    if (!latestWeight || !earliestWeight) return null;
    const latest = latestWeight.unit === 'kg'
      ? convertWeight(latestWeight.value, 'kg', 'lbs')
      : latestWeight.value;
    const earliest = earliestWeight.unit === 'kg'
      ? convertWeight(earliestWeight.value, 'kg', 'lbs')
      : earliestWeight.value;
    return Math.round((latest - earliest) * 10) / 10;
  }, [latestWeight, earliestWeight]);

  const displayedHeight = form.heightValue
    ? formatHeight(
        form.heightUnit === 'ft' ? ftToCm(parseFloat(form.heightValue)) : parseFloat(form.heightValue),
        form.heightUnit
      )
    : '—';

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-sm text-zinc-500 mt-1">Your personal stats and preferences</p>
        </div>

        <div className="bg-surface-700 rounded-xl border border-zinc-800/60 p-5 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Data Backup</h2>
            <p className="text-sm text-zinc-500 mt-1">Save a JSON copy of your profile, exercises, PRs, and body-weight log.</p>
            {backupStatus && <p className="text-xs text-emerald-400 mt-2">{backupStatus}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBackupImport}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              Import
            </button>
            <button
              onClick={handleBackupExport}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              Export
            </button>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-surface-700 rounded-xl border border-zinc-800/60 p-6 mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-5">Personal Info</h2>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Your name"
                className="w-full bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step={form.heightUnit === 'cm' ? '1' : '0.01'}
                  value={form.heightValue}
                  onChange={e => set('heightValue', e.target.value)}
                  placeholder={form.heightUnit === 'cm' ? 'e.g. 180' : 'e.g. 5.9'}
                  className="flex-1 bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
                <div className="flex bg-surface-600 border border-zinc-700 rounded-lg overflow-hidden">
                  {['cm', 'ft'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => set('heightUnit', u)}
                      className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                        form.heightUnit === u ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              {form.heightValue && (
                <p className="text-xs text-zinc-500 mt-1">{displayedHeight}</p>
              )}
            </div>

            {/* Preferred weight unit */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Preferred Weight Unit</label>
              <div className="flex gap-2">
                {['lbs', 'kg'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => set('weightUnit', u)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      form.weightUnit === u
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-surface-600 text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Save Changes
              </button>
              {saved && <span className="text-sm text-emerald-400">✓ Saved</span>}
            </div>
          </form>
        </div>

        {/* Body weight section */}
        <div className="bg-surface-700 rounded-xl border border-zinc-800/60 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Body Weight</h2>
              {latestWeight && (
                <p className="text-sm text-zinc-500 mt-1">
                  Current: <span className="text-white font-semibold">{latestWeight.value} {latestWeight.unit}</span>
                  {weightChange !== null && weightChange !== 0 && (
                    <span className={`ml-2 text-xs ${weightChange > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {weightChange > 0 ? '+' : ''}{weightChange} lbs from start
                    </span>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowWeightModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Log Weight
            </button>
          </div>

          {chartData.length > 1 ? (
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
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5}
                    dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : chartData.length === 1 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Log more entries to see your weight trend.
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No weight entries yet. Log your current weight to start tracking.
            </div>
          )}

          {/* Weight history table */}
          {weightLog.length > 0 && (
            <div className="mt-4 border-t border-zinc-800/60 pt-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...weightLog].reverse().map(entry => (
                  <div key={entry.id} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{formatDate(entry.date)}</span>
                    <span className="font-semibold text-white">{entry.value} {entry.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer credit */}
        <div className="text-center py-4">
          <p className="text-xs text-zinc-600">Made by Paul Nercessian</p>
        </div>
      </div>

      {showWeightModal && (
        <WeightLogModal
          onClose={() => setShowWeightModal(false)}
          defaultUnit={form.weightUnit || 'lbs'}
        />
      )}
    </div>
  );
}
