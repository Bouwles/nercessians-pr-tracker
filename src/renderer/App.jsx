// Root app component — handles routing between views
import { useState } from 'react';
import { useStore } from './contexts/StoreContext';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseDetail from './components/ExerciseDetail';
import Profile from './components/Profile';

export default function App() {
  const { loading } = useStore();
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'exercises' | 'exercise-detail' | 'profile'
  const [selectedExercise, setSelectedExercise] = useState(null);

  function navigate(target, payload) {
    if (target === 'exercise-detail' && payload) {
      setSelectedExercise(payload);
      setView('exercise-detail');
    } else {
      setView(target);
      if (target !== 'exercise-detail') setSelectedExercise(null);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-900">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface-900 overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={view} onNavigate={navigate} />
        <main className="flex-1 flex overflow-hidden bg-surface-800">
          {view === 'dashboard' && (
            <Dashboard onNavigate={navigate} />
          )}
          {view === 'exercises' && (
            <ExerciseLibrary onSelectExercise={ex => navigate('exercise-detail', ex)} />
          )}
          {view === 'exercise-detail' && selectedExercise && (
            <ExerciseDetail
              exercise={selectedExercise}
              onBack={() => navigate('exercises')}
            />
          )}
          {view === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
