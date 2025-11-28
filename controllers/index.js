// This file will house controller functions for various modules.
// It's good practice to export them from here or create specific controller files.

// Importing controller functions
const userController = require('./userController');

// Example controller functions (to be implemented later)
const exampleController = {
  getHealth: (req, res) => {
    res.status(200).json({ status: 'healthy' });
  }
};

module.exports = {
  userController,
  exampleController
};
