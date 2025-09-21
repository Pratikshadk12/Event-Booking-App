import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/App.css';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock booking data - replace with actual API call
      const mockBookings = [
        {
          id: 1,
          eventTitle: "Tech Conference 2024",
          eventDate: "2024-12-15",
          bookingDate: "2024-11-20",
          status: "confirmed",
          price: 2500,
          tickets: 2,
          venue: "Bangalore International Convention Centre",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop&auto=format"
        },
        {
          id: 2,
          eventTitle: "Music Festival",
          eventDate: "2024-11-30",
          bookingDate: "2024-11-10",
          status: "confirmed",
          price: 1500,
          tickets: 1,
          venue: "Phoenix MarketCity, Mumbai",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format"
        },
        {
          id: 3,
          eventTitle: "Workshop on AI",
          eventDate: "2024-10-15",
          bookingDate: "2024-10-01",
          status: "completed",
          price: 800,
          tickets: 1,
          venue: "IIT Delhi",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&auto=format"
        },
        {
          id: 4,
          eventTitle: "Food Carnival",
          eventDate: "2024-09-20",
          bookingDate: "2024-09-15",
          status: "cancelled",
          price: 500,
          tickets: 3,
          venue: "Cyber City, Gurgaon",
          image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=250&fit=crop&auto=format"
        }
      ];
      
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate > today && booking.status === 'confirmed';
      case 'past':
        return eventDate < today || booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'completed':
        return '★';
      case 'cancelled':
        return '✗';
      default:
        return '○';
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    e.target.parentElement.innerHTML += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 3rem;">🎭</div>';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="booking-history-page"
      >
        <div className="page-header">
          <h1 className="page-title">
            🎟️ Booking History
          </h1>
          <p className="page-subtitle">
            Track all your event bookings and experiences
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Bookings', count: bookings.length },
            { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.eventDate) > new Date() && b.status === 'confirmed').length },
            { key: 'past', label: 'Past Events', count: bookings.filter(b => new Date(b.eventDate) < new Date() || b.status === 'completed').length },
            { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
          ].map(tab => (
            <motion.button
              key={tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </motion.button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings in this category yet.</p>
          </motion.div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="booking-card"
              >
                <div className="booking-image">
                  <img 
                    src={booking.image} 
                    alt={booking.eventTitle}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                  </div>
                </div>

                <div className="booking-content">
                  <h3 className="booking-title">{booking.eventTitle}</h3>
                  <div className="booking-details">
                    <div className="booking-info">
                      <span className="info-label">📍 Venue:</span>
                      <span className="info-value">{booking.venue}</span>
                    </div>
                    <div className="booking-info">
                      <span className="info-label">📅 Event Date:</span>
                      <span className="info-value">
                        {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="booking-info">
                      <span className="info-label">🎫 Tickets:</span>
                      <span className="info-value">{booking.tickets}</span>
                    </div>
                    <div className="booking-info">
                      <span className="info-label">💰 Total:</span>
                      <span className="info-value">₹{booking.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="booking-info">
                      <span className="info-label">📝 Booked on:</span>
                      <span className="info-value">
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {booking.status === 'confirmed' && (
                      <>
                        <motion.button
                          className="action-btn primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Ticket
                        </motion.button>
                        <motion.button
                          className="action-btn secondary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel Booking
                        </motion.button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <motion.button
                        className="action-btn primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Rate Event
                      </motion.button>
                    )}
                    {booking.status === 'cancelled' && (
                      <motion.button
                        className="action-btn secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Rebook Event
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="booking-stats"
        >
          <h3>Your Booking Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-number">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-number">
                ₹{bookings.reduce((total, booking) => total + booking.price, 0).toLocaleString('en-IN')}
              </div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-number">
                {bookings.reduce((total, booking) => total + booking.tickets, 0)}
              </div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="stat-label">Events Attended</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingHistoryPage;