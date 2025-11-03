const Order = require('../models/Order');
const Device = require('../models/Device');
const User = require('../models/User'); // Assuming User model for email lookup

// Helper for sending email (placeholder)
const sendOrderConfirmationEmail = async (userEmail, orderId, items, totalAmount) => {
  console.log(`Sending order confirmation to ${userEmail} for order ${orderId}`);
  console.log(`Items: ${JSON.stringify(items)}, Total: ${totalAmount}`);
  // In a real application, integrate with an email service like SendGrid, Nodemailer, etc.
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
  const { cartItems, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id; // User ID from authenticated token

  if (!cartItems || cartItems.length === 0 || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: 'Please provide cart items, shipping address, and payment method' });
  }

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const device = await Device.findById(item.deviceId);
      if (!device) {
        return res.status(404).json({ message: `Device with ID ${item.deviceId} not found` });
      }
      if (device.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${device.name}` });
      }

      orderItems.push({
        device: device._id,
        name: device.name,
        imageUrl: device.imageUrl,
        price: device.price,
        quantity: item.quantity,
      });
      totalAmount += device.price * item.quantity;

      // Decrease stock quantity
      device.stockQuantity -= item.quantity;
      await device.save();
    }

    // Simulate payment processing (in a real app, integrate with Stripe/PayPal etc.)
    const paymentStatus = 'paid'; // Or 'pending' based on gateway response

    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus,
      orderStatus: 'Processing',
      trackingNumber: `TRACK-${Date.now()}` // Simple tracking number
    });

    const order = await newOrder.save();

    // Send order confirmation email
    const user = await User.findById(userId);
    if (user) {
      await sendOrderConfirmationEmail(user.email, order._id, order.orderItems, order.totalAmount);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders/me
// @access  Private (Customer)
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('orderItems.device', 'name price imageUrl');
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private (Customer/Admin/Support)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.device', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user can only view their own orders unless they are admin/support
    if (order.user._id.toString() !== req.user.id && !['admin', 'support'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status (for admin/support)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Support)
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    const updatedOrder = await order.save();

    // In a real app, send update email to customer here
    const user = await User.findById(order.user);
    if (user) {
        console.log(`Sending order status update to ${user.email} for order ${order._id}. New status: ${updatedOrder.orderStatus}`);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get tracking information for an order
// @route   GET /api/orders/:id/track
// @access  Private (Customer/Admin/Support)
exports.getTrackingInfo = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('orderStatus trackingNumber');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user can only view tracking for their own orders unless they are admin/support
    // This needs the full order object, so we might fetch it again or adjust initial fetch
    const fullOrder = await Order.findById(req.params.id);
    if (fullOrder.user.toString() !== req.user.id && !['admin', 'support'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to view tracking for this order' });
    }

    res.json({ orderStatus: order.orderStatus, trackingNumber: order.trackingNumber });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
};
