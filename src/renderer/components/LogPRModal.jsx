// Modal for logging a new PR entry for a given exercise
import { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { todayStr } from '../utils/calculations';

const MAX_NOTE_LENGTH = 180;

export default function LogPRModal({ exercise, onClose, editEntry }) {
  const { logPR, editPR } = useStore();
  const isEdit = !!editEntry;

  const [form, setForm] = useState({
    date: editEntry?.date || todayStr(),
    weight: editEntry?.weight ?? '',
    weightUnit: editEntry?.weightUnit || 'lbs',
    reps: editEntry?.reps ?? '',
    note: editEntry?.note || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.weight || !form.reps || !form.date) {
      setError('Date, weight, and reps are required.');
      return;
    }
    if (form.date > todayStr()) {
      setError('PR date cannot be in the future.');
      return;
    }
    if (parseFloat(form.weight) <= 0 || parseInt(form.reps, 10) <= 0) {
      setError('Weight and reps must be positive numbers.');
      return;
    }
    if (form.note.length > MAX_NOTE_LENGTH) {
      setError(`Notes must be ${MAX_NOTE_LENGTH} characters or less.`);
      return;
    }
    setSaving(true);
    if (isEdit) {
      await editPR(exercise.id, editEntry.id, form);
    } else {
      await logPR(exercise.id, form);
    }
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Entry' : 'Log PR'}</h2>
            <p className="text-sm text-zinc-500">{exercise.name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              max={todayStr()}
              onChange={e => set('date', e.target.value)}
              className="w-full bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Weight + Unit */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.weight}
                onChange={e => set('weight', e.target.value)}
                placeholder="e.g. 225"
                className="flex-1 bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <div className="flex bg-surface-600 border border-zinc-700 rounded-lg overflow-hidden">
                {['lbs', 'kg'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => set('weightUnit', u)}
                    className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                      form.weightUnit === u
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reps */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Reps</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.reps}
              onChange={e => set('reps', e.target.value)}
              placeholder="e.g. 5"
              className="w-full bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Note <span className="text-zinc-600">(optional)</span></label>
            <textarea
              value={form.note}
              onChange={e => set('note', e.target.value)}
              maxLength={MAX_NOTE_LENGTH}
              placeholder="e.g. Felt strong today, paused at bottom"
              rows={2}
              className="w-full bg-surface-600 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
            <p className="text-[11px] text-zinc-600 mt-1 text-right">{form.note.length}/{MAX_NOTE_LENGTH}</p>
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
              {saving ? 'Saving…' : isEdit ? 'Update' : 'Log PR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
