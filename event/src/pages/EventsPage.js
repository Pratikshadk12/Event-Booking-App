import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../data/mockEvents';
import EventCard from '../components/Events/EventCard';
import { 
  FaSearch, 
  FaFilter, 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaLocationArrow,
  FaStar,
  FaTicketAlt
} from 'react-icons/fa';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', ...new Set(mockEvents.map(event => event.category))];
  const locations = ['All', ...new Set(mockEvents.map(event => event.location))];

  useEffect(() => {
    // Load events with animation
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  const handleBackToHome = () => {
    navigate('/');
  };

  // Remove search confetti function
  // const triggerSearchConfetti = () => {};

  return (
    <motion.div 
      className="events-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with Back Button */}
      <motion.div 
        className="events-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          <div className="events-header-content">
            <motion.button
              className="back-button"
              onClick={handleBackToHome}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </motion.button>
            
            <motion.div 
              className="events-title-section"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="events-page-title">
                <FaTicketAlt style={{ marginRight: '1rem', color: '#f5576c' }} />
                All Events
                <FaStar style={{ marginLeft: '1rem', color: '#fee140' }} />
              </h1>
              <p className="events-page-subtitle">
                Discover events happening near you
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.section 
        className="events-filters-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="container">
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search events, categories, locations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="search-input"
              />
            </div>

            {/* Filters */}
            <div className="filters-row">
              <div className="filter-group">
                <FaFilter className="filter-icon" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <FaLocationArrow className="filter-icon" />
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter-select"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'All' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Events Grid */}
      <motion.section 
        className="events-grid-section"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container">
          <AnimatePresence>
            {loading ? (
              <motion.div 
                className="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loader"></div>
                <p>Loading events...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="results-info"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p>
                    <FaCalendarAlt style={{ marginRight: '0.5rem', color: '#667eea' }} />
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                  </p>
                </motion.div>
                
                <motion.div 
                  className="events-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {filteredEvents.length === 0 && (
                  <motion.div 
                    className="no-events"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h3>No events found 🔍</h3>
                    <p>Try adjusting your search or filter criteria to discover more events!</p>
                    <motion.button
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        setSelectedLocation('All');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear All Filters
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default EventsPage;