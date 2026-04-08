// server/src/middleware/roleCheck.js
import { db } from '../config/firebaseAdmin.js';
import { ROUTE_PROTECTION, ROLE_PERMISSIONS } from '../config/roles.js';

const roleCheck = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(403).json({ error: 'User role not found' });
            }

            // Check if user has required role
            const roleHierarchy = ['admin', 'manager', 'barista', 'kitchen'];
            const userRoleIndex = roleHierarchy.indexOf(userRole);
            const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

            if (userRoleIndex < requiredRoleIndex) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Role verification failed' });
        }
    };
};

// Middleware to fetch user role from Firestore
const attachUserRole = async (req, res, next) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        req.user.role = userData.role;
        req.user.tenantId = userData.tenantId;

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user role' });
    }
};

export { roleCheck, attachUserRole };
