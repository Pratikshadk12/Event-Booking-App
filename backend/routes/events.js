const express = require('express');
const Event = require('../models/Event');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all events with filtering
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  let query = Event.find({ isActive: true });

  // Filter by location (city/state)
  if (req.query.city) {
    query = query.find({ 'location.city': { $regex: req.query.city, $options: 'i' } });
  }
  if (req.query.state) {
    query = query.find({ 'location.state': { $regex: req.query.state, $options: 'i' } });
  }

  // Filter by category
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }

  // Filter by user interests (if authenticated)
  if (req.user && req.user.interests && req.query.personalized === 'true') {
    query = query.find({ category: { $in: req.user.interests } });
  }

  // Filter by date range
  if (req.query.startDate) {
    query = query.find({ date: { $gte: new Date(req.query.startDate) } });
  }
  if (req.query.endDate) {
    query = query.find({ date: { $lte: new Date(req.query.endDate) } });
  }

  // Filter by price range
  if (req.query.minPrice) {
    query = query.find({ priceINR: { $gte: req.query.minPrice } });
  }
  if (req.query.maxPrice) {
    query = query.find({ priceINR: { $lte: req.query.maxPrice } });
  }

  // Search by title or description
  if (req.query.search) {
    query = query.find({
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ]
    });
  }

  // Sorting
  const sortBy = req.query.sortBy || 'date';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  query = query.sort({ [sortBy]: sortOrder });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const events = await query;
  const total = await Event.countDocuments(query.getFilter());

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      event
    }
  });
}));

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: {
      event
    }
  });
}));

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: {
      event
    }
  });
}));

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Soft delete - mark as inactive
  await Event.findByIdAndUpdate(req.params.id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
}));

// @desc    Get featured events
// @route   GET /api/events/featured/list
// @access  Public
router.get('/featured/list', asyncHandler(async (req, res) => {
  const events = await Event.find({ 
    isActive: true, 
    featured: true,
    date: { $gte: new Date() }
  }).sort({ date: 1 }).limit(6);

  res.status(200).json({
    success: true,
    data: {
      events
    }
  });
}));

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
router.get('/category/:category', asyncHandler(async (req, res) => {
  const events = await Event.find({ 
    isActive: true,
    category: req.params.category,
    date: { $gte: new Date() }
  }).sort({ date: 1 });

  res.status(200).json({
    success: true,
    data: {
      events
    }
  });
}));

module.exports = router;