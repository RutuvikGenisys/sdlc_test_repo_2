const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  getTrackingInfo
} = require('../controllers/orderController');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private (Customer)
router.post('/', protect, createOrder);

// @route   GET api/orders/me
// @desc    Get all orders for the authenticated user
// @access  Private (Customer)
router.get('/me', protect, getOrdersByUser);

// @route   GET api/orders/:id
// @desc    Get order details by ID
// @access  Private (Customer/Admin/Support)
router.get('/:id', protect, getOrderById);

// @route   PUT api/orders/:id/status
// @desc    Update order status (for admin/support)
// @access  Private (Admin/Support)
router.put('/:id/status', protect, authorize(['admin', 'support']), updateOrderStatus);

// @route   GET api/orders/:id/track
// @desc    Get tracking information for an order
// @access  Private (Customer/Admin/Support)
router.get('/:id/track', protect, getTrackingInfo);

module.exports = router;
