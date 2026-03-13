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
        // Extract user UID from the request (attached by verifyAuth middleware)
        const uid = req.user?.uid;

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

// POST /api/auth/pos-login - POS terminal login with PIN
// Request body: { pin, terminalId }
// Response: { uid, email, displayName, role, tenantId, token, sessionId }
const posLogin = async (req, res) => {
    try {
        // Extract PIN and terminal ID from request body
        const { pin, terminalId } = req.body;

        // Validate that both PIN and terminalId are provided
        if (!pin || !terminalId) {
            return res.status(400).json({ error: 'PIN and terminalId are required' });
        }

        // Validate PIN format (should be numeric and typically 4-6 digits)
        if (!/^\d{4,6}$/.test(pin)) {
            return res.status(400).json({ error: 'Invalid PIN format' });
        }

        // Query Firestore to find user with matching PIN
        const usersSnapshot = await db
            .collection('users')
            .where('pin', '==', pin)
            .get();

        // Check if any user was found with this PIN
        if (usersSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }

        // Get the first (and should be only) user with this PIN
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        const uid = userDoc.id;

        // Check if user is active (not suspended)
        if (userData.suspended) {
            return res.status(403).json({ error: 'User account is suspended' });
        }

        // Generate a unique session ID for this POS login
        const sessionId = `${terminalId}-${uid}-${Date.now()}`;

        // Create a POS session record in Firestore
        await db.collection('pos_sessions').doc(sessionId).set({
            sessionId: sessionId,
            uid: uid,
            terminalId: terminalId,
            email: userData.email,
            displayName: userData.displayName,
            role: userData.role,
            tenantId: userData.tenantId,
            loginTime: admin.firestore.FieldValue.serverTimestamp(),
            lastActivityTime: admin.firestore.FieldValue.serverTimestamp(),
            active: true
        });

        // Generate a custom token for the POS session
        const customToken = await admin.auth().createCustomToken(uid, {
            email: userData.email,
            role: userData.role,
            tenantId: userData.tenantId,
            sessionId: sessionId,
            posLogin: true
        });

        // Return success response with user data, token, and session ID
        return res.status(200).json({
            uid: uid,
            email: userData.email,
            displayName: userData.displayName,
            role: userData.role,
            tenantId: userData.tenantId,
            token: customToken,
            sessionId: sessionId
        });
    } catch (error) {
        // Log error for debugging
        console.error('POS login error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'POS login failed', details: error.message });
    }
};

// POST /api/auth/pos-logout - POS terminal logout
// Requires: Valid authentication token
// Request body: { sessionId }
// Response: { message: 'POS logout successful' }
const posLogout = async (req, res) => {
    try {
        // Extract user UID from request (attached by verifyAuth middleware)
        const uid = req.user?.uid;

        // Extract session ID from request body
        const { sessionId } = req.body;

        // Validate that user UID is present
        if (!uid) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Validate that session ID is provided
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Fetch the POS session from Firestore
        const sessionDoc = await db.collection('pos_sessions').doc(sessionId).get();

        // Check if session exists
        if (!sessionDoc.exists) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Verify that the session belongs to the current user
        const sessionData = sessionDoc.data();
        if (sessionData.uid !== uid) {
            return res.status(403).json({ error: 'Cannot logout from another user\'s session' });
        }

        // Mark the session as inactive and update logout time
        await db.collection('pos_sessions').doc(sessionId).update({
            active: false,
            logoutTime: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return success response
        return res.status(200).json({ message: 'POS logout successful' });
    } catch (error) {
        // Log error for debugging
        console.error('POS logout error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'POS logout failed', details: error.message });
    }
};

// GET /api/auth/pos-sessions - Get active POS sessions for current user
// Requires: Valid authentication token
// Response: Array of active session objects
const getPOSSessions = async (req, res) => {
    try {
        // Extract user UID from request (attached by verifyAuth middleware)
        const uid = req.user?.uid;

        // Validate that user UID is present
        if (!uid) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Query Firestore for all active sessions belonging to this user
        const sessionsSnapshot = await db
            .collection('pos_sessions')
            .where('uid', '==', uid)
            .where('active', '==', true)
            .get();

        // Create an array to store all session data
        const sessions = [];

        // Iterate through each session document
        sessionsSnapshot.forEach((doc) => {
            // Extract session data and add to array
            sessions.push(doc.data());
        });

        // Return the array of active sessions
        return res.status(200).json(sessions);
    } catch (error) {
        // Log error for debugging
        console.error('Get POS sessions error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to fetch POS sessions', details: error.message });
    }
};

// POST /api/auth/admin/users/:userId/pin - Set or reset user PIN for POS
// Requires: Admin role
// URL params: userId
// Request body: { pin }
// Response: { message: 'PIN set successfully', uid }
const setUserPIN = async (req, res) => {
    try {
        // Extract the target user's ID from the URL parameter
        const userId = req.params.userId;

        // Extract the new PIN from request body
        const { pin } = req.body;

        // Validate that PIN is provided
        if (!pin) {
            return res.status(400).json({ error: 'PIN is required' });
        }

        // Validate PIN format (should be numeric and typically 4-6 digits)
        if (!/^\d{4,6}$/.test(pin)) {
            return res.status(400).json({ error: 'PIN must be 4-6 digits' });
        }

        // Fetch the user's profile from Firestore to verify they exist
        const userDoc = await db.collection('users').doc(userId).get();

        // Check if user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's PIN in Firestore
        await db.collection('users').doc(userId).update({
            pin: pin,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return success response
        return res.status(200).json({
            message: 'PIN set successfully',
            uid: userId
        });
    } catch (error) {
        // Log error for debugging
        console.error('Set user PIN error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to set user PIN', details: error.message });
    }
};

// GET /api/auth/admin/pos-sessions - View all active POS sessions
// Requires: Admin role
// Response: Array of all active POS sessions
const getAllPOSSessions = async (req, res) => {
    try {
        // Extract the admin's tenantId from request (for tenant isolation)
        const adminTenantId = req.user?.tenantId;

        // Validate that tenantId is present
        if (!adminTenantId) {
            return res.status(400).json({ error: 'Tenant ID not found' });
        }

        // Query Firestore for all active POS sessions in this tenant
        const sessionsSnapshot = await db
            .collection('pos_sessions')
            .where('tenantId', '==', adminTenantId)
            .where('active', '==', true)
            .get();

        // Create an array to store all session data
        const sessions = [];

        // Iterate through each session document
        sessionsSnapshot.forEach((doc) => {
            // Extract session data and add to array
            sessions.push(doc.data());
        });

        // Return the array of active sessions
        return res.status(200).json(sessions);
    } catch (error) {
        // Log error for debugging
        console.error('Get all POS sessions error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to fetch POS sessions', details: error.message });
    }
};

// DELETE /api/auth/admin/pos-sessions/:sessionId - Terminate POS session
// Requires: Admin role
// URL params: sessionId
// Response: { message: 'POS session terminated successfully' }
const terminatePOSSession = async (req, res) => {
    try {
        // Extract the session ID from the URL parameter
        const sessionId = req.params.sessionId;

        // Fetch the POS session from Firestore to verify it exists
        const sessionDoc = await db.collection('pos_sessions').doc(sessionId).get();

        // Check if session document exists
        if (!sessionDoc.exists) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Mark the session as inactive and set termination time
        await db.collection('pos_sessions').doc(sessionId).update({
            active: false,
            terminatedAt: admin.firestore.FieldValue.serverTimestamp(),
            terminatedBy: req.user?.uid
        });

        // Return success response
        return res.status(200).json({ message: 'POS session terminated successfully' });
    } catch (error) {
        // Log error for debugging
        console.error('Terminate POS session error:', error.message);

        // Return error response
        return res.status(500).json({ error: 'Failed to terminate POS session', details: error.message });
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
    deleteUser,
    posLogin,
    posLogout,
    getPOSSessions,
    setUserPIN,
    getAllPOSSessions,
    terminatePOSSession
};
