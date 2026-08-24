// Global state management — reads/writes via Electron IPC → electron-store
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EXERCISES } from '../data/exercises';
import { todayStr } from '../utils/calculations';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [profile, setProfileState] = useState(null);
  const [exercises, setExercisesState] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Load persisted data on mount ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const data = await window.electronAPI.getAllData();

      if (data.profile) setProfileState(data.profile);

      if (data.exercises && data.exercises.length > 0) {
        setExercisesState(data.exercises);
      } else {
        // First launch — seed with default exercises
        const defaults = DEFAULT_EXERCISES.map(ex => ({
          id: uuidv4(),
          name: ex.name,
          category: ex.category,
          isCustom: false,
          prs: [],
        }));
        setExercisesState(defaults);
        await window.electronAPI.setData('exercises', defaults);
      }

      setLoading(false);
    }
    load();
  }, []);

  // ── Helper: persist exercises ────────────────────────────────────────────
  const saveExercises = useCallback(async (updated) => {
    setExercisesState(updated);
    await window.electronAPI.setData('exercises', updated);
    return updated;
  }, []);

  // ── Profile ──────────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (profileData) => {
    const updated = { ...profileData };
    setProfileState(updated);
    await window.electronAPI.setData('profile', updated);
  }, []);

  // ── Body weight log ──────────────────────────────────────────────────────
  const addWeightLog = useCallback(async (value, unit, date = todayStr()) => {
    const current = profile || {};
    const weightLog = [...(current.weightLog || [])];
    weightLog.push({ id: uuidv4(), value, unit, date });
    // Sort ascending
    weightLog.sort((a, b) => a.date.localeCompare(b.date));
    const updated = { ...current, weightLog };
    setProfileState(updated);
    await window.electronAPI.setData('profile', updated);
  }, [profile]);

  // ── Exercises ────────────────────────────────────────────────────────────
  const addExercise = useCallback(async (name, category) => {
    const trimmedName = String(name || '').trim();
    const exists = exercises.some(ex => ex.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) throw new Error('An exercise with that name already exists.');
    const newEx = { id: uuidv4(), name: trimmedName, category, isCustom: true, prs: [] };
    const updated = [...exercises, newEx];
    return saveExercises(updated);
  }, [exercises, saveExercises]);

  const deleteExercise = useCallback(async (exerciseId) => {
    const updated = exercises.filter(ex => ex.id !== exerciseId);
    return saveExercises(updated);
  }, [exercises, saveExercises]);

  // ── PR entries ───────────────────────────────────────────────────────────
  const logPR = useCallback(async (exerciseId, { date, weight, weightUnit, reps, note }) => {
    const updated = exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const newPR = { id: uuidv4(), date, weight: parseFloat(weight), weightUnit, reps: parseInt(reps, 10), note: note || '' };
      return { ...ex, prs: [...(ex.prs || []), newPR] };
    });
    return saveExercises(updated);
  }, [exercises, saveExercises]);

  const deletePR = useCallback(async (exerciseId, prId) => {
    const updated = exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, prs: ex.prs.filter(p => p.id !== prId) };
    });
    return saveExercises(updated);
  }, [exercises, saveExercises]);

  const editPR = useCallback(async (exerciseId, prId, fields) => {
    const updated = exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        prs: ex.prs.map(p =>
          p.id === prId ? { ...p, ...fields, weight: parseFloat(fields.weight ?? p.weight), reps: parseInt(fields.reps ?? p.reps, 10) } : p
        ),
      };
    });
    return saveExercises(updated);
  }, [exercises, saveExercises]);

  return (
    <StoreContext.Provider value={{
      loading,
      profile,
      exercises,
      updateProfile,
      addWeightLog,
      addExercise,
      deleteExercise,
      logPR,
      deletePR,
      editPR,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
