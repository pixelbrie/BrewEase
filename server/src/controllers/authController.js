// Import Firebase Admin SDK for server-side authentication operations
const admin = require('../config/firebaseAdmin');

// Import Firestore database reference
const db = admin.firestore();

// POST /api/auth/signup - Create a new user account
// Request body: { email, password, displayName, role, tenantId }
// Response: { uid, email, displayName, role, tenantId, token }
const signup = async (req, res) => {
    try {
        // Extract user data from request body
        // I used AI to write this and need to make edits to remove anything we dont need like email.
        const { email, password, displayName, role, tenantId } = req.body;

        // Validate that all required fields are provided
        if (!email || !password || !displayName || !role || !tenantId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new user in Firebase Authentication using email and password
        // This creates a user account that can be used to sign in
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName
        });

        // Extract the newly created user's UID (unique identifier)
        const uid = userRecord.uid;

        // Create a user document in Firestore to store additional profile data
        // This includes role, tenantId, and other user-specific information
        await db.collection('users').doc(uid).set({
            uid: uid,
            email: email,
            displayName: displayName,
            role: role,
            tenantId: tenantId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Generate a custom token that can be used to authenticate the user on the client
        // This token contains the user's UID, email, role, and tenantId
        const customToken = await admin.auth().createCustomToken(uid, {
            email: email,
            role: role,
            tenantId: tenantId
        });

        // Return success response with user data and authentication token
        return res.status(201).json({
            uid: uid,
            email: email,
            displayName: displayName,
            role: role,
            tenantId: tenantId,
            token: customToken
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Signup error:', error.message);

        // Check if error is due to email already existing
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Return generic error response
        return res.status(500).json({ error: 'Signup failed', details: error.message });
    }
};

// POST /api/auth/login - Authenticate user and return token
// Request body: { email, password }
// Response: { uid, email, displayName, role, tenantId, token }
const login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Look up the user by email in Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);

        // Extract the user's UID
        const uid = userRecord.uid;

        // Fetch the user's additional profile data from Firestore
        const userDoc = await db.collection('users').doc(uid).get();

        // Check if user document exists in Firestore
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Extract user data from Firestore document
        const userData = userDoc.data();

        // Generate a custom token with user's role and tenantId embedded
        // This token is used for subsequent authenticated requests
        const customToken = await admin.auth().createCustomToken(uid, {
            email: userRecord.email,
            role: userData.role,
            tenantId: userData.tenantId
        });

        // Return success response with user data and authentication token
        return res.status(200).json({
            uid: uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            role: userData.role,
            tenantId: userData.tenantId,
            token: customToken
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Login error:', error.message);

        // Check if error is due to user not found
        if (error.code === 'auth/user-not-found') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return generic error response
        return res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

// POST /api/auth/logout - Sign out user
// Note: Firebase logout is primarily handled on client-side
// This endpoint can be used for cleanup operations
const logout = async (req, res) => {
    try {
        // Extract user UID from the request (attached by verifyAuth middleware)
        const uid = req.user?.uid;

        // Validate that user UID is present
        if (!uid) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Optional: Revoke all refresh tokens for this user to invalidate all sessions
        // This ensures the user is logged out on all devices
        await admin.auth().revokeRefreshTokens(uid);

        // Return success response
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Log error for debugging
        console.error('Logout error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Logout failed', details: error.message });
    }
};

// GET /api/auth/me - Get current user profile
// Requires: Valid authentication token (verifyAuth middleware)
// Response: { uid, email, displayName, role, tenantId }
const getCurrentUser = async (req, res) => {
    try {
        // Extract user UID from the request (attached by verifyAuth middleware)
        const uid = req.user?.uid;

        // Validate that user UID is present
        if (!uid) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Fetch the user's profile data from Firestore
        const userDoc = await db.collection('users').doc(uid).get();

        // Check if user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Extract user data from Firestore document
        const userData = userDoc.data();

        // Return user's profile information (without sensitive data like passwords)
        return res.status(200).json(userData);
    } catch (error) {
        // Log error for debugging
        console.error('Get user error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
    }
};

// POST /api/auth/refresh-token - Refresh expired authentication token
// Requires: Valid authentication token (verifyAuth middleware)
// Response: { token }
const refreshToken = async (req, res) => {
    try {
        // Extract user UID and tenantId from the request (attached by verifyAuth middleware)
        const uid = req.user?.uid;
        const tenantId = req.user?.tenantId;

        // Validate that user UID is present
        if (!uid) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Fetch the user's profile data from Firestore to get current role
        const userDoc = await db.collection('users').doc(uid).get();

        // Check if user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Extract user data from Firestore document
        const userData = userDoc.data();

        // Generate a new custom token with updated user information
        // This ensures any role or permission changes are reflected in the new token
        const newToken = await admin.auth().createCustomToken(uid, {
            email: userData.email,
            role: userData.role,
            tenantId: userData.tenantId
        });

        // Return the new authentication token
        return res.status(200).json({ token: newToken });
    } catch (error) {
        // Log error for debugging
        console.error('Refresh token error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Token refresh failed', details: error.message });
    }
};

// GET /api/auth/admin/users - List all users (ADMIN only)
// Requires: Admin role (roleCheck middleware)
// Response: Array of user objects with uid, email, displayName, role, tenantId
const getAllUsers = async (req, res) => {
    try {
        // Extract the admin's tenantId from request (for tenant isolation)
        // This ensures admins only see users in their own tenant
        const adminTenantId = req.user?.tenantId;

        // Validate that tenantId is present
        if (!adminTenantId) {
            return res.status(400).json({ error: 'Tenant ID not found' });
        }

        // Query Firestore for all users matching the admin's tenantId
        // This enforces tenant isolation - admins can only see their own tenant's users
        const usersSnapshot = await db
            .collection('users')
            .where('tenantId', '==', adminTenantId)
            .get();

        // Create an array to store all user data
        const users = [];

        // Iterate through each user document
        usersSnapshot.forEach((doc) => {
            // Extract user data and add to array
            users.push(doc.data());
        });

        // Return the array of users
        return res.status(200).json(users);
    } catch (error) {
        // Log error for debugging
        console.error('Get all users error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

// PUT /api/auth/admin/users/:userId/role - Update user role (ADMIN only)
// Requires: Admin role (roleCheck middleware)
// URL params: userId
// Request body: { role }
// Response: { uid, email, displayName, role, tenantId }
const updateUserRole = async (req, res) => {
    try {
        // Extract the target user's ID from the URL parameter
        const userId = req.params.userId;

        // Extract the new role from request body
        const { role } = req.body;

        // Validate that role is provided
        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        // Validate that the role is one of the allowed roles
        const validRoles = ['admin', 'manager', 'barista', 'kitchen'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Fetch the user's current profile from Firestore
        const userDoc = await db.collection('users').doc(userId).get();

        // Check if user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract current user data
        const userData = userDoc.data();

        // Update the user's role in Firestore
        await db.collection('users').doc(userId).update({
            role: role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return the updated user data with new role
        return res.status(200).json({
            uid: userId,
            email: userData.email,
            displayName: userData.displayName,
            role: role,
            tenantId: userData.tenantId
        });
    } catch (error) {
        // Log error for debugging
        console.error('Update user role error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
};

// DELETE /api/auth/admin/users/:userId - Delete user account (ADMIN only)
// Requires: Admin role (roleCheck middleware)
// URL params: userId
// Response: { message: 'User deleted successfully' }
const deleteUser = async (req, res) => {
    try {
        // Extract the target user's ID from the URL parameter
        const userId = req.params.userId;

        // Extract admin's UID from request (to prevent self-deletion)
        const adminUid = req.user?.uid;

        // Prevent admin from deleting their own account
        if (userId === adminUid) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Fetch the user's profile from Firestore to verify they exist
        const userDoc = await db.collection('users').doc(userId).get();

        // Check if user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user from Firebase Authentication
        // This removes their ability to sign in
        await admin.auth().deleteUser(userId);

        // Delete the user's profile document from Firestore
        // This removes all their profile data and settings
        await db.collection('users').doc(userId).delete();

        // Return success response
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Log error for debugging
        console.error('Delete user error:', error.message);

        // Check if error is due to user not found in Auth
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ error: 'User not found in authentication' });
        }

        // Return error response
        return res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
};

// Export all controller functions for use in route files
module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
    refreshToken,
    getAllUsers,
    updateUserRole,
    deleteUser
};
