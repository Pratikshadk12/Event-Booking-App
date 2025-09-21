import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendar, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaTicketAlt,
  FaHistory,
  FaChevronDown,
  FaHome,
  FaStar
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const accountMenuRef = useRef(null);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsAccountMenuOpen(false);
    navigate('/profile');
  };

  const handleBookingHistoryClick = () => {
    setIsAccountMenuOpen(false);
    navigate('/booking-history');
  };

  const handleFavoritesClick = () => {
    setIsAccountMenuOpen(false);
    navigate('/favorites');
  };

  const handleSettingsClick = () => {
    setIsAccountMenuOpen(false);
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
    navigate('/auth');
  };

  const handleEventsClick = () => {
    // Always navigate to the dedicated Events page
    navigate('/events');
  };

  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render header for non-authenticated users
  }

  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <FaCalendar className="logo-icon" />
          <span className="logo-text">EventHive</span>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <FaHome style={{ marginRight: '0.5rem' }} />
            Home
          </Link>
          
          <button
            onClick={handleEventsClick}
            className="nav-link nav-button"
          >
            <FaTicketAlt style={{ marginRight: '0.5rem' }} />
            Events
          </button>
        </nav>

        {/* Account Dropdown */}
        <div className="account-menu" ref={accountMenuRef}>
          <motion.button
            className="account-button"
            onClick={handleAccountMenuToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="account-avatar">
              <FaUser />
            </div>
            <span className="account-name">
              {user?.name || 'User'}
            </span>
            <motion.div
              animate={{ rotate: isAccountMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronDown />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isAccountMenuOpen && (
              <motion.div
                className="account-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="dropdown-header">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <h4>{user?.name || 'User'}</h4>
                    <p>{user?.email || 'user@example.com'}</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <FaUser className="dropdown-icon" />
                    <span>My Profile</span>
                  </button>

                  <button 
                    className="dropdown-item"
                    onClick={handleBookingHistoryClick}
                  >
                    <FaHistory className="dropdown-icon" />
                    <span>Booking History</span>
                  </button>

                  <button 
                    className="dropdown-item"
                    onClick={handleFavoritesClick}
                  >
                    <FaStar className="dropdown-icon" />
                    <span>Favorites</span>
                  </button>

                  <button 
                    className="dropdown-item"
                    onClick={handleSettingsClick}
                  >
                    <FaCog className="dropdown-icon" />
                    <span>Settings</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;