// This file will serve as the main entry point for all routes.
// We will import and use route handlers from other files here.

const express = require('express');
const router = express.Router();

// Importing route handlers
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the IAM Service API!' });
});

module.exports = router;
