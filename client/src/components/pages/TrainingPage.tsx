import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import type { Workout, Exercise } from '../../types';

export const TrainingSchedulePage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('trainr_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Save workouts to localStorage
  useEffect(() => {
    localStorage.setItem('trainr_workouts', JSON.stringify(workouts));
  }, [workouts]);

  const workoutsForSelectedDate = workouts.filter(w => w.date === selectedDate);

  const handleAddWorkout = (newWorkout: Workout) => {
    if (editingWorkout) {
      setWorkouts(workouts.map(w => (w.id === editingWorkout.id ? newWorkout : w)));
    } else {
      setWorkouts([...workouts, newWorkout]);
    }
    setShowModal(false);
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowModal(true);
  };

  const handleCompleteWorkout = (id: string) => {
    setWorkouts(
      workouts.map(w =>
        w.id === id ? { ...w, completed: !w.completed } : w
      )
    );
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const currentDate = new Date(selectedDate);
  const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = getDaysInMonth(monthDate);
  const firstDay = getFirstDayOfMonth(monthDate);
  const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const workoutStats = {
    thisWeek: workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return workoutDate >= weekStart && workoutDate <= new Date();
    }).length,
    completed: workouts.filter(w => w.completed).length,
    totalDuration: workouts.reduce((acc, w) => acc + w.duration, 0),
  };

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Training Schedule
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Plan and manage your workout routines
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className={`rounded-lg p-6 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-blue-600 text-3xl font-bold mb-2">
              {workoutStats.thisWeek}
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Workouts This Week
            </p>
          </div>

          <div
            className={`rounded-lg p-6 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-green-600 text-3xl font-bold mb-2">
              {workoutStats.completed}
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Completed
            </p>
          </div>

          <div
            className={`rounded-lg p-6 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-orange-600 text-3xl font-bold mb-2">
              {workoutStats.totalDuration}h
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Total Duration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Sidebar */}
          <div
            className={`lg:col-span-1 rounded-lg p-6 h-fit ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {monthName}
            </h2>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className={`text-center text-xs font-semibold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dateStr =
                  day ?
                    `${monthDate.getFullYear()}-${String(
                      monthDate.getMonth() + 1
                    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null;
                const hasWorkout = dateStr && workouts.some(w => w.date === dateStr);
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={idx}
                    onClick={() => dateStr && setSelectedDate(dateStr)}
                    className={`aspect-square rounded text-xs font-semibold transition-colors ${
                      !day
                        ? ''
                        : isSelected
                          ? 'bg-blue-600 text-white'
                          : hasWorkout
                            ? isDark
                              ? 'bg-green-900 text-green-200 hover:bg-green-800'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {new Date(selectedDate).toLocaleDateString('default', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <button
                onClick={() => {
                  setEditingWorkout(null);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                + Add Workout
              </button>
            </div>

            {/* Workouts List */}
            <div className="space-y-4">
              {workoutsForSelectedDate.length > 0 ? (
                workoutsForSelectedDate.map(workout => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onEdit={() => handleEditWorkout(workout)}
                    onDelete={() => handleDeleteWorkout(workout.id)}
                    onComplete={() => handleCompleteWorkout(workout.id)}
                    isDark={isDark}
                  />
                ))
              ) : (
                <div
                  className={`rounded-lg p-12 text-center ${
                    isDark
                      ? 'bg-gray-800 border border-dashed border-gray-700'
                      : 'bg-white border-2 border-dashed border-gray-300'
                  }`}
                >
                  <svg
                    className={`w-12 h-12 mx-auto mb-3 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0V6m0 0h-6m0 0V0"
                    />
                  </svg>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    No workouts scheduled
                  </p>
                  <p
                    className={`mt-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Click "Add Workout" to schedule your first workout!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddWorkoutModal
          workout={editingWorkout}
          selectedDate={selectedDate}
          onSave={handleAddWorkout}
          onClose={() => {
            setShowModal(false);
            setEditingWorkout(null);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
};

interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  isDark: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
  onComplete,
  isDark,
}) => {
  const typeColors: Record<string, string> = {
    cardio: 'from-red-500 to-red-600',
    strength: 'from-blue-500 to-blue-600',
    flexibility: 'from-purple-500 to-purple-600',
    sports: 'from-green-500 to-green-600',
    other: 'from-gray-500 to-gray-600',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    cardio: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M15.5 1H4.5C3.12 1 2 2.12 2 3.5v13C2 17.88 3.12 19 4.5 19h11c1.38 0 2.5-1.12 2.5-2.5v-13C18 2.12 16.88 1 15.5 1zm-4 15H9v-5H8l4-6 4 6h-1v5z" />
      </svg>
    ),
    strength: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.5 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM2 7a3 3 0 016 0v8a1 1 0 001 1h2a1 1 0 001-1V7a3 3 0 116 0v2a1 1 0 11-2 0V7a1 1 0 00-1-1H9a1 1 0 00-1 1v8a3 3 0 11-6 0V7z" clipRule="evenodd" />
      </svg>
    ),
    flexibility: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 10a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 11-2 0v-7H7v7a1 1 0 11-2 0v-8z" />
      </svg>
    ),
    sports: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    other: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border transition-all ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      } ${workout.completed ? (isDark ? 'opacity-60' : 'opacity-50') : ''}`}
    >
      <div className="flex items-start justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          {/* Type Badge */}
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${typeColors[workout.type]} text-white`}
          >
            {typeIcons[workout.type]}
          </div>

          {/* Workout Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                } ${workout.completed ? 'line-through' : ''}`}
              >
                {workout.name}
              </h3>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  workout.intensity === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : workout.intensity === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                {workout.intensity}
              </span>
            </div>

            <p
              className={`text-sm mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              ⏱️ {workout.duration} min • {workout.exercises.length} exercises
            </p>

            {workout.exercises.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {workout.exercises.slice(0, 3).map(ex => (
                  <span
                    key={ex.id}
                    className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ex.name}
                  </span>
                ))}
                {workout.exercises.length > 3 && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    +{workout.exercises.length - 3}
                  </span>
                )}
              </div>
            )}

            {workout.notes && (
              <p
                className={`text-sm italic ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                "{workout.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onComplete}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                : 'bg-gray-100 text-green-600 hover:bg-gray-200'
            }`}
            title="Mark complete"
          >
            <svg
              className="w-5 h-5"
              fill={workout.completed ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
            }`}
            title="Edit"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                : 'bg-gray-100 text-red-600 hover:bg-gray-200'
            }`}
            title="Delete"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddWorkoutModalProps {
  workout: Workout | null;
  selectedDate: string;
  onSave: (workout: Workout) => void;
  onClose: () => void;
  isDark: boolean;
}

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  workout,
  selectedDate,
  onSave,
  onClose,
  isDark,
}) => {
  const [formData, setFormData] = useState<Workout>(
    workout || {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      name: '',
      type: 'strength',
      duration: 60,
      intensity: 'moderate',
      exercises: [],
      completed: false,
    }
  );

  const [newExercise, setNewExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: 3,
    reps: 10,
  });

  const handleAddExercise = () => {
    if (newExercise.name.trim()) {
      setFormData({
        ...formData,
        exercises: [
          ...formData.exercises,
          { ...newExercise, id: Math.random().toString(36).substr(2, 9) },
        ],
      });
      setNewExercise({ id: '', name: '', sets: 3, reps: 10 });
    }
  };

  const handleRemoveExercise = (id: string) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter(e => e.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {workout ? 'Edit Workout' : 'Add Workout'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Workout Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Push Day"
                className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Type
              </label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Workout['type'],
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                value={formData.duration}
                onChange={e =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
                className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Intensity
              </label>
              <select
                value={formData.intensity}
                onChange={e =>
                  setFormData({
                    ...formData,
                    intensity: e.target.value as Workout['intensity'],
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this workout..."
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Exercises */}
          <div>
            <h3
              className={`text-lg font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Exercises
            </h3>

            {formData.exercises.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.exercises.map(exercise => (
                  <div
                    key={exercise.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {exercise.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight}lbs`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Exercise */}
            <div
              className={`p-4 rounded-lg border-2 border-dashed ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={e =>
                    setNewExercise({ ...newExercise, name: e.target.value })
                  }
                  placeholder="Exercise name"
                  className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="1"
                  value={newExercise.sets}
                  onChange={e =>
                    setNewExercise({
                      ...newExercise,
                      sets: parseInt(e.target.value),
                    })
                  }
                  placeholder="Sets"
                  className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="1"
                  value={newExercise.reps}
                  onChange={e =>
                    setNewExercise({
                      ...newExercise,
                      reps: parseInt(e.target.value),
                    })
                  }
                  placeholder="Reps"
                  className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {workout ? 'Update' : 'Create'} Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
