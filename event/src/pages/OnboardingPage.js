import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaHome, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    interests: [],
    contacts: {
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    },
    location: {
      city: '',
      state: '',
      coordinates: {
        lat: null,
        lng: null
      }
    }
  });

  const { completeOnboarding, user } = useAuth();
  const navigate = useNavigate();

  const interests = [
    { id: 'Music', icon: '🎵', color: '#ff6b6b' },
    { id: 'Technology', icon: '💻', color: '#4ecdc4' },
    { id: 'Art', icon: '🎨', color: '#45b7d1' },
    { id: 'Business', icon: '💼', color: '#feca57' },
    { id: 'Food', icon: '🍕', color: '#ff9ff3' },
    { id: 'Sports', icon: '⚽', color: '#96ceb4' },
    { id: 'Health', icon: '💪', color: '#a8edea' },
    { id: 'Education', icon: '📚', color: '#d299c2' },
    { id: 'Travel', icon: '✈️', color: '#89f7fe' },
    { id: 'Entertainment', icon: '🎬', color: '#fef9d7' }
  ];

  const steps = [
    {
      title: "What interests you?",
      subtitle: "Select your favorite event categories to get personalized recommendations",
      component: "interests"
    },
    {
      title: "Contact Information",
      subtitle: "Help us reach you with important updates",
      component: "contacts"
    },
    {
      title: "Location",
      subtitle: "Discover events happening near you",
      component: "location"
    }
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild 
            ? { ...prev[parent][child], [grandchild]: value }
            : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          }));
          
          // Reverse geocoding would go here in a real app
          // For now, we'll just set some sample data
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              city: 'Mumbai',
              state: 'Maharashtra'
            }
          }));
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.interests.length > 0;
      case 1:
        return formData.contacts.phone.length >= 10;
      case 2:
        return formData.location.city && formData.location.state;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const result = await completeOnboarding(formData);
      if (result.success) {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const renderInterests = () => (
    <div className="interests-grid">
      {interests.map((interest) => (
        <motion.div
          key={interest.id}
          className={`interest-card ${formData.interests.includes(interest.id) ? 'selected' : ''}`}
          onClick={() => toggleInterest(interest.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ '--color': interest.color }}
        >
          <div className="interest-icon">{interest.icon}</div>
          <div className="interest-name">{interest.id}</div>
          {formData.interests.includes(interest.id) && (
            <motion.div
              className="interest-check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <FaCheck />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-form">
      <div className="form-group">
        <label htmlFor="phone">
          <FaPhone className="input-icon" />
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="contacts.phone"
          value={formData.contacts.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="street">
          <FaHome className="input-icon" />
          Street Address (Optional)
        </label>
        <input
          type="text"
          id="street"
          name="contacts.address.street"
          value={formData.contacts.address.street}
          onChange={handleInputChange}
          placeholder="Enter your street address"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="contacts.address.city"
            value={formData.contacts.address.city}
            onChange={handleInputChange}
            placeholder="City"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="contacts.address.pincode"
            value={formData.contacts.address.pincode}
            onChange={handleInputChange}
            placeholder="Pincode"
          />
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="location-form">
      <div className="location-auto">
        <button
          type="button"
          className="location-btn"
          onClick={getLocation}
        >
          <FaMapMarkerAlt />
          Auto-detect my location
        </button>
        <p className="location-help">
          We'll use this to show you events happening nearby
        </p>
      </div>

      <div className="form-divider">
        <span>or enter manually</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="locationCity">City</label>
          <input
            type="text"
            id="locationCity"
            name="location.city"
            value={formData.location.city}
            onChange={handleInputChange}
            placeholder="Your city"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="locationState">State</label>
          <input
            type="text"
            id="locationState"
            name="location.state"
            value={formData.location.state}
            onChange={handleInputChange}
            placeholder="Your state"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderInterests();
      case 1:
        return renderContacts();
      case 2:
        return renderLocation();
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <motion.div
          className="onboarding-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Welcome to EventHive, {user?.name}! 🎉</h1>
          <p>Let's personalize your experience</p>
        </motion.div>

        <div className="progress-bar">
          <div className="progress-steps">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-step ${index <= currentStep ? 'active' : ''}`}
              >
                {index < currentStep ? <FaCheck /> : index + 1}
              </div>
            ))}
          </div>
          <div 
            className="progress-line" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="step-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2>{steps[currentStep].title}</h2>
            <p>{steps[currentStep].subtitle}</p>
            
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        <div className="step-actions">
          {currentStep > 0 && (
            <motion.button
              className="btn-secondary"
              onClick={prevStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              Previous
            </motion.button>
          )}
          
          <motion.button
            className="btn-primary"
            onClick={nextStep}
            disabled={!isStepValid()}
            whileHover={{ scale: isStepValid() ? 1.05 : 1 }}
            whileTap={{ scale: isStepValid() ? 0.95 : 1 }}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <FaArrowRight />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;