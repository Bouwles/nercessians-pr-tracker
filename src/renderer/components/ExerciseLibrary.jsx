// Exercise library — searchable, filterable list of all exercises
import { useState, useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import { CATEGORIES, CATEGORY_COLORS } from '../data/exercises';
import { getBestPR, formatDate } from '../utils/calculations';
import AddExerciseModal from './AddExerciseModal';

function ExerciseRow({ exercise, onClick }) {
  const best = getBestPR(exercise.prs);
  const color = CATEGORY_COLORS[exercise.category] || '#ef4444';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-700/40 transition-colors text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white truncate">{exercise.name}</p>
            {exercise.isCustom && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400 font-medium flex-shrink-0">custom</span>
            )}
          </div>
          <p className="text-xs text-zinc-500">{exercise.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 ml-4">
        {best ? (
          <div className="text-right">
            <p className="text-sm font-bold text-white">
              {best.weight} <span className="text-zinc-400 text-xs">{best.weightUnit}</span>
              <span className="text-zinc-500 text-xs ml-1">× {best.reps}</span>
            </p>
            <p className="text-xs text-zinc-600">{formatDate(best.date)}</p>
          </div>
        ) : (
          <p className="text-xs text-zinc-600">No entries</p>
        )}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round"
          className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

export default function ExerciseLibrary({ onSelectExercise }) {
  const { exercises } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'alpha'
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let list = [...exercises];

    // Filter by category
    if (activeCategory !== 'All') {
      list = list.filter(e => e.category === activeCategory);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => {
        const aDate = a.prs?.length ? a.prs.reduce((x, y) => (x.date > y.date ? x : y)).date : '0';
        const bDate = b.prs?.length ? b.prs.reduce((x, y) => (x.date > y.date ? x : y)).date : '0';
        return bDate.localeCompare(aDate);
      });
    }

    return list;
  }, [exercises, search, activeCategory, sortBy]);

  // Group by category for display when no search/category filter
  const grouped = useMemo(() => {
    if (activeCategory !== 'All' || search.trim()) return null;
    const map = {};
    for (const ex of filtered) {
      if (!map[ex.category]) map[ex.category] = [];
      map[ex.category].push(ex);
    }
    return map;
  }, [filtered, activeCategory, search]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Exercises</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{exercises.length} exercises · click any to view history</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Exercise
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises…"
            className="w-full bg-surface-700 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeCategory === 'All' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat ? 'text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              style={activeCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-zinc-600">Sort:</span>
          {[['recent', 'Recently Updated'], ['alpha', 'A–Z']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                sortBy === val ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm text-zinc-500">No exercises match your search.</p>
          </div>
        ) : grouped ? (
          // Grouped by category
          Object.entries(grouped).map(([cat, exs]) => (
            <div key={cat} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{cat}</h3>
                <span className="text-xs text-zinc-600">({exs.length})</span>
              </div>
              <div className="bg-surface-700 rounded-xl border border-zinc-800/60 overflow-hidden">
                {exs.map((ex, i) => (
                  <div key={ex.id} className={i < exs.length - 1 ? 'border-b border-zinc-800/60' : ''}>
                    <ExerciseRow exercise={ex} onClick={() => onSelectExercise(ex)} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat list (when searching/filtering)
          <div className="bg-surface-700 rounded-xl border border-zinc-800/60 overflow-hidden">
            {filtered.map((ex, i) => (
              <div key={ex.id} className={i < filtered.length - 1 ? 'border-b border-zinc-800/60' : ''}>
                <ExerciseRow exercise={ex} onClick={() => onSelectExercise(ex)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddExerciseModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
