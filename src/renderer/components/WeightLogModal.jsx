// Modal for logging a new body weight entry
import { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { todayStr } from '../utils/calculations';

export default function WeightLogModal({ onClose, defaultUnit = 'lbs' }) {
  const { addWeightLog } = useStore();
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(defaultUnit);
  const [date, setDate] = useState(todayStr());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value || parseFloat(value) <= 0) {
      setError('Please enter a valid weight.');
      return;
    }
    setSaving(true);
    await addWeightLog(parseFloat(value), unit, date);
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Log Body Weight</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="e.g. 185"
                autoFocus
                className="flex-1 bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <div className="flex bg-surface-600 border border-zinc-700 rounded-lg overflow-hidden">
                {['lbs', 'kg'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                      unit === u ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Log Weight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
