import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, categories

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Mock favorites data - replace with actual API call
      const mockFavorites = [
        {
          id: 1,
          title: "Tech Conference 2024",
          date: "2024-12-15",
          price: 2500,
          category: "Technology",
          venue: "Bangalore International Convention Centre",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop&auto=format",
          description: "The biggest tech conference in India with industry leaders and innovators.",
          rating: 4.8,
          attendees: 1500,
          isAvailable: true
        },
        {
          id: 2,
          title: "Music Festival",
          date: "2024-11-30",
          price: 1500,
          category: "Music",
          venue: "Phoenix MarketCity, Mumbai",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format",
          description: "Three days of non-stop music with top artists from around the world.",
          rating: 4.9,
          attendees: 5000,
          isAvailable: true
        },
        {
          id: 3,
          title: "Food Carnival",
          date: "2024-10-15",
          price: 800,
          category: "Food",
          venue: "IIT Delhi",
          image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=250&fit=crop&auto=format",
          description: "Taste the best cuisines from around the world in one place.",
          rating: 4.6,
          attendees: 2000,
          isAvailable: false
        },
        {
          id: 4,
          title: "Art Exhibition",
          date: "2024-12-01",
          price: 500,
          category: "Art",
          venue: "National Gallery, Delhi",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&auto=format",
          description: "Contemporary art exhibition featuring local and international artists.",
          rating: 4.7,
          attendees: 800,
          isAvailable: true
        },
        {
          id: 5,
          title: "Startup Meetup",
          date: "2024-11-25",
          price: 0,
          category: "Business",
          venue: "WeWork, Bangalore",
          image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop&auto=format",
          description: "Network with entrepreneurs and learn about the latest startup trends.",
          rating: 4.5,
          attendees: 300,
          isAvailable: true
        }
      ];
      
      setTimeout(() => {
        setFavorites(mockFavorites);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const removeFavorite = (eventId) => {
    setFavorites(favorites.filter(event => event.id !== eventId));
  };

  const categories = [...new Set(favorites.map(event => event.category))];

  const filteredFavorites = favorites.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate > today;
      case 'available':
        return event.isAvailable;
      default:
        return true;
    }
  });

  const handleBookNow = (eventId) => {
    navigate(`/event/${eventId}`);
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
          <p>Loading your favorite events...</p>
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
        className="favorites-page"
      >
        <div className="page-header">
          <h1 className="page-title">
            ❤️ My Favorites
          </h1>
          <p className="page-subtitle">
            Keep track of events you love and never miss out
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Favorites', count: favorites.length },
            { key: 'upcoming', label: 'Upcoming', count: favorites.filter(e => new Date(e.date) > new Date()).length },
            { key: 'available', label: 'Available', count: favorites.filter(e => e.isAvailable).length }
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

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="categories-filter">
            <h3>Filter by Category</h3>
            <div className="category-chips">
              {categories.map(category => (
                <motion.span
                  key={category}
                  className="category-chip"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">💔</div>
            <h3>No favorite events found</h3>
            <p>You haven't added any events to your favorites yet. Browse events and click the heart icon to save them here!</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
            >
              Browse Events
            </motion.button>
          </motion.div>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`favorite-card ${!event.isAvailable ? 'unavailable' : ''}`}
              >
                <div className="favorite-image">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <motion.button
                    className="remove-favorite"
                    onClick={() => removeFavorite(event.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Remove from favorites"
                  >
                    💔
                  </motion.button>
                  {!event.isAvailable && (
                    <div className="unavailable-overlay">
                      <span>Event Passed</span>
                    </div>
                  )}
                  <div className="category-badge">{event.category}</div>
                </div>

                <div className="favorite-content">
                  <h3 className="favorite-title">{event.title}</h3>
                  <p className="favorite-description">{event.description}</p>
                  
                  <div className="favorite-details">
                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{event.venue}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">⭐</span>
                      <span className="detail-text">{event.rating} ({event.attendees} attendees)</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text price">
                        {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>

                  <div className="favorite-actions">
                    {event.isAvailable ? (
                      <motion.button
                        className="action-btn primary"
                        onClick={() => handleBookNow(event.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Book Now
                      </motion.button>
                    ) : (
                      <motion.button
                        className="action-btn disabled"
                        disabled
                      >
                        Event Ended
                      </motion.button>
                    )}
                    <motion.button
                      className="action-btn secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Share
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Favorites Statistics */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="favorites-stats"
          >
            <h3>Your Favorites Insights</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-number">{favorites.length}</div>
                <div className="stat-label">Total Favorites</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-number">{favorites.filter(e => e.isAvailable).length}</div>
                <div className="stat-label">Available Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-number">{categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💸</div>
                <div className="stat-number">
                  ₹{favorites.filter(e => e.isAvailable).reduce((total, event) => total + event.price, 0).toLocaleString('en-IN')}
                </div>
                <div className="stat-label">Total Value</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="recommendations-section"
        >
          <h3>💡 Recommendations Based on Your Favorites</h3>
          <p>We think you might like these events based on your favorite categories:</p>
          <div className="recommendation-categories">
            {categories.map(category => (
              <motion.button
                key={category}
                className="recommendation-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/?category=${category.toLowerCase()}`)}
              >
                Explore More {category} Events
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FavoritesPage;