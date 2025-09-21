// API service for EventHive app
// This service layer will handle all API calls to the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Helper method for making API calls
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Event-related API calls
  async getEvents() {
    return this.request('/events');
  }

  async getEventById(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: eventData,
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking-related API calls
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  async getBookings() {
    return this.request('/bookings');
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  // Search and filter events
  async searchEvents(query) {
    return this.request(`/events/search?q=${encodeURIComponent(query)}`);
  }

  async getEventsByCategory(category) {
    return this.request(`/events/category/${encodeURIComponent(category)}`);
  }

  // Get available seats for an event
  async getAvailableSeats(eventId) {
    const event = await this.getEventById(eventId);
    return event.seats - event.bookedSeats;
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;