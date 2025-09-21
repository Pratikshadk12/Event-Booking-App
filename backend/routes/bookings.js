const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { eventId, ticketsBooked, attendeeDetails, specialRequests } = req.body;

  // Check if event exists and is active
  const event = await Event.findById(eventId);
  if (!event || !event.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Event not found or is not active'
    });
  }

  // Check if event date is in future
  if (event.date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot book tickets for past events'
    });
  }

  // Check available seats
  if (event.seats.available < ticketsBooked) {
    return res.status(400).json({
      success: false,
      message: `Only ${event.seats.available} seats available`
    });
  }

  // Calculate total amount
  const totalAmountINR = event.priceINR * ticketsBooked;

  // Create booking
  const booking = await Booking.create({
    userId: req.user._id,
    eventId,
    ticketsBooked,
    totalAmountINR,
    attendeeDetails: attendeeDetails || [],
    specialRequests,
    paymentStatus: 'pending'
  });

  // Temporarily hold the seats (will be confirmed after payment)
  event.seats.booked += ticketsBooked;
  await event.save();

  // Populate event and user details
  await booking.populate('eventId', 'title date location.venue priceINR');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking
    }
  });
}));

// @desc    Get user's bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
router.get('/user/:userId', protect, asyncHandler(async (req, res) => {
  // Users can only access their own bookings, unless admin
  if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { userId: req.params.userId };

  // Filter by booking status
  if (req.query.status) {
    query.bookingStatus = req.query.status;
  }

  // Filter by payment status
  if (req.query.paymentStatus) {
    query.paymentStatus = req.query.paymentStatus;
  }

  const bookings = await Booking.find(query)
    .populate('eventId', 'title date location.venue image category')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('eventId')
    .populate('userId', 'name email');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Users can only access their own bookings, unless admin
  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      booking
    }
  });
}));

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Users can only update their own bookings, unless admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Update booking
  if (bookingStatus) booking.bookingStatus = bookingStatus;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: {
      booking
    }
  });
}));

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('eventId');
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Users can only cancel their own bookings
  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if cancellation is allowed (event not started)
  if (booking.eventId.date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel booking for ongoing or past events'
    });
  }

  // Calculate refund amount
  const refundAmount = booking.calculateRefund(booking.eventId.date);

  // Update booking status
  booking.bookingStatus = 'cancelled';
  if (refundAmount > 0) {
    booking.refund = {
      isRefunded: true,
      refundAmount,
      refundDate: new Date(),
      refundReason: 'User cancellation'
    };
  }
  await booking.save();

  // Release seats back to event
  const event = await Event.findById(booking.eventId._id);
  event.seats.booked -= booking.ticketsBooked;
  await event.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      refundAmount,
      booking
    }
  });
}));

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
router.get('/', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = {};

  // Filter by event
  if (req.query.eventId) {
    query.eventId = req.query.eventId;
  }

  // Filter by status
  if (req.query.status) {
    query.bookingStatus = req.query.status;
  }

  const bookings = await Booking.find(query)
    .populate('eventId', 'title date location.venue')
    .populate('userId', 'name email')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

module.exports = router;