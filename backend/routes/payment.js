const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
router.post('/create-order', protect, asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  // Get booking details
  const booking = await Booking.findById(bookingId).populate('eventId');
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Verify booking belongs to user
  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if payment is already completed
  if (booking.paymentStatus === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Payment already completed for this booking'
    });
  }

  // Create Razorpay order
  const options = {
    amount: booking.totalAmountINR * 100, // Amount in paise
    currency: 'INR',
    receipt: `booking_${bookingId}`,
    notes: {
      bookingId: bookingId,
      eventTitle: booking.eventId.title,
      userId: req.user._id.toString()
    }
  };

  try {
    const order = await razorpay.orders.create(options);

    // Update booking with order details
    booking.paymentDetails.orderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: bookingId,
        eventTitle: booking.eventId.title,
        userEmail: req.user.email,
        userPhone: req.user.contacts?.phone || ''
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
}));

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    bookingId 
  } = req.body;

  // Generate signature for verification
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // Verify signature
  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }

  try {
    // Get booking
    const booking = await Booking.findById(bookingId).populate('eventId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update booking with payment details
    booking.paymentStatus = 'completed';
    booking.paymentDetails = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      method: payment.method,
      transactionId: payment.acquirer_data?.rrn || payment.id
    };
    booking.bookingStatus = 'confirmed';

    await booking.save();

    // Generate QR code data for ticket verification
    const qrData = {
      bookingId: booking._id,
      eventId: booking.eventId._id,
      userId: booking.userId,
      ticketsBooked: booking.ticketsBooked,
      verification: crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${booking._id}_${booking.eventId._id}_${booking.userId}`)
        .digest('hex')
    };

    booking.qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64');
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          eventTitle: booking.eventId.title,
          ticketsBooked: booking.ticketsBooked,
          totalAmountINR: booking.totalAmountINR,
          paymentStatus: booking.paymentStatus,
          bookingStatus: booking.bookingStatus,
          qrCode: booking.qrCode
        }
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Mark payment as failed if verification fails
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'failed';
      await booking.save();

      // Release seats back to event
      const event = await Event.findById(booking.eventId);
      if (event) {
        event.seats.booked -= booking.ticketsBooked;
        await event.save();
      }
    }

    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
}));

// @desc    Handle payment failure
// @route   POST /api/payment/failure
// @access  Private
router.post('/failure', protect, asyncHandler(async (req, res) => {
  const { bookingId, error } = req.body;

  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Verify booking belongs to user
  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Update booking status
  booking.paymentStatus = 'failed';
  booking.bookingStatus = 'cancelled';
  await booking.save();

  // Release seats back to event
  const event = await Event.findById(booking.eventId);
  if (event) {
    event.seats.booked -= booking.ticketsBooked;
    await event.save();
  }

  res.status(200).json({
    success: true,
    message: 'Payment failure handled',
    data: {
      bookingId,
      status: 'cancelled'
    }
  });
}));

// @desc    Get payment history (Admin only)
// @route   GET /api/payment/history
// @access  Private (Admin)
router.get('/history', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const payments = await Booking.find({ paymentStatus: 'completed' })
    .populate('eventId', 'title date')
    .populate('userId', 'name email')
    .select('totalAmountINR paymentDetails bookingDate')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments({ paymentStatus: 'completed' });

  // Calculate total revenue
  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmountINR' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      },
      totalRevenue: totalRevenue[0]?.total || 0
    }
  });
}));

module.exports = router;