import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/App.css';

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    
    // Privacy Settings
    profileVisibility: 'public', // public, friends, private
    showBookingHistory: true,
    showFavorites: false,
    dataCollection: true,
    
    // Display Settings
    theme: 'auto', // light, dark, auto
    language: 'en',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    
    // Event Preferences
    defaultLocation: 'Mumbai',
    eventReminders: true,
    reminderTime: '1day', // 1hour, 6hours, 1day, 3days
    autoFavorite: false,
    
    // Account Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '7days' // 1hour, 1day, 7days, never
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load user settings from API or localStorage
    loadUserSettings();
  }, []);

  const loadUserSettings = () => {
    // Mock loading settings - replace with actual API call
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setTimeout(() => {
        setSuccessMessage('Settings saved successfully!');
        setLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        profileVisibility: 'public',
        showBookingHistory: true,
        showFavorites: false,
        dataCollection: true,
        theme: 'auto',
        language: 'en',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        defaultLocation: 'Mumbai',
        eventReminders: true,
        reminderTime: '1day',
        autoFavorite: false,
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: '7days'
      });
      setSuccessMessage('Settings reset to default!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data, bookings, and favorites. Type "DELETE" to confirm:')) {
        // Handle account deletion
        console.log('Account deletion requested');
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'events', label: 'Events', icon: '🎫' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">
                  Default Location
                  <select
                    value={settings.defaultLocation}
                    onChange={(e) => handleSettingChange('general', 'defaultLocation', e.target.value)}
                    className="setting-select"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Pune">Pune</option>
                  </select>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  Language
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="bn">বাংলা</option>
                    <option value="ta">தமிழ்</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  Currency
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="setting-select"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  Timezone
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="setting-select"
                  >
                    <option value="Asia/Kolkata">India Standard Time</option>
                    <option value="Asia/Dubai">Gulf Standard Time</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="Europe/London">Greenwich Mean Time</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Receive email updates about your bookings and new events</p>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Get instant notifications on your device</p>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>SMS Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Receive SMS alerts for important updates</p>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Marketing Emails</span>
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Receive promotional emails about new events and offers</p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section">
            <h3>Privacy & Security</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">
                  Profile Visibility
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="setting-select"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Show Booking History</span>
                  <input
                    type="checkbox"
                    checked={settings.showBookingHistory}
                    onChange={(e) => handleSettingChange('privacy', 'showBookingHistory', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Show Favorites</span>
                  <input
                    type="checkbox"
                    checked={settings.showFavorites}
                    onChange={(e) => handleSettingChange('privacy', 'showFavorites', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Allow Data Collection</span>
                  <input
                    type="checkbox"
                    checked={settings.dataCollection}
                    onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Help us improve our service by collecting anonymous usage data</p>
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="settings-section">
            <h3>Display Preferences</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">
                  Theme
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                    className="setting-select"
                  >
                    <option value="auto">Auto (System)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="settings-section">
            <h3>Event Preferences</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Event Reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.eventReminders}
                    onChange={(e) => handleSettingChange('events', 'eventReminders', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  Reminder Time
                  <select
                    value={settings.reminderTime}
                    onChange={(e) => handleSettingChange('events', 'reminderTime', e.target.value)}
                    className="setting-select"
                    disabled={!settings.eventReminders}
                  >
                    <option value="1hour">1 Hour Before</option>
                    <option value="6hours">6 Hours Before</option>
                    <option value="1day">1 Day Before</option>
                    <option value="3days">3 Days Before</option>
                  </select>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Auto-add to Favorites</span>
                  <input
                    type="checkbox"
                    checked={settings.autoFavorite}
                    onChange={(e) => handleSettingChange('events', 'autoFavorite', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Automatically add booked events to your favorites</p>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="settings-section">
            <h3>Account Security</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Two-Factor Authentication</span>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Add an extra layer of security to your account</p>
              </div>
              
              <div className="setting-item toggle">
                <label className="setting-label">
                  <span>Login Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.loginAlerts}
                    onChange={(e) => handleSettingChange('account', 'loginAlerts', e.target.checked)}
                    className="setting-toggle"
                  />
                </label>
                <p className="setting-description">Get notified when someone logs into your account</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  Session Timeout
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('account', 'sessionTimeout', e.target.value)}
                    className="setting-select"
                  >
                    <option value="1hour">1 Hour</option>
                    <option value="1day">1 Day</option>
                    <option value="7days">7 Days</option>
                    <option value="never">Never</option>
                  </select>
                </label>
              </div>
              
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <motion.button
                  className="danger-btn"
                  onClick={deleteAccount}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete Account
                </motion.button>
                <p className="danger-text">Permanently delete your account and all associated data</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="settings-page"
      >
        <div className="page-header">
          <h1 className="page-title">
            ⚙️ Settings
          </h1>
          <p className="page-subtitle">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="settings-container">
          {/* Settings Tabs */}
          <div className="settings-tabs">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {renderTabContent()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <motion.button
            className="action-btn secondary"
            onClick={resetSettings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset to Default
          </motion.button>
          
          <motion.button
            className={`action-btn primary ${loading ? 'loading' : ''}`}
            onClick={saveSettings}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="success-message"
          >
            ✅ {successMessage}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;