const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require('../controllers/deviceController');

// @route   GET api/devices
// @desc    Get all mobile devices (with filtering/sorting)
// @access  Public
router.get('/', getDevices);

// @route   GET api/devices/:id
// @desc    Get single mobile device by ID
// @access  Public
router.get('/:id', getDeviceById);

// @route   POST api/devices
// @desc    Add new mobile device
// @access  Private (Admin only)
router.post('/', protect, authorize(['admin']), createDevice);

// @route   PUT api/devices/:id
// @desc    Update mobile device by ID
// @access  Private (Admin only)
router.put('/:id', protect, authorize(['admin']), updateDevice);

// @route   DELETE api/devices/:id
// @desc    Delete mobile device by ID
// @access  Private (Admin only)
router.delete('/:id', protect, authorize(['admin']), deleteDevice);

module.exports = router;
