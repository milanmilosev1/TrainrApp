import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  timestamp: string; // ISO time
}

interface DailyLog {
  date: string; // ISO date
  entries: FoodEntry[];
  calorieGoal: number;
}

const commonFoods = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice (1 cup)', calories: 215, protein: 5, carbs: 45, fat: 1.8 },
  { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: 'Egg (large)', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Oats (1 cup)', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Almonds (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fat: 0.4 },
  { name: 'Sweet Potato (medium)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
  { name: 'Spinach (1 cup)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
  { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8, carbs: 7, fat: 16 },
  { name: 'Beef Ground (100g)', calories: 250, protein: 26, carbs: 0, fat: 17 },
  { name: 'Pasta (1 cup cooked)', calories: 196, protein: 8, carbs: 37, fat: 1.1 },
  { name: 'Avocado (1/2)', calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8 },
  { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Cheese (1 oz)', calories: 113, protein: 7, carbs: 0.4, fat: 9.5 },
  { name: 'Bread Slice', calories: 79, protein: 4, carbs: 14, fat: 1 },
  { name: 'Tuna (100g)', calories: 132, protein: 29, carbs: 0, fat: 0.5 },
];

export const CalorieTrackingPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('trainr_calorie_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(2000);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trainr_calorie_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const currentDayLog = dailyLogs.find(log => log.date === selectedDate) || {
    date: selectedDate,
    entries: [],
    calorieGoal: calorieGoal,
  };

  const totalCalories = currentDayLog.entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = currentDayLog.entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = currentDayLog.entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = currentDayLog.entries.reduce((sum, entry) => sum + entry.fat, 0);

  const caloriesRemaining = currentDayLog.calorieGoal - totalCalories;
  const percentageUsed = (totalCalories / currentDayLog.calorieGoal) * 100;

  const handleAddFood = (food: (typeof commonFoods)[0]) => {
    const newEntry: FoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.name.split('(')[1]?.replace(')', '') || '1 serving',
      timestamp: new Date().toISOString(),
    };

    const existingLog = dailyLogs.find(log => log.date === selectedDate);
    if (existingLog) {
      setDailyLogs(
        dailyLogs.map(log =>
          log.date === selectedDate
            ? { ...log, entries: [...log.entries, newEntry] }
            : log
        )
      );
    } else {
      setDailyLogs([
        ...dailyLogs,
        {
          date: selectedDate,
          entries: [newEntry],
          calorieGoal: calorieGoal,
        },
      ]);
    }
    setShowAddModal(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    setDailyLogs(
      dailyLogs.map(log =>
        log.date === selectedDate
          ? { ...log, entries: log.entries.filter(e => e.id !== entryId) }
          : log
      )
    );
  };

  const handleChangeGoal = (newGoal: number) => {
    setCalorieGoal(newGoal);
    setDailyLogs(
      dailyLogs.map(log =>
        log.date === selectedDate ? { ...log, calorieGoal: newGoal } : log
      )
    );
  };

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Calorie Tracking
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Monitor your daily caloric intake and nutrition
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <div>
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
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                setSelectedDate(prev.toISOString().split('T')[0]);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              â† Previous
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === today
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                const maxDate = new Date();
                if (next <= maxDate) {
                  setSelectedDate(next.toISOString().split('T')[0]);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              Next â†’
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calorie Progress */}
            <div
              className={`rounded-lg p-8 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Daily Progress
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  + Add Food
                </button>
              </div>

              {/* Circular Progress */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-64 h-64">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 200 200"
                  >
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={isDark ? '#374151' : '#e5e7eb'}
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={
                        totalCalories > currentDayLog.calorieGoal
                          ? '#ef4444'
                          : '#f97316'
                      }
                      strokeWidth="8"
                      strokeDasharray={`${
                        Math.min(percentageUsed, 100) * 5.65
                      } 565`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className={`text-5xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {totalCalories}
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      of {currentDayLog.calorieGoal} cal
                    </div>
                    <div
                      className={`text-xs font-semibold mt-2 px-3 py-1 rounded-full ${
                        caloriesRemaining >= 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {caloriesRemaining >= 0 ? '+' : ''}{caloriesRemaining} remaining
                    </div>
                  </div>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-4">
                <MacroCard
                  label="Protein"
                  value={totalProtein.toFixed(1)}
                  unit="g"
                  color="from-red-500 to-red-600"
                  isDark={isDark}
                />
                <MacroCard
                  label="Carbs"
                  value={totalCarbs.toFixed(1)}
                  unit="g"
                  color="from-blue-500 to-blue-600"
                  isDark={isDark}
                />
                <MacroCard
                  label="Fat"
                  value={totalFat.toFixed(1)}
                  unit="g"
                  color="from-yellow-500 to-yellow-600"
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Food Entries */}
            <div
              className={`rounded-lg p-8 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Food Log
              </h3>

              {currentDayLog.entries.length > 0 ? (
                <div className="space-y-3">
                  {currentDayLog.entries
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )
                    .map(entry => (
                      <FoodEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={() => handleDeleteEntry(entry.id)}
                        isDark={isDark}
                      />
                    ))}
                </div>
              ) : (
                <div
                  className={`text-center py-8 rounded-lg border-2 border-dashed ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <p
                    className={`${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No foods logged yet. Click "Add Food" to get started!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calorie Goal */}
            <div
              className={`rounded-lg p-6 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Daily Goal
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={currentDayLog.calorieGoal}
                  onChange={e => handleChangeGoal(parseInt(e.target.value) || 2000)}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <span
                  className={`px-3 py-2 rounded-lg ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  cal
                </span>
              </div>
              <div className="space-y-2">
                {[1500, 1800, 2000, 2500].map(goal => (
                  <button
                    key={goal}
                    onClick={() => handleChangeGoal(goal)}
                    className={`w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      currentDayLog.calorieGoal === goal
                        ? 'bg-orange-600 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {goal} cal
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div
              className={`rounded-lg p-6 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Total Entries:
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {currentDayLog.entries.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Avg Calories per Item:
                  </span>
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {currentDayLog.entries.length > 0
                      ? (totalCalories / currentDayLog.entries.length).toFixed(0)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Macros Ratio:
                  </span>
                  <span
                    className={`font-semibold text-xs ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    P{((totalProtein / totalCalories) * 100).toFixed(0)}% C
                    {((totalCarbs / totalCalories) * 100).toFixed(0)}% F
                    {((totalFat / totalCalories) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <AddFoodModal
          commonFoods={commonFoods}
          filteredFoods={filteredFoods}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectFood={handleAddFood}
          onClose={() => {
            setShowAddModal(false);
            setSearchTerm('');
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
};

interface MacroCardProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  isDark: boolean;
}

const MacroCard: React.FC<MacroCardProps> = ({
  label,
  value,
  unit,
  color,
  isDark,
}) => (
  <div
    className={`rounded-lg p-4 text-center ${
      isDark ? 'bg-gray-700' : 'bg-gray-50'
    }`}
  >
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${color} text-white mb-2`}
    >
      <span className="font-bold text-sm">{label[0]}</span>
    </div>
    <div
      className={`text-2xl font-bold ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}
    >
      {value}{unit}
    </div>
    <div
      className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
    >
      {label}
    </div>
  </div>
);

interface FoodEntryCardProps {
  entry: FoodEntry;
  onDelete: () => void;
  isDark: boolean;
}

const FoodEntryCard: React.FC<FoodEntryCardProps> = ({
  entry,
  onDelete,
  isDark,
}) => (
  <div
    className={`rounded-lg p-4 flex items-center justify-between ${
      isDark ? 'bg-gray-700' : 'bg-gray-50'
    }`}
  >
    <div className="flex-1">
      <h4
        className={`font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {entry.name}
      </h4>
      <div
        className={`text-sm space-x-3 mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        <span>{entry.calories} cal</span>
        <span>P: {entry.protein.toFixed(1)}g</span>
        <span>C: {entry.carbs.toFixed(1)}g</span>
        <span>F: {entry.fat.toFixed(1)}g</span>
      </div>
    </div>
    <button
      onClick={onDelete}
      className={`p-2 rounded-lg transition-colors ml-4 ${
        isDark
          ? 'text-red-400 hover:bg-gray-600'
          : 'text-red-600 hover:bg-gray-200'
      }`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

interface AddFoodModalProps {
  commonFoods: (typeof commonFoods)[0][];
  filteredFoods: (typeof commonFoods)[0][];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectFood: (food: (typeof commonFoods)[0]) => void;
  onClose: () => void;
  isDark: boolean;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  commonFoods,
  filteredFoods,
  searchTerm,
  onSearchChange,
  onSelectFood,
  onClose,
  isDark,
}) => (
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
          Add Food
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

      <div className="p-6 space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            autoFocus
          />
        </div>

        {/* Food List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <button
                key={food.name}
                onClick={() => {
                  onSelectFood(food);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {food.name}
                </div>
                <div
                  className={`text-sm space-x-3 mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="font-semibold text-orange-600">{food.calories} cal</span>
                  <span>P: {food.protein}g</span>
                  <span>C: {food.carbs}g</span>
                  <span>F: {food.fat}g</span>
                </div>
              </button>
            ))
          ) : (
            <div
              className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No foods found matching your search
            </div>
          )}
        </div>

        {/* Suggested */}
        {searchTerm === '' && (
          <div>
            <h3
              className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Popular Foods
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commonFoods.slice(0, 6).map(food => (
                <button
                  key={food.name}
                  onClick={() => {
                    onSelectFood(food);
                    onClose();
                  }}
                  className={`text-left p-3 rounded-lg transition-colors text-sm ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {food.name}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {food.calories} cal
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
