const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
    default: 'https://via.placeholder.com/150',
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  specifications: {
    // Example: { display: '6.1-inch', camera: '12MP', battery: '3000mAh' }
    type: Map,
    of: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
