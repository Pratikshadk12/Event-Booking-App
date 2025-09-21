// Utility functions for currency formatting and other helpers

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (price) => {
  // Format price with Indian numbering system
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`; // Lakh
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`; // Thousand
  }
  return `₹${price}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  
  return time.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getTimeUntilEvent = (dateString, timeString) => {
  const eventDateTime = new Date(`${dateString} ${timeString}`);
  const now = new Date();
  const timeDiff = eventDateTime - now;
  
  if (timeDiff < 0) {
    return 'Event has passed';
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  } else {
    return 'Starting soon';
  }
};