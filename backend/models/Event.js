const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    validate: {
      validator: function(time) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      },
      message: 'Please provide a valid time format (HH:MM)'
    }
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  priceINR: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  seats: {
    total: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1']
    },
    booked: {
      type: Number,
      default: 0,
      min: [0, 'Booked seats cannot be negative']
    },
    available: {
      type: Number,
      default: function() {
        return this.seats.total;
      }
    }
  },
  image: {
    type: String,
    required: [true, 'Event image is required'],
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Music', 'Technology', 'Art', 'Business', 'Food', 'Sports', 'Health', 'Education', 'Travel', 'Entertainment']
  },
  tags: [{
    type: String
  }],
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizer name is required']
    },
    contact: {
      email: String,
      phone: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  requirements: {
    ageLimit: {
      type: Number,
      min: 0,
      max: 100
    },
    dress_code: String,
    special_instructions: String
  }
}, {
  timestamps: true
});

// Update available seats before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('seats.booked') || this.isModified('seats.total')) {
    this.seats.available = this.seats.total - this.seats.booked;
  }
  next();
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.seats.booked >= this.seats.total;
});

// Virtual for getting formatted date
eventSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-IN');
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);