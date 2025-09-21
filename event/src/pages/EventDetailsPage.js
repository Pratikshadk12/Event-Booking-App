import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../data/mockEvents';
import EventDetails from '../components/Events/EventDetails';
import { FaArrowLeft, FaTicketAlt } from 'react-icons/fa';

const EventDetailsPage = () => {
  const { id } = useParams();
  const event = getEventById(id);

  if (!event) {
    return (
      <div className="error-page">
        <div className="container">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or may have been removed.</p>
          <Link to="/" className="btn-primary">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const availableSeats = event.seats - event.bookedSeats;

  return (
    <div className="event-details-page">
      <div className="page-navigation">
        <div className="container">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Events
          </Link>
        </div>
      </div>

      <EventDetails event={event} />

      <div className="event-actions">
        <div className="container">
          <div className="action-card">
            <div className="action-info">
              <h3>Ready to join this event?</h3>
              <p>Secure your tickets now - only {availableSeats} seats remaining!</p>
            </div>
            <Link 
              to={`/book/${event.id}`} 
              className="action-btn"
              disabled={availableSeats === 0}
            >
              <FaTicketAlt />
              {availableSeats > 0 ? 'Book Now' : 'Sold Out'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;