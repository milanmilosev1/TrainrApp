import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  joinDate: string;
  bio: string;
}

interface ProfileSettings {
  emailNotifications: boolean;
  showProfile: boolean;
  allowMessagesFromOthers: boolean;
  makeProgressPublic: boolean;
  displayWeight: boolean;
  displayAge: boolean;
  theme: 'light' | 'dark' | 'system';
}

const defaultProfile: UserProfile = {
  id: 'user_001',
  name: 'Alex Johnson',
  email: 'test@example.com',
  age: 28,
  weight: 75,
  height: 180,
  gender: 'male',
  fitnessLevel: 'intermediate',
  goals: ['build-muscle', 'improve-endurance'],
  joinDate: new Date().toISOString().split('T')[0],
  bio: 'Passionate about fitness and health.',
};

const defaultSettings: ProfileSettings = {
  emailNotifications: true,
  showProfile: true,
  allowMessagesFromOthers: false,
  makeProgressPublic: false,
  displayWeight: true,
  displayAge: true,
  theme: 'system',
};

const fitnessGoals = [
  { id: 'build-muscle', label: '💪 Build Muscle', icon: '💪' },
  { id: 'lose-weight', label: '⚖️ Lose Weight', icon: '⚖️' },
  { id: 'improve-endurance', label: '🏃 Improve Endurance', icon: '🏃' },
  { id: 'increase-flexibility', label: '🧘 Increase Flexibility', icon: '🧘' },
  { id: 'general-fitness', label: '✨ General Fitness', icon: '✨' },
  { id: 'athletic-training', label: '🏆 Athletic Training', icon: '🏆' },
];

