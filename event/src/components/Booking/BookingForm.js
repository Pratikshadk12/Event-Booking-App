import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaTicketAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import './BookingForm.css';

const BookingForm = ({ event, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tickets: 1,
    phone: '',
    specialRequests: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'tickets':
        const availableSeats = event.seats - event.bookedSeats;
        if (value < 1) return 'Must book at least 1 ticket';
        if (value > availableSeats) return `Only ${availableSeats} seats available`;
        if (value > 10) return 'Maximum 10 tickets per booking';
        return '';
      case 'phone':
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'phone' && key !== 'specialRequests') { // phone and specialRequests are optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const totalPrice = event.priceINR * formData.tickets;
  const availableSeats = event.seats - event.bookedSeats;

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <h2>Book Your Tickets</h2>
        <p>Secure your spot at this amazing event</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">
              <FaUser className="input-icon" />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Ticket Details</h3>
          
          <div className="form-group">
            <label htmlFor="tickets">
              <FaTicketAlt className="input-icon" />
              Number of Tickets *
            </label>
            <select
              id="tickets"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.tickets ? 'error' : ''}
              required
            >
              {Array.from({ length: Math.min(availableSeats, 10) }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'Ticket' : 'Tickets'}
                </option>
              ))}
            </select>
            {errors.tickets && <span className="error-message">{errors.tickets}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="specialRequests">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special accommodations or requests..."
              rows="3"
            />
          </div>
        </div>

        <div className="booking-summary">
          <div className="summary-row">
            <span>Ticket Price:</span>
            <span>₹{event.priceINR}</span>
          </div>
          <div className="summary-row">
            <span>Quantity:</span>
            <span>{formData.tickets}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || availableSeats === 0}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              Processing...
            </>
          ) : (
            <>
              <FaCheck />
              Book {formData.tickets} {formData.tickets === 1 ? 'Ticket' : 'Tickets'} - ₹{totalPrice}
            </>
          )}
        </button>

        <div className="booking-notes">
          <p>• Tickets are non-refundable</p>
          <p>• You'll receive confirmation via email</p>
          <p>• Please arrive 30 minutes before the event</p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;