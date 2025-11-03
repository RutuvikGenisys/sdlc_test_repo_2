const Device = require('../models/Device');

// @desc    Get all mobile devices (with filtering/sorting)
// @route   GET /api/devices
// @access  Public
exports.getDevices = async (req, res) => {
  try {
    let query = {};

    // Filtering
    if (req.query.brand) {
      query.brand = { $regex: req.query.brand, $options: 'i' };
    }
    if (req.query.model) {
      query.model = { $regex: req.query.model, $options: 'i' };
    }
    if (req.query.minPrice) {
      query.price = { ...query.price, $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
    }

    let devicesQuery = Device.find(query);

    // Sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      devicesQuery = devicesQuery.sort({ [parts[0]]: parts[1] === 'desc' ? -1 : 1 });
    } else {
      devicesQuery = devicesQuery.sort({ createdAt: -1 }); // Default sort
    }

    const devices = await devicesQuery;
    res.json(devices);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single mobile device by ID
// @route   GET /api/devices/:id
// @access  Public
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Add new mobile device
// @route   POST /api/devices
// @access  Private (Admin only)
exports.createDevice = async (req, res) => {
  const { name, brand, model, price, description, imageUrl, stockQuantity, specifications } = req.body;

  if (!name || !brand || !model || !price || !stockQuantity) {
    return res.status(400).json({ message: 'Please include all required fields: name, brand, model, price, stockQuantity' });
  }

  try {
    const newDevice = new Device({
      name,
      brand,
      model,
      price,
      description,
      imageUrl,
      stockQuantity,
      specifications,
    });

    const device = await newDevice.save();
    res.status(201).json(device);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update mobile device by ID
// @route   PUT /api/devices/:id
// @access  Private (Admin only)
exports.updateDevice = async (req, res) => {
  const { name, brand, model, price, description, imageUrl, stockQuantity, specifications } = req.body;

  // Build device object
  const deviceFields = {};
  if (name) deviceFields.name = name;
  if (brand) deviceFields.brand = brand;
  if (model) deviceFields.model = model;
  if (price) deviceFields.price = price;
  if (description) deviceFields.description = description;
  if (imageUrl) deviceFields.imageUrl = imageUrl;
  if (stockQuantity !== undefined) deviceFields.stockQuantity = stockQuantity;
  if (specifications) deviceFields.specifications = specifications;

  try {
    let device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device = await Device.findByIdAndUpdate(
      req.params.id,
      { $set: deviceFields },
      { new: true }
    );

    res.json(device);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete mobile device by ID
// @route   DELETE /api/devices/:id
// @access  Private (Admin only)
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await Device.deleteOne({ _id: req.params.id });

    res.json({ message: 'Device removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(500).send('Server Error');
  }
};
