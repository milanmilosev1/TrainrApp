import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'workout' | 'meal' | 'calorie' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface NotificationPreferences {
  workoutReminders: boolean;
  workoutTime: string;
  mealReminders: boolean;
  mealTimes: string[];
  calorieGoalAlerts: boolean;
  achievementNotifications: boolean;
  dailySummary: boolean;
  soundEnabled: boolean;
  pushNotifications: boolean;
}

const defaultPreferences: NotificationPreferences = {
  workoutReminders: true,
  workoutTime: '07:00',
  mealReminders: true,
  mealTimes: ['08:00', '12:30', '18:00'],
  calorieGoalAlerts: true,
  achievementNotifications: true,
  dailySummary: true,
  soundEnabled: true,
  pushNotifications: true,
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: '🏆 Great Job!',
    message: 'You completed your workout today! Keep up the momentum.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    icon: '🏆',
    priority: 'high',
    actionUrl: '/training',
  },
  {
    id: '2',
    type: 'calorie',
    title: '📊 Daily Goal Reached',
    message: 'Congratulations! You hit your 2000 calorie goal.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    icon: '📊',
    priority: 'high',
    actionUrl: '/calories',
  },
  {
    id: '3',
    type: 'meal',
    title: '🍽️ Lunch Time',
    message: 'Time to log your lunch! Check out recommended meals.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    icon: '🍽️',
    priority: 'medium',
    actionUrl: '/meal-plan',
  },
  {
    id: '4',
    type: 'workout',
    title: '💪 Morning Workout Reminder',
    message: 'Your scheduled workout starts in 30 minutes!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    icon: '💪',
    priority: 'high',
    actionUrl: '/training',
  },
  {
    id: '5',
    type: 'reminder',
    title: '⏰ Daily Summary',
    message: 'You logged 5 meals and completed 1 workout today.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    icon: '⏰',
    priority: 'low',
  },
];

