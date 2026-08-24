// ─── PR & Fitness Calculations ────────────────────────────────────────────────

/**
 * Estimate 1-Rep Max using the Epley formula.
 * For 1 rep, returns the weight as-is.
 */
export function epley1RM(weight, reps) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Convert weight between kg and lbs.
 */
export function convertWeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'kg' && toUnit === 'lbs') return Math.round(value * 2.20462 * 10) / 10;
  if (fromUnit === 'lbs' && toUnit === 'kg') return Math.round(value / 2.20462 * 10) / 10;
  return value;
}

/**
 * Convert height between cm and ft/in.
 * Returns { value, display } where display is "5'11\"" for imperial.
 */
export function formatHeight(value, unit) {
  if (unit === 'cm') return `${value} cm`;
  const totalInches = Math.round(value / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

/**
 * Convert height cm to ft decimal for input.
 */
export function cmToFt(cm) {
  return Math.round((cm / 30.48) * 100) / 100;
}

export function ftToCm(ft) {
  return Math.round(ft * 30.48);
}

/**
 * Get the best (highest 1RM) PR entry from an array of entries.
 */
export function getBestPR(entries) {
  if (!entries || entries.length === 0) return null;
  return entries.reduce((best, entry) => {
    const e1rm = epley1RM(entry.weight, entry.reps);
    const b1rm = epley1RM(best.weight, best.reps);
    return e1rm > b1rm ? entry : best;
  });
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Return today as YYYY-MM-DD string.
 */
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Count PRs logged in the current calendar month.
 */
export function countPRsThisMonth(exercises) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let count = 0;
  for (const ex of exercises) {
    for (const pr of (ex.prs || [])) {
      const d = new Date(pr.date + 'T00:00:00');
      if (d.getFullYear() === year && d.getMonth() === month) count++;
    }
  }
  return count;
}

/**
 * Get the N most recently updated exercises (by latest PR date).
 */
export function getRecentlyUpdated(exercises, n = 5) {
  return exercises
    .filter(ex => ex.prs && ex.prs.length > 0)
    .map(ex => {
      const latest = ex.prs.reduce((a, b) => (a.date > b.date ? a : b));
      return { ...ex, latestDate: latest.date };
    })
    .sort((a, b) => b.latestDate.localeCompare(a.latestDate))
    .slice(0, n);
}

/**
 * Build chart data for an exercise: sorted entries with date + weight + 1RM.
 */
export function buildChartData(prs) {
  if (!prs || prs.length === 0) return [];
  return [...prs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(pr => ({
      date: pr.date,
      displayDate: formatDate(pr.date),
      weight: pr.weight,
      oneRM: epley1RM(pr.weight, pr.reps),
      reps: pr.reps,
    }));
}

export function csvCell(value) {
  const text = String(value ?? '');
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Generate CSV content for all exercises and their PR history.
 */
export function generateCSV(exercises) {
  const rows = [['Exercise', 'Category', 'Date', 'Weight', 'Weight Unit', 'Reps', 'Est. 1RM', 'Note']];
  for (const ex of exercises) {
    for (const pr of (ex.prs || [])) {
      rows.push([
        ex.name,
        ex.category,
        pr.date,
        pr.weight,
        pr.weightUnit || 'lbs',
        pr.reps,
        epley1RM(pr.weight, pr.reps),
        pr.note || '',
      ]);
    }
  }
  return rows.map(row => row.map(csvCell).join(',')).join('\n');
}
