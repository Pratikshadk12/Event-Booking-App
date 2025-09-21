import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';
import './EventCard.css';

const EventCard = ({ event }) => {
  const availableSeats = event.seats - event.bookedSeats;
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');

  return (
    <div className="event-card">
      <div className="event-card-image">
        <img src={event.image} alt={event.title} />
        <div className="event-category">{event.category}</div>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        
        <div className="event-card-details">
          <div className="event-detail-item">
            <FaCalendar className="detail-icon" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="event-detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{event.location}</span>
          </div>
          
          <div className="event-detail-item">
            <FaTicketAlt className="detail-icon" />
            <span>₹{event.priceINR}</span>
          </div>
          
          <div className="event-detail-item">
            <FaUsers className="detail-icon" />
            <span>{availableSeats} seats left</span>
          </div>
        </div>
        
        <p className="event-card-description">
          {event.description.substring(0, 120)}...
        </p>
        
        <div className="event-card-actions">
          <Link to={`/event/${event.id}`} className="btn-secondary">
            View Details
          </Link>
          <Link to={`/book/${event.id}`} className="btn-primary">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;