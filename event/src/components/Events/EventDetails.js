import React from 'react';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaUsers, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import './EventDetails.css';

const EventDetails = ({ event }) => {
  if (!event) return null;

  const availableSeats = event.seats - event.bookedSeats;
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM do, yyyy');
  const soldPercentage = (event.bookedSeats / event.seats) * 100;

  return (
    <div className="event-details-container">
      <div className="event-hero">
        <div className="event-hero-image">
          <img src={event.image} alt={event.title} />
        </div>
        <div className="event-hero-content">
          <div className="event-category-badge">{event.category}</div>
          <h1 className="event-title">{event.title}</h1>
          <div className="event-organizer">by {event.organizer}</div>
        </div>
      </div>

      <div className="event-info-grid">
        <div className="event-main-info">
          <div className="event-meta-info">
            <div className="meta-item">
              <FaCalendar className="meta-icon" />
              <div>
                <span className="meta-label">Date</span>
                <span className="meta-value">{formattedDate}</span>
              </div>
            </div>

            <div className="meta-item">
              <FaClock className="meta-icon" />
              <div>
                <span className="meta-label">Time</span>
                <span className="meta-value">{event.time}</span>
              </div>
            </div>

            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <div>
                <span className="meta-label">Location</span>
                <span className="meta-value">{event.location}</span>
                <span className="meta-address">{event.address}</span>
              </div>
            </div>

            <div className="meta-item">
              <FaTicketAlt className="meta-icon" />
              <div>
                <span className="meta-label">Price</span>
                <span className="meta-value">₹{event.priceINR}</span>
              </div>
            </div>

            <div className="meta-item">
              <FaUsers className="meta-icon" />
              <div>
                <span className="meta-label">Availability</span>
                <span className="meta-value">{availableSeats} of {event.seats} seats</span>
                <div className="seat-progress">
                  <div 
                    className="seat-progress-bar" 
                    style={{ width: `${soldPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="event-description">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>

          <div className="event-tags">
            {event.tags?.map((tag, index) => (
              <span key={index} className="event-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;