export const NotificationsPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('trainr_notifications');
    if (saved) {
      return JSON.parse(saved);
    }
    return mockNotifications;
  });

  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('trainr_notification_preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [activeTab, setActiveTab] = useState<'center' | 'preferences'>('center');
  const [showNewMealTime, setShowNewMealTime] = useState(false);
  const [newMealTime, setNewMealTime] = useState('12:00');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trainr_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      'trainr_notification_preferences',
      JSON.stringify(preferences)
    );
  }, [preferences]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleAddMealTime = () => {
    if (!preferences.mealTimes.includes(newMealTime)) {
      setPreferences({
        ...preferences,
        mealTimes: [...preferences.mealTimes, newMealTime].sort(),
      });
      setShowNewMealTime(false);
      setNewMealTime('12:00');
    }
  };

  const handleRemoveMealTime = (time: string) => {
    setPreferences({
      ...preferences,
      mealTimes: preferences.mealTimes.filter(t => t !== time),
    });
  };

  const handlePreferenceChange = (
    key: keyof NotificationPreferences,
    value: any
  ) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-400 to-yellow-600';
      case 'calorie':
        return 'from-green-400 to-green-600';
      case 'meal':
        return 'from-blue-400 to-blue-600';
      case 'workout':
        return 'from-red-400 to-red-600';
      case 'reminder':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
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
          <div className="flex items-center gap-3 mb-2">
            <h1
              className={`text-4xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Stay updated with reminders and achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('center')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'center'
                ? 'bg-purple-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🔔 Notification Center
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'preferences'
                ? 'bg-purple-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ Preferences
          </button>
        </div>

        {/* Notification Center Tab */}
        {activeTab === 'center' && (
          <div className="space-y-6">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    🆕 New ({unreadCount})
                  </h2>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-3">
                  {unreadNotifications.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                      onClick={() => handleNotificationClick(notification)}
                      isDark={isDark}
                      isUnread={true}
                      color={getNotificationColor(notification.type)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    📭 Earlier
                  </h2>
                  {readNotifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-sm px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {readNotifications.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                      onClick={() => handleNotificationClick(notification)}
                      isDark={isDark}
                      isUnread={false}
                      color={getNotificationColor(notification.type)}
                    />
                  ))}
                </div>
              </div>
            )}

            {notifications.length === 0 && (
              <div
                className={`rounded-lg p-12 text-center ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-5xl mb-4">🔇</div>
                <p
                  className={`text-xl font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  All caught up!
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No notifications yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
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
                General Settings
              </h3>
              <div className="space-y-4">
                <PreferenceToggle
                  label="Push Notifications"
                  description="Receive browser notifications"
                  checked={preferences.pushNotifications}
                  onChange={v =>
                    handlePreferenceChange('pushNotifications', v)
                  }
                  isDark={isDark}
                />
                <PreferenceToggle
                  label="Sound Alerts"
                  description="Play sound for notifications"
                  checked={preferences.soundEnabled}
                  onChange={v => handlePreferenceChange('soundEnabled', v)}
                  isDark={isDark}
                />
                <PreferenceToggle
                  label="Daily Summary"
                  description="Get a daily summary at the end of day"
                  checked={preferences.dailySummary}
                  onChange={v => handlePreferenceChange('dailySummary', v)}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Notification Types */}
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
                Notification Types
              </h3>
              <div className="space-y-4">
                <PreferenceToggle
                  label="Workout Reminders"
                  description="💪 Get reminded about workouts"
                  checked={preferences.workoutReminders}
                  onChange={v =>
                    handlePreferenceChange('workoutReminders', v)
                  }
                  isDark={isDark}
                />
                <PreferenceToggle
                  label="Meal Reminders"
                  description="🍽️ Get reminded to log meals"
                  checked={preferences.mealReminders}
                  onChange={v => handlePreferenceChange('mealReminders', v)}
                  isDark={isDark}
                />
                <PreferenceToggle
                  label="Calorie Goal Alerts"
                  description="📊 Alert when reaching calorie goal"
                  checked={preferences.calorieGoalAlerts}
                  onChange={v =>
                    handlePreferenceChange('calorieGoalAlerts', v)
                  }
                  isDark={isDark}
                />
                <PreferenceToggle
                  label="Achievement Notifications"
                  description="🏆 Celebrate your milestones"
                  checked={preferences.achievementNotifications}
                  onChange={v =>
                    handlePreferenceChange('achievementNotifications', v)
                  }
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Workout Reminder Time */}
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
                💪 Workout Reminder Time
              </h3>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Send reminder at:
                </label>
                <input
                  type="time"
                  value={preferences.workoutTime}
                  onChange={e =>
                    handlePreferenceChange('workoutTime', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Meal Reminder Times */}
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
                🍽️ Meal Reminder Times
              </h3>
              <div className="space-y-3">
                {preferences.mealTimes.map(time => (
                  <div
                    key={time}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {time}
                    </span>
                    <button
                      onClick={() => handleRemoveMealTime(time)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {!showNewMealTime && (
                  <button
                    onClick={() => setShowNewMealTime(true)}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    + Add Meal Time
                  </button>
                )}
                {showNewMealTime && (
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newMealTime}
                      onChange={e => setNewMealTime(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={handleAddMealTime}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowNewMealTime(false)}
                      className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                        isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  isDark: boolean;
  isUnread: boolean;
  color: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  isDark,
  isUnread,
  color,
}) => {
  const timeAgo = getTimeAgo(notification.timestamp);

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-4 cursor-pointer transition-all border-l-4 ${
        isUnread
          ? isDark
            ? 'bg-gray-700/50 border-purple-500'
            : 'bg-blue-50 border-blue-500'
          : isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
      } ${isUnread ? 'shadow-md' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${color} text-white flex-shrink-0`}
        >
          <span className="text-xl">{notification.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {notification.title}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {notification.message}
              </p>
              <p
                className={`text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {timeAgo}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {isUnread && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-600/50 transition-colors"
                  title="Mark as read"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </button>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-red-900/30 text-red-400'
                    : 'hover:bg-red-100 text-red-600'
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
      </div>
    </div>
  );
};

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isDark: boolean;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  isDark,
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p
        className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        {label}
      </p>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked
          ? 'bg-purple-600'
          : isDark
            ? 'bg-gray-700'
            : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
