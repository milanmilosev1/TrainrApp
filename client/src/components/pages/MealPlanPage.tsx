import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface Meal {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  cookTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isFavorite: boolean;
}

interface DayMealPlan {
  date: string; // ISO date
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snacks: Meal[];
}

interface UserPreferences {
  dietaryRestrictions: string[];
  calorieTarget: number;
  mealCount: number;
  cuisinePreferences: string[];
  allergies: string[];
}

const mealDatabase: Meal[] = [
  // Breakfast options
  {
    id: 'meal_1',
    name: 'Oatmeal with Berries & Almonds',
    mealType: 'breakfast',
    calories: 350,
    protein: 12,
    carbs: 48,
    fat: 12,
    ingredients: ['Oats', 'Blueberries', 'Almonds', 'Honey', 'Milk'],
    cookTime: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'high-fiber', 'quick'],
    isFavorite: false,
  },
  {
    id: 'meal_2',
    name: 'Scrambled Eggs with Toast',
    mealType: 'breakfast',
    calories: 380,
    protein: 18,
    carbs: 35,
    fat: 16,
    ingredients: ['Eggs', 'Whole Wheat Bread', 'Butter', 'Salt', 'Pepper'],
    cookTime: 15,
    difficulty: 'easy',
    tags: ['high-protein', 'quick'],
    isFavorite: false,
  },
  {
    id: 'meal_3',
    name: 'Greek Yogurt Parfait',
    mealType: 'breakfast',
    calories: 320,
    protein: 20,
    carbs: 42,
    fat: 8,
    ingredients: ['Greek Yogurt', 'Granola', 'Berries', 'Honey'],
    cookTime: 5,
    difficulty: 'easy',
    tags: ['vegetarian', 'high-protein', 'quick'],
    isFavorite: false,
  },
  {
    id: 'meal_4',
    name: 'Protein Smoothie Bowl',
    mealType: 'breakfast',
    calories: 400,
    protein: 25,
    carbs: 45,
    fat: 10,
    ingredients: ['Protein Powder', 'Banana', 'Spinach', 'Almond Butter', 'Coconut Milk'],
    cookTime: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'high-protein', 'vegan-optional'],
    isFavorite: false,
  },

  // Lunch options
  {
    id: 'meal_5',
    name: 'Grilled Chicken Salad',
    mealType: 'lunch',
    calories: 420,
    protein: 38,
    carbs: 25,
    fat: 14,
    ingredients: ['Chicken Breast', 'Mixed Greens', 'Tomato', 'Cucumber', 'Olive Oil'],
    cookTime: 20,
    difficulty: 'easy',
    tags: ['high-protein', 'low-carb', 'paleo'],
    isFavorite: false,
  },
  {
    id: 'meal_6',
    name: 'Quinoa Buddha Bowl',
    mealType: 'lunch',
    calories: 480,
    protein: 16,
    carbs: 58,
    fat: 16,
    ingredients: ['Quinoa', 'Chickpeas', 'Broccoli', 'Sweet Potato', 'Tahini'],
    cookTime: 25,
    difficulty: 'medium',
    tags: ['vegetarian', 'vegan', 'high-fiber'],
    isFavorite: false,
  },
  {
    id: 'meal_7',
    name: 'Salmon & Vegetables',
    mealType: 'lunch',
    calories: 520,
    protein: 42,
    carbs: 32,
    fat: 20,
    ingredients: ['Salmon', 'Asparagus', 'Brussels Sprouts', 'Lemon', 'Olive Oil'],
    cookTime: 30,
    difficulty: 'medium',
    tags: ['high-protein', 'omega-3', 'paleo'],
    isFavorite: false,
  },
  {
    id: 'meal_8',
    name: 'Turkey Wrap',
    mealType: 'lunch',
    calories: 380,
    protein: 28,
    carbs: 38,
    fat: 12,
    ingredients: ['Turkey Breast', 'Whole Wheat Wrap', 'Avocado', 'Lettuce', 'Tomato'],
    cookTime: 10,
    difficulty: 'easy',
    tags: ['high-protein', 'quick'],
    isFavorite: false,
  },

  // Dinner options
  {
    id: 'meal_9',
    name: 'Lean Beef Stir Fry',
    mealType: 'dinner',
    calories: 550,
    protein: 45,
    carbs: 42,
    fat: 18,
    ingredients: ['Lean Beef', 'Bell Peppers', 'Broccoli', 'Brown Rice', 'Soy Sauce'],
    cookTime: 35,
    difficulty: 'medium',
    tags: ['high-protein', 'asian'],
    isFavorite: false,
  },
  {
    id: 'meal_10',
    name: 'Baked Chicken Breast with Sweet Potato',
    mealType: 'dinner',
    calories: 480,
    protein: 42,
    carbs: 48,
    fat: 10,
    ingredients: ['Chicken Breast', 'Sweet Potato', 'Green Beans', 'Olive Oil'],
    cookTime: 40,
    difficulty: 'easy',
    tags: ['high-protein', 'low-fat'],
    isFavorite: false,
  },
  {
    id: 'meal_11',
    name: 'Vegetable Pasta Primavera',
    mealType: 'dinner',
    calories: 420,
    protein: 14,
    carbs: 62,
    fat: 12,
    ingredients: ['Whole Wheat Pasta', 'Zucchini', 'Cherry Tomatoes', 'Basil', 'Olive Oil'],
    cookTime: 25,
    difficulty: 'easy',
    tags: ['vegetarian', 'vegan', 'quick'],
    isFavorite: false,
  },
  {
    id: 'meal_12',
    name: 'Fish Tacos with Cabbage Slaw',
    mealType: 'dinner',
    calories: 520,
    protein: 38,
    carbs: 48,
    fat: 16,
    ingredients: ['White Fish', 'Corn Tortillas', 'Cabbage', 'Lime', 'Cilantro'],
    cookTime: 30,
    difficulty: 'medium',
    tags: ['high-protein', 'mexican', 'quick'],
    isFavorite: false,
  },

  // Snacks
  {
    id: 'meal_13',
    name: 'Apple with Peanut Butter',
    mealType: 'snack',
    calories: 200,
    protein: 8,
    carbs: 25,
    fat: 10,
    ingredients: ['Apple', 'Peanut Butter'],
    cookTime: 0,
    difficulty: 'easy',
    tags: ['vegetarian', 'vegan', 'quick'],
    isFavorite: false,
  },
  {
    id: 'meal_14',
    name: 'Protein Bar',
    mealType: 'snack',
    calories: 220,
    protein: 20,
    carbs: 24,
    fat: 7,
    ingredients: ['Protein Bar'],
    cookTime: 0,
    difficulty: 'easy',
    tags: ['high-protein', 'quick', 'portable'],
    isFavorite: false,
  },
  {
    id: 'meal_15',
    name: 'Mixed Nuts & Dried Fruit',
    mealType: 'snack',
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 9,
    ingredients: ['Almonds', 'Cashews', 'Raisins', 'Cranberries'],
    cookTime: 0,
    difficulty: 'easy',
    tags: ['vegetarian', 'vegan', 'portable'],
    isFavorite: false,
  },
  {
    id: 'meal_16',
    name: 'Protein Shake',
    mealType: 'snack',
    calories: 150,
    protein: 25,
    carbs: 15,
    fat: 2,
    ingredients: ['Protein Powder', 'Water', 'Banana'],
    cookTime: 5,
    difficulty: 'easy',
    tags: ['vegetarian', 'high-protein', 'quick'],
    isFavorite: false,
  },
];

