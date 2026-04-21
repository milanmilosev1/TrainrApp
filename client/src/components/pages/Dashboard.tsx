import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

export const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      id: 'training',
      name: 'Training Schedule',
      description: 'Plan and manage your workout routines',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0V6m0 0h-6m0 0V0m0 0h6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      route: '/training',
    },
    {
      id: 'calories',
      name: 'Calorie Tracking',
      description: 'Monitor your daily caloric intake',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      route: '/calories',
    },
    {
      id: 'meal-plan',
      name: 'AI Meal Plan',
      description: 'Get personalized meal recommendations',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v12m-3-2.818l.879.659c1.469 1.469 3.662 1.469 5.146 0l2.003-1.506c.663-.497 1.465-.369 2.05.181.584.551.584 1.487 0 2.038-1.972 1.864-5.171 1.864-7.143 0-.584-.551-.584-1.487 0-2.038.585-.55 1.387-.678 2.05-.181l2.003 1.506c1.484 1.469 3.677 1.469 5.146 0l.879-.659M5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      route: '/meal-plan',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Manage your alerts and reminders',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      route: '/notifications',
    },
    {
      id: 'profile',
      name: 'Profile Settings',
      description: 'Customize your profile information',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600',
      route: '/profile',
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Welcome to Trainr Dashboard
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Manage all aspects of your fitness journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <button
              key={feature.id}
              onClick={() => navigate(feature.route)}
              className={`group relative overflow-hidden rounded-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700 hover:border-purple-600 focus:ring-purple-500'
                  : 'bg-white border border-gray-200 hover:border-purple-600 focus:ring-purple-500 focus:ring-offset-gray-100'
              }`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 bg-gradient-to-r ${feature.color} text-white`}
                >
                  {feature.icon}
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {feature.name}
                </h3>

                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {feature.description}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 inline-flex items-center text-purple-600 group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`rounded-lg p-6 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-purple-600 text-3xl font-bold mb-2">0</div>
            <p
              className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
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
            <div className="text-orange-600 text-3xl font-bold mb-2">0</div>
            <p
              className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Calories Today
            </p>
          </div>

          <div
            className={`rounded-lg p-6 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-green-600 text-3xl font-bold mb-2">0</div>
            <p
              className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Meals Logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
