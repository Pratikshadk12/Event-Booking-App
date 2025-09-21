import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="profile-container">
          {/* Profile Header */}
          <motion.div 
            className="profile-header"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <FaUser />
                <button className="avatar-edit-btn">
                  <FaCamera />
                </button>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{user?.name || 'User'}</h1>
                <p className="profile-email">{user?.email || 'user@example.com'}</p>
                <span className="profile-badge">EventHive Member</span>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit style={{ marginRight: '0.5rem' }} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <FaSave style={{ marginRight: '0.5rem' }} />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    <FaTimes style={{ marginRight: '0.5rem' }} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div 
            className="profile-form-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="profile-form-card">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser className="form-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope className="form-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <FaPhone className="form-icon" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    <FaMapMarkerAlt className="form-icon" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`form-textarea ${!isEditing ? 'disabled' : ''}`}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="profile-stats-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">12</div>
                <div className="stat-label">Events Attended</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5</div>
                <div className="stat-label">Upcoming Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">8</div>
                <div className="stat-label">Favorite Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">₹45,000</div>
                <div className="stat-label">Total Spent</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;