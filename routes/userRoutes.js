const express = require('express');
const router = express.Router();
const { userController } = require('../controllers/index');

// --- User Account Management Routes ---

// Manual User Creation (Story: Manually Create User Accounts)
// POST /users
router.post('/', userController.createUser);

// Get All Users (Useful for admin dashboard and bulk operations)
// GET /users
router.get('/', userController.getAllUsers);

// Get User by ID (Needed for other operations like updating/deactivating)
// GET /users/:id
router.get('/:id', userController.getUserById);

// Manual User Attribute Management (Story: Manage User Attributes)
// PUT /users/:id
// Note: Changed from /attributes to just /:id for simplicity, assuming PUT to /users/:id updates the entire user or significant attributes.
// If specific attribute update is needed, a different endpoint like PUT /users/:id/attributes could be used.
router.put('/:id', userController.updateUserAttributes);

// Manual User Deactivation (Story: Manually Deactivate User Accounts)
// DELETE /users/:id/deactivate
router.delete('/:id/deactivate', userController.deactivateUser);


// --- Self-Service Password Reset Routes (Story: Self-Service Password Reset)

// POST /users/reset-password/initiate
// Initiates the password reset process (e.g., sends verification code)
router.post('/reset-password/initiate', userController.initiatePasswordReset);

// POST /users/reset-password/verify
// Verifies the user's identity (e.g., with code or security questions)
router.post('/reset-password/verify', userController.verifyIdentityForReset);

// POST /users/reset-password/confirm
// Confirms the password reset after successful verification
router.post('/reset-password/confirm', userController.resetPassword);


// --- Role Management Routes (Story: Define and Manage Custom Roles) ---

// POST /users/roles
// Creates a new custom role
router.post('/roles', userController.createCustomRole);

// GET /users/roles
// Retrieves all custom roles
router.get('/roles', userController.getCustomRoles);

// PUT /users/roles/:roleId
// Updates an existing custom role
router.put('/roles/:roleId', userController.updateCustomRole);

// DELETE /users/roles/:roleId
// Deletes a custom role
router.delete('/roles/:roleId', userController.deleteCustomRole);

module.exports = router;
