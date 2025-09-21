import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, bookEvent } from '../data/mockEvents';
import BookingForm from '../components/Booking/BookingForm';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  if (!event) {
    return (
      <div className="error-page">
        <div className="container">
          <h2>Event Not Found</h2>
          <p>The event you're trying to book doesn't exist.</p>
          <Link to="/" className="btn-primary">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Book the event
      const success = bookEvent(id, parseInt(formData.tickets));
      
      if (success) {
        setBookingData({
          ...formData,
          event: event,
          totalPrice: event.priceINR * formData.tickets,
          bookingId: 'BK' + Date.now()
        });
        setIsSubmitted(true);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && bookingData) {
    return (
      <div className="booking-success-page">
        <div className="container">
          <div className="success-card">
            <div className="success-header">
              <FaCheckCircle className="success-icon" />
              <h1>Booking Confirmed!</h1>
              <p>Your tickets have been successfully reserved</p>
            </div>
            
            <div className="booking-details">
              <h3>Booking Details</h3>
              <div className="detail-row">
                <span>Booking ID:</span>
                <span className="booking-id">{bookingData.bookingId}</span>
              </div>
              <div className="detail-row">
                <span>Event:</span>
                <span>{bookingData.event.title}</span>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <span>{bookingData.event.date} at {bookingData.event.time}</span>
              </div>
              <div className="detail-row">
                <span>Location:</span>
                <span>{bookingData.event.location}</span>
              </div>
              <div className="detail-row">
                <span>Tickets:</span>
                <span>{bookingData.tickets}</span>
              </div>
              <div className="detail-row total">
                <span>Total Paid:</span>
                <span>₹{bookingData.totalPrice}</span>
              </div>
            </div>
            
            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>Check your email for confirmation and tickets</li>
                <li>Arrive 30 minutes before the event starts</li>
                <li>Bring a valid ID for entry verification</li>
              </ul>
            </div>
            
            <div className="success-actions">
              <button onClick={() => navigate('/')} className="btn-primary">
                Browse More Events
              </button>
              <button onClick={() => window.print()} className="btn-secondary">
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableSeats = event.seats - event.bookedSeats;

  return (
    <div className="booking-page">
      <div className="page-navigation">
        <div className="container">
          <Link to={`/event/${event.id}`} className="back-link">
            <FaArrowLeft /> Back to Event Details
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="booking-layout">
          <div className="event-summary-card">
            <div className="event-summary">
              <img src={event.image} alt={event.title} className="summary-image" />
              <div className="summary-content">
                <h2>{event.title}</h2>
                <p className="summary-date">{event.date} at {event.time}</p>
                <p className="summary-location">{event.location}</p>
                <p className="summary-price">From ₹{event.priceINR} per ticket</p>
                <p className="summary-seats">{availableSeats} seats remaining</p>
              </div>
            </div>
          </div>
          
          <BookingForm 
            event={event} 
            onSubmit={handleBookingSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;