export const ProfilePage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('trainr_user_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [settings, setSettings] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem('trainr_profile_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'edit' | 'settings' | 'privacy'
  >('overview');
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [successMessage, setSuccessMessage] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trainr_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('trainr_profile_settings', JSON.stringify(settings));
  }, [settings]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
  };

  const handleToggleGoal = (goalId: string) => {
    setEditProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const handleSettingChange = (
    key: keyof ProfileSettings,
    value: any
  ) => {
    setSettings({ ...settings, [key]: value });
    setSuccessMessage('Setting updated!');
  };

  const handleProfileFieldChange = (
    field: keyof UserProfile,
    value: any
  ) => {
    setEditProfile({ ...editProfile, [field]: value });
  };

  const bmi =
    profile.weight && profile.height
      ? (
          profile.weight /
          ((profile.height / 100) * (profile.height / 100))
        ).toFixed(1)
      : 'N/A';

  const getBMICategory = (bmi: number | string): string => {
    if (typeof bmi === 'string') return 'N/A';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = (bmi: number | string): string => {
    if (typeof bmi === 'string') return 'text-gray-500';
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-green-500';
    if (bmi < 30) return 'text-yellow-500';
    return 'text-red-500';
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 px-4 py-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ {successMessage}
          </div>
        )}

        {/* Profile Header */}
        <div
          className={`rounded-lg p-8 mb-8 ${
            isDark
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {profile.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {profile.name}
                </h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {profile.email}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Member since{' '}
                  {new Date(profile.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditMode(!editMode);
                setEditProfile(profile);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                editMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Quick Stats */}
          {!editMode && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Age"
                value={`${profile.age} yrs`}
                isDark={isDark}
              />
              <StatCard
                label="Height"
                value={`${profile.height} cm`}
                isDark={isDark}
              />
              <StatCard
                label="Weight"
                value={`${profile.weight} kg`}
                isDark={isDark}
              />
              <StatCard
                label={`BMI`}
                value={String(bmi)}
                isDark={isDark}
                className={getBMIColor(parseFloat(String(bmi)))}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'overview', label: '👤 Overview' },
            { id: 'edit', label: '✏️ Edit Info' },
            { id: 'settings', label: '⚙️ Settings' },
            { id: 'privacy', label: '🔒 Privacy' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'overview' | 'edit' | 'settings' | 'privacy'
                )
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About */}
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
                About
              </h3>
              <p
                className={`mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {profile.bio}
              </p>
              <div
                className={`text-sm space-y-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <p>
                  <span className="font-semibold">Fitness Level:</span>{' '}
                  {profile.fitnessLevel.charAt(0).toUpperCase() +
                    profile.fitnessLevel.slice(1)}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{' '}
                  {profile.gender.charAt(0).toUpperCase() +
                    profile.gender.slice(1)}
                </p>
              </div>
            </div>

            {/* Goals */}
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
                🎯 Fitness Goals
              </h3>
              <div className="space-y-2">
                {fitnessGoals.map(goal => {
                  const isSelected = profile.goals.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg ${
                        isSelected
                          ? isDark
                            ? 'bg-pink-900/30 border border-pink-500'
                            : 'bg-pink-50 border border-pink-300'
                          : isDark
                            ? 'bg-gray-700'
                            : 'bg-gray-50'
                      }`}
                    >
                      <p
                        className={
                          isSelected
                            ? isDark
                              ? 'text-pink-300 font-semibold'
                              : 'text-pink-700 font-semibold'
                            : isDark
                              ? 'text-gray-300'
                              : 'text-gray-700'
                        }
                      >
                        {goal.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Health Metrics */}
            <div
              className={`rounded-lg p-6 lg:col-span-2 ${
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
                📊 Health Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard
                  label="BMI"
                  value={String(bmi)}
                  category={getBMICategory(parseFloat(String(bmi)))}
                  isDark={isDark}
                />
                <MetricCard
                  label="Height"
                  value={`${profile.height}`}
                  unit="cm"
                  isDark={isDark}
                />
                <MetricCard
                  label="Weight"
                  value={`${profile.weight}`}
                  unit="kg"
                  isDark={isDark}
                />
                <MetricCard
                  label="Age"
                  value={`${profile.age}`}
                  unit="yrs"
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Info Tab */}
        {activeTab === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
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
                Personal Information
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  value={editProfile.name}
                  onChange={v => handleProfileFieldChange('name', v)}
                  isDark={isDark}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={editProfile.email}
                  onChange={v => handleProfileFieldChange('email', v)}
                  isDark={isDark}
                />
                <InputField
                  label="Age"
                  type="number"
                  value={editProfile.age}
                  onChange={v => handleProfileFieldChange('age', parseInt(v))}
                  isDark={isDark}
                  min="18"
                  max="120"
                />
                <SelectField
                  label="Gender"
                  value={editProfile.gender}
                  onChange={v =>
                    handleProfileFieldChange('gender', v as 'male' | 'female' | 'other')
                  }
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Physical Metrics */}
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
                Physical Metrics
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Height (cm)"
                  type="number"
                  value={editProfile.height}
                  onChange={v => handleProfileFieldChange('height', parseInt(v))}
                  isDark={isDark}
                  min="100"
                  max="250"
                />
                <InputField
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={editProfile.weight}
                  onChange={v => handleProfileFieldChange('weight', parseFloat(v))}
                  isDark={isDark}
                  min="30"
                  max="200"
                />
                <SelectField
                  label="Fitness Level"
                  value={editProfile.fitnessLevel}
                  onChange={v =>
                    handleProfileFieldChange('fitnessLevel', v as 'beginner' | 'intermediate' | 'advanced')
                  }
                  options={[
                    { label: '🟢 Beginner', value: 'beginner' },
                    { label: '🟡 Intermediate', value: 'intermediate' },
                    { label: '🔴 Advanced', value: 'advanced' },
                  ]}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Bio */}
            <div
              className={`rounded-lg p-6 lg:col-span-2 ${
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
                Bio
              </h3>
              <textarea
                value={editProfile.bio}
                onChange={e => handleProfileFieldChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Goals Selection */}
            <div
              className={`rounded-lg p-6 lg:col-span-2 ${
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
                🎯 Fitness Goals (Select all that apply)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fitnessGoals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`p-3 rounded-lg transition-all border-2 ${
                      editProfile.goals.includes(goal.id)
                        ? isDark
                          ? 'bg-pink-900/50 border-pink-500'
                          : 'bg-pink-100 border-pink-500'
                        : isDark
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                          : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p
                      className={
                        editProfile.goals.includes(goal.id)
                          ? isDark
                            ? 'text-pink-200 font-semibold'
                            : 'text-pink-700 font-semibold'
                          : isDark
                            ? 'text-gray-300'
                            : 'text-gray-700'
                      }
                    >
                      {goal.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="lg:col-span-2">
              <button
                onClick={handleSaveProfile}
                className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Settings */}
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
                📧 Notification Settings
              </h3>
              <SettingToggle
                label="Email Notifications"
                description="Receive updates via email"
                checked={settings.emailNotifications}
                onChange={v => handleSettingChange('emailNotifications', v)}
                isDark={isDark}
              />
            </div>

            {/* Theme Settings */}
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
                🎨 Theme
              </h3>
              <div className="space-y-2">
                {[
                  { label: '☀️ Light', value: 'light' },
                  { label: '🌙 Dark', value: 'dark' },
                  { label: '⚙️ System', value: 'system' },
                ].map(theme => (
                  <label
                    key={theme.value}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      settings.theme === theme.value
                        ? isDark
                          ? 'bg-pink-900/30 border border-pink-500'
                          : 'bg-pink-50 border border-pink-300'
                        : isDark
                          ? 'bg-gray-700'
                          : 'bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.theme === theme.value}
                      onChange={e =>
                        handleSettingChange(
                          'theme',
                          e.target.value as 'light' | 'dark' | 'system'
                        )
                      }
                      className="mr-3"
                    />
                    <span
                      className={
                        settings.theme === theme.value
                          ? isDark
                            ? 'text-pink-300 font-semibold'
                            : 'text-pink-700 font-semibold'
                          : isDark
                            ? 'text-gray-300'
                            : 'text-gray-700'
                      }
                    >
                      {theme.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="grid grid-cols-1 gap-6">
            <div
              className={`rounded-lg p-6 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`text-lg font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                🔒 Privacy Settings
              </h3>
              <div className="space-y-4">
                <SettingToggle
                  label="Show Profile"
                  description="Allow others to see your profile"
                  checked={settings.showProfile}
                  onChange={v => handleSettingChange('showProfile', v)}
                  isDark={isDark}
                />
                <SettingToggle
                  label="Allow Messages"
                  description="Allow other users to message you"
                  checked={settings.allowMessagesFromOthers}
                  onChange={v =>
                    handleSettingChange('allowMessagesFromOthers', v)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label="Make Progress Public"
                  description="Share your fitness progress with the community"
                  checked={settings.makeProgressPublic}
                  onChange={v =>
                    handleSettingChange('makeProgressPublic', v)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label="Display Weight"
                  description="Show weight in your public profile"
                  checked={settings.displayWeight}
                  onChange={v => handleSettingChange('displayWeight', v)}
                  isDark={isDark}
                />
                <SettingToggle
                  label="Display Age"
                  description="Show age in your public profile"
                  checked={settings.displayAge}
                  onChange={v => handleSettingChange('displayAge', v)}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className={`rounded-lg p-6 border-2 ${
                isDark
                  ? 'bg-red-900/20 border-red-600'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}
              >
                ⚠️ Danger Zone
              </h3>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete your account? This action cannot be undone.'
                    )
                  ) {
                    alert('Account deletion request submitted.');
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  type?: string;
  value: any;
  onChange: (value: string) => void;
  isDark: boolean;
  min?: string;
  max?: string;
  step?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  isDark,
  min,
  max,
  step,
}) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
        isDark
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-gray-50 border-gray-300 text-gray-900'
      }`}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  isDark: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  isDark,
}) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
        isDark
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-gray-50 border-gray-300 text-gray-900'
      }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isDark: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  isDark,
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-opacity-50">
    <div>
      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
          ? 'bg-pink-600'
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

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  category?: string;
  isDark: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  category,
  isDark,
  className,
}) => (
  <div
    className={`rounded-lg p-4 text-center ${
      isDark ? 'bg-gray-700' : 'bg-gray-50'
    }`}
  >
    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {label}
    </p>
    <p className={`text-2xl font-bold mt-1 ${className || (isDark ? 'text-white' : 'text-gray-900')}`}>
      {value}
      {unit && <span className="text-sm ml-1">{unit}</span>}
    </p>
    {category && (
      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        {category}
      </p>
    )}
  </div>
);

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  category?: string;
  isDark: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  category,
  isDark,
}) => (
  <div
    className={`rounded-lg p-4 text-center ${
      isDark
        ? 'bg-gray-700 border border-gray-600'
        : 'bg-white border border-gray-200'
    }`}
  >
    <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      {label}
    </p>
    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
      {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
    </p>
    {category && (
      <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {category}
      </p>
    )}
  </div>
);
