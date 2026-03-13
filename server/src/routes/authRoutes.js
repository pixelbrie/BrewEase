const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyAuth = require('../middleware/verifyAuth');
const { roleCheck, attachUserRole } = require('../middleware/roleCheck');

// ============================================
// Public Routes (No Authentication Required)
// ============================================

// POST /api/auth/signup - Create a new user account
// Request body: { email, password, displayName, role, tenantId }
// Response: { uid, email, displayName, role, tenantId, token }
router.post('/signup', authController.signup);

// POST /api/auth/login - User login with email and password
// Request body: { email, password }
// Response: { uid, email, displayName, role, tenantId, token }
router.post('/login', authController.login);

// POST /api/auth/pos-login - POS terminal login with PIN
// Request body: { pin, terminalId }
// Response: { uid, email, displayName, role, tenantId, token, sessionId }
router.post('/pos-login', authController.posLogin);

// ============================================
// Protected Routes (Authentication Required)
// ============================================

// POST /api/auth/logout - Sign out user
// Requires: Valid authentication token
// Response: { message: 'Logout successful' }
router.post('/logout', verifyAuth, authController.logout);

// GET /api/auth/me - Get current user profile
// Requires: Valid authentication token
// Response: { uid, email, displayName, role, tenantId }
router.get('/me', verifyAuth, authController.getCurrentUser);

// POST /api/auth/refresh-token - Refresh expired authentication token
// Requires: Valid authentication token
// Response: { token }
router.post('/refresh-token', verifyAuth, authController.refreshToken);

// POST /api/auth/pos-logout - POS terminal logout
// Requires: Valid authentication token
// Request body: { sessionId }
// Response: { message: 'POS logout successful' }
router.post('/pos-logout', verifyAuth, authController.posLogout);

// GET /api/auth/pos-sessions - Get active POS sessions for current user
// Requires: Valid authentication token
// Response: Array of active session objects
router.get('/pos-sessions', verifyAuth, authController.getPOSSessions);

// ============================================
// Admin Routes (Admin Authentication Required)
// ============================================

// GET /api/auth/admin/users - List all users
// Requires: Admin role
// Response: Array of user objects
router.get(
    '/admin/users',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.getAllUsers
);

// PUT /api/auth/admin/users/:userId/role - Update user role
// Requires: Admin role
// URL params: userId
// Request body: { role }
// Response: { uid, email, displayName, role, tenantId }
router.put(
    '/admin/users/:userId/role',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.updateUserRole
);

// DELETE /api/auth/admin/users/:userId - Delete user account
// Requires: Admin role
// URL params: userId
// Response: { message: 'User deleted successfully' }
router.delete(
    '/admin/users/:userId',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.deleteUser
);

// POST /api/auth/admin/users/:userId/pin - Set or reset user PIN for POS
// Requires: Admin role
// URL params: userId
// Request body: { pin }
// Response: { message: 'PIN set successfully', uid }
router.post(
    '/admin/users/:userId/pin',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.setUserPIN
);

// GET /api/auth/admin/pos-sessions - View all active POS sessions
// Requires: Admin role
// Response: Array of all active POS sessions
router.get(
    '/admin/pos-sessions',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.getAllPOSSessions
);

// DELETE /api/auth/admin/pos-sessions/:sessionId - Terminate POS session
// Requires: Admin role
// URL params: sessionId
// Response: { message: 'POS session terminated successfully' }
router.delete(
    '/admin/pos-sessions/:sessionId',
    verifyAuth,
    attachUserRole,
    roleCheck('admin'),
    authController.terminatePOSSession
);

module.exports = router;