export const MealPlanPageComponent: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [mealPlans, setMealPlans] = useState<DayMealPlan[]>(() => {
    const saved = localStorage.getItem('trainr_meal_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('trainr_meal_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('trainr_meal_preferences');
    return saved
      ? JSON.parse(saved)
      : {
          dietaryRestrictions: [],
          calorieTarget: 2000,
          mealCount: 3,
          cuisinePreferences: [],
          allergies: [],
        };
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const [showMealSelector, setShowMealSelector] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trainr_meal_plans', JSON.stringify(mealPlans));
  }, [mealPlans]);

  useEffect(() => {
    localStorage.setItem('trainr_meal_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('trainr_meal_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const currentDayPlan = mealPlans.find(plan => plan.date === selectedDate) || {
    date: selectedDate,
    breakfast: undefined,
    lunch: undefined,
    dinner: undefined,
    snacks: [],
  };

  const totalCalories = (currentDayPlan.breakfast?.calories || 0) +
    (currentDayPlan.lunch?.calories || 0) +
    (currentDayPlan.dinner?.calories || 0) +
    currentDayPlan.snacks.reduce((sum, s) => sum + s.calories, 0);

  const totalProtein = (currentDayPlan.breakfast?.protein || 0) +
    (currentDayPlan.lunch?.protein || 0) +
    (currentDayPlan.dinner?.protein || 0) +
    currentDayPlan.snacks.reduce((sum, s) => sum + s.protein, 0);

  const totalCarbs = (currentDayPlan.breakfast?.carbs || 0) +
    (currentDayPlan.lunch?.carbs || 0) +
    (currentDayPlan.dinner?.carbs || 0) +
    currentDayPlan.snacks.reduce((sum, s) => sum + s.carbs, 0);

  const totalFat = (currentDayPlan.breakfast?.fat || 0) +
    (currentDayPlan.lunch?.fat || 0) +
    (currentDayPlan.dinner?.fat || 0) +
    currentDayPlan.snacks.reduce((sum, s) => sum + s.fat, 0);

  const remainingCalories = preferences.calorieTarget - totalCalories;
  const percentageUsed = (totalCalories / preferences.calorieTarget) * 100;

  const recommendedMeals = mealDatabase.filter(meal => {
    const matchesMealType = showMealSelector === null || meal.mealType === showMealSelector;
    const matchesDietary = preferences.dietaryRestrictions.length === 0 ||
      preferences.dietaryRestrictions.some(diet => meal.tags.includes(diet));
    return matchesMealType && matchesDietary;
  });

  const handleSelectMeal = (meal: Meal, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const existingPlan = mealPlans.find(p => p.date === selectedDate);
    
    if (mealType === 'snack') {
      if (existingPlan) {
        setMealPlans(mealPlans.map(p =>
          p.date === selectedDate ? { ...p, snacks: [...p.snacks, meal] } : p
        ));
      } else {
        setMealPlans([...mealPlans, { date: selectedDate, breakfast: undefined, lunch: undefined, dinner: undefined, snacks: [meal] }]);
      }
    } else {
      if (existingPlan) {
        setMealPlans(mealPlans.map(p =>
          p.date === selectedDate ? { ...p, [mealType]: meal } : p
        ));
      } else {
        const newPlan: DayMealPlan = {
          date: selectedDate,
          breakfast: undefined,
          lunch: undefined,
          dinner: undefined,
          snacks: [],
        };
        newPlan[mealType] = meal;
        setMealPlans([...mealPlans, newPlan]);
      }
    }
    setShowMealSelector(null);
  };

  const handleRemoveMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', mealId: string) => {
    if (mealType === 'snack') {
      setMealPlans(mealPlans.map(p =>
        p.date === selectedDate ? { ...p, snacks: p.snacks.filter(s => s.id !== mealId) } : p
      ));
    } else {
      setMealPlans(mealPlans.map(p =>
        p.date === selectedDate ? { ...p, [mealType]: undefined } : p
      ));
    }
  };

  const handleToggleFavorite = (mealId: string) => {
    setFavorites(favorites.includes(mealId) ? favorites.filter(id => id !== mealId) : [...favorites, mealId]);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-colors ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Meal Plan
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Personalized meal recommendations for your fitness goals
            </p>
          </div>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preferences
          </button>
        </div>

        {/* Preferences Panel */}
        {showPreferences && <PreferencesPanel preferences={preferences} setPreferences={setPreferences} isDark={isDark} />}

        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                setSelectedDate(prev.toISOString().split('T')[0]);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            >
              ← Previous
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedDate === today ? 'bg-green-600 text-white' : isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
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
              className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calorie Progress */}
            <div className={`rounded-lg p-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Nutrition Plan</h3>
                <button
                  onClick={() => setShowMealSelector('breakfast')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                  + Add Meal
                </button>
              </div>

              {/* Calorie Progress Circle */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="8" />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(percentageUsed, 100) * 5.65} 565`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalCalories}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>of {preferences.calorieTarget} cal</div>
                    <div className={`text-xs font-semibold mt-2 px-3 py-1 rounded-full ${remainingCalories >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {remainingCalories >= 0 ? '+' : ''}{remainingCalories} left
                    </div>
                  </div>
                </div>
              </div>

              {/* Macro Display */}
              <div className="grid grid-cols-3 gap-4">
                <MacroDisplay label="Protein" value={totalProtein.toFixed(1)} unit="g" color="from-red-500 to-red-600" isDark={isDark} />
                <MacroDisplay label="Carbs" value={totalCarbs.toFixed(1)} unit="g" color="from-blue-500 to-blue-600" isDark={isDark} />
                <MacroDisplay label="Fat" value={totalFat.toFixed(1)} unit="g" color="from-yellow-500 to-yellow-600" isDark={isDark} />
              </div>
            </div>

            {/* Meal Cards */}
            <div className="space-y-4">
              <MealSlot meal={currentDayPlan.breakfast} mealType="breakfast" onAdd={() => setShowMealSelector('breakfast')} onRemove={() => handleRemoveMeal('breakfast', currentDayPlan.breakfast?.id || '')} isDark={isDark} isFavorite={currentDayPlan.breakfast ? favorites.includes(currentDayPlan.breakfast.id) : false} onToggleFavorite={() => currentDayPlan.breakfast && handleToggleFavorite(currentDayPlan.breakfast.id)} />
              <MealSlot meal={currentDayPlan.lunch} mealType="lunch" onAdd={() => setShowMealSelector('lunch')} onRemove={() => handleRemoveMeal('lunch', currentDayPlan.lunch?.id || '')} isDark={isDark} isFavorite={currentDayPlan.lunch ? favorites.includes(currentDayPlan.lunch.id) : false} onToggleFavorite={() => currentDayPlan.lunch && handleToggleFavorite(currentDayPlan.lunch.id)} />
              <MealSlot meal={currentDayPlan.dinner} mealType="dinner" onAdd={() => setShowMealSelector('dinner')} onRemove={() => handleRemoveMeal('dinner', currentDayPlan.dinner?.id || '')} isDark={isDark} isFavorite={currentDayPlan.dinner ? favorites.includes(currentDayPlan.dinner.id) : false} onToggleFavorite={() => currentDayPlan.dinner && handleToggleFavorite(currentDayPlan.dinner.id)} />

              {/* Snacks */}
              {currentDayPlan.snacks.length > 0 && (
                <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Snacks</h3>
                  <div className="space-y-3">
                    {currentDayPlan.snacks.map(snack => (
                      <div key={snack.id} className={`rounded-lg p-4 flex items-center justify-between ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div>
                          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{snack.name}</h4>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{snack.calories} cal</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleFavorite(snack.id)}
                            className={`p-2 transition-colors ${favorites.includes(snack.id) ? 'text-yellow-500' : isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveMeal('snack', snack.id)}
                            className={`p-2 rounded-lg transition-colors ml-2 ${isDark ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-200'}`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shopping List */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shopping List</h3>
              <div className="space-y-2">
                {Array.from(
                  new Set([
                    ...(currentDayPlan.breakfast?.ingredients || []),
                    ...(currentDayPlan.lunch?.ingredients || []),
                    ...(currentDayPlan.dinner?.ingredients || []),
                    ...currentDayPlan.snacks.flatMap(s => s.ingredients),
                  ])
                ).map((ingredient, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Meals:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {(currentDayPlan.breakfast ? 1 : 0) + (currentDayPlan.lunch ? 1 : 0) + (currentDayPlan.dinner ? 1 : 0) + currentDayPlan.snacks.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Avg Cook Time:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentDayPlan.breakfast || currentDayPlan.lunch || currentDayPlan.dinner
                      ? Math.round(
                          ([currentDayPlan.breakfast, currentDayPlan.lunch, currentDayPlan.dinner]
                            .filter(Boolean)
                            .reduce((sum, m) => sum + (m?.cookTime || 0), 0) +
                            currentDayPlan.snacks.reduce((sum, s) => sum + s.cookTime, 0)) /
                            ((currentDayPlan.breakfast ? 1 : 0) + (currentDayPlan.lunch ? 1 : 0) + (currentDayPlan.dinner ? 1 : 0) + currentDayPlan.snacks.length)
                        )
                      : 0}
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Selector Modal */}
        {showMealSelector && (
          <MealSelectorModal
            mealType={showMealSelector}
            meals={recommendedMeals.filter(m => m.mealType === showMealSelector)}
            onSelectMeal={(meal) => handleSelectMeal(meal, showMealSelector)}
            onClose={() => setShowMealSelector(null)}
            isDark={isDark}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </div>
  );
};

interface MacroDisplayProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  isDark: boolean;
}

const MacroDisplay: React.FC<MacroDisplayProps> = ({ label, value, unit, color, isDark }) => (
  <div className={`rounded-lg p-4 text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${color} text-white mb-2`}>
      <span className="font-bold text-sm">{label[0]}</span>
    </div>
    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}{unit}
    </div>
    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
  </div>
);

interface MealSlotProps {
  meal?: Meal;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onAdd: () => void;
  onRemove: () => void;
  isDark: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MealSlot: React.FC<MealSlotProps> = ({ meal, mealType, onAdd, onRemove, isDark, isFavorite, onToggleFavorite }) => {
  const mealIcons = {
    breakfast: '🌅',
    lunch: '🍽️',
    dinner: '🌙',
  };

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {mealIcons[mealType]} {mealType}
        </h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
        >
          + Add
        </button>
      </div>

      {meal ? (
        <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{meal.name}</h4>
              <div className={`text-sm flex gap-2 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>{meal.calories} cal</span>
                <span>•</span>
                <span>{meal.cookTime} min</span>
                <span>•</span>
                <span className="capitalize">{meal.difficulty}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 transition-colors ${isFavorite ? 'text-yellow-500' : isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              <button
                onClick={onRemove}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-200'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`text-sm space-x-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
            <span>F: {meal.fat}g</span>
          </div>
        </div>
      ) : (
        <div className={`rounded-lg p-8 text-center border-2 border-dashed ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No meal selected. Click "Add" to choose a meal.</p>
        </div>
      )}
    </div>
  );
};

interface PreferencesPanelProps {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  isDark: boolean;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ preferences, setPreferences, isDark }) => {
  const dietaryOptions = ['vegetarian', 'vegan', 'keto', 'low-carb', 'paleo', 'gluten-free'];
  const cuisineOptions = ['italian', 'asian', 'mexican', 'american'];
  const allergyOptions = ['nuts', 'dairy', 'soy', 'shellfish', 'eggs'];

  return (
    <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Meal Preferences</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calorie Target */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Daily Calorie Target</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={preferences.calorieTarget}
              onChange={(e) => setPreferences({ ...preferences, calorieTarget: parseInt(e.target.value) || 2000 })}
              className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />
            <span className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>cal</span>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dietary Restrictions</label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(diet => (
              <button
                key={diet}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    dietaryRestrictions: preferences.dietaryRestrictions.includes(diet)
                      ? preferences.dietaryRestrictions.filter(d => d !== diet)
                      : [...preferences.dietaryRestrictions, diet],
                  })
                }
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  preferences.dietaryRestrictions.includes(diet)
                    ? 'bg-green-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Allergies</label>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map(allergy => (
              <button
                key={allergy}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    allergies: preferences.allergies.includes(allergy)
                      ? preferences.allergies.filter(a => a !== allergy)
                      : [...preferences.allergies, allergy],
                  })
                }
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  preferences.allergies.includes(allergy)
                    ? 'bg-red-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cuisine Preferences</label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map(cuisine => (
              <button
                key={cuisine}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    cuisinePreferences: preferences.cuisinePreferences.includes(cuisine)
                      ? preferences.cuisinePreferences.filter(c => c !== cuisine)
                      : [...preferences.cuisinePreferences, cuisine],
                  })
                }
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  preferences.cuisinePreferences.includes(cuisine)
                    ? 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MealSelectorModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meals: Meal[];
  onSelectMeal: (meal: Meal) => void;
  onClose: () => void;
  isDark: boolean;
  favorites: string[];
  onToggleFavorite: (mealId: string) => void;
}

const MealSelectorModal: React.FC<MealSelectorModalProps> = ({
  mealType,
  meals,
  onSelectMeal,
  onClose,
  isDark,
  favorites,
  onToggleFavorite,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-2xl font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>Select {mealType}</h2>
        <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-3">
        {meals.length > 0 ? (
          meals.map(meal => (
            <button
              key={meal.id}
              onClick={() => {
                onSelectMeal(meal);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{meal.name}</h4>
                  <div className={`text-sm space-x-2 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-semibold text-green-600">{meal.calories} cal</span>
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fat}g</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {meal.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(meal.id);
                  }}
                  className={`p-2 transition-colors ${favorites.includes(meal.id) ? 'text-yellow-500' : isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
            </button>
          ))
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No meals available. Try adjusting your preferences.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default MealPlanPageComponent;
