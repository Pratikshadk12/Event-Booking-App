const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  ticketsBooked: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: [1, 'At least 1 ticket must be booked'],
    max: [10, 'Maximum 10 tickets can be booked at once']
  },
  totalAmountINR: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    orderId: String,
    signature: String,
    method: {
      type: String,
      enum: ['card', 'netbanking', 'upi', 'wallet']
    },
    transactionId: String
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  attendeeDetails: [{
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    age: Number
  }],
  specialRequests: {
    type: String,
    maxLength: [500, 'Special requests cannot exceed 500 characters']
  },
  qrCode: {
    type: String // Will store QR code for ticket verification
  },
  checkIn: {
    isCheckedIn: {
      type: Boolean,
      default: false
    },
    checkInTime: Date,
    checkInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundDate: Date,
    refundReason: String
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ userId: 1, eventId: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ paymentStatus: 1 });

// Virtual for booking ID
bookingSchema.virtual('bookingId').get(function() {
  return `BK${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual for checking if booking is active
bookingSchema.virtual('isActive').get(function() {
  return this.bookingStatus === 'confirmed' && this.paymentStatus === 'completed';
});

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function(eventDate) {
  const now = new Date();
  const daysDifference = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysDifference >= 7) {
    return this.totalAmountINR * 0.9; // 90% refund
  } else if (daysDifference >= 3) {
    return this.totalAmountINR * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

// Pre-save middleware to populate attendee details
bookingSchema.pre('save', function(next) {
  // If attendee details are not provided, use user details
  if (this.attendeeDetails.length === 0) {
    for (let i = 0; i < this.ticketsBooked; i++) {
      this.attendeeDetails.push({
        name: `Attendee ${i + 1}`,
        email: '',
        phone: ''
      });
    }
  }
  next();
});

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);