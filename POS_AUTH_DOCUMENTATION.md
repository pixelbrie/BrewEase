# POS Authentication Implementation Guide

## Overview
This document describes the complete POS authentication system implemented in the BrewEase application. The system provides secure PIN-based authentication for POS terminals while maintaining compatibility with the existing email/password authentication system.

## Architecture

### Key Components
1. **Routes** (`server/src/routes/authRoutes.js`) - Defines all authentication endpoints
2. **Controllers** (`server/src/controllers/authController.js`) - Handles the business logic
3. **Middleware** (`server/src/middleware/verifyAuth.js`, `roleCheck.js`) - Enforces authentication and authorization
4. **Database** - Uses Firebase Authentication and Firestore for data persistence

## Public Routes (No Authentication Required)

### 1. User Signup
```
POST /api/auth/signup
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123"
}
```

**Response (201):**
```json
{
  "uid": "user-uid-123",
  "email": "user@example.com",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123",
  "token": "custom-auth-token"
}
```

---

### 2. User Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "uid": "user-uid-123",
  "email": "user@example.com",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123",
  "token": "custom-auth-token"
}
```

---

### 3. POS Terminal Login (PIN-Based)
```
POST /api/auth/pos-login
```
**Request Body:**
```json
{
  "pin": "1234",
  "terminalId": "pos-terminal-01"
}
```

**Response (200):**
```json
{
  "uid": "user-uid-123",
  "email": "user@example.com",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123",
  "token": "custom-auth-token",
  "sessionId": "pos-terminal-01-user-uid-123-1710333600000"
}
```

**PIN Validation Rules:**
- Must be 4-6 digits
- Must match a user's PIN in the database
- User account must not be suspended

**Response (401):**
```json
{
  "error": "Invalid PIN"
}
```

---

## Protected Routes (Authentication Required)

All protected routes require a valid authentication token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### 1. User Logout
```
POST /api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Details:**
- Revokes all refresh tokens for the user
- User will be logged out on all devices
- No request body required

---

### 2. Get Current User Profile
```
GET /api/auth/me
```

**Response (200):**
```json
{
  "uid": "user-uid-123",
  "email": "user@example.com",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123",
  "createdAt": "2024-03-13T10:30:00Z",
  "updatedAt": "2024-03-13T15:45:00Z"
}
```

---

### 3. Refresh Authentication Token
```
POST /api/auth/refresh-token
```

**Response (200):**
```json
{
  "token": "new-custom-auth-token"
}
```

**Details:**
- Issues a new token with current user permissions
- Reflects any role changes since last login
- No request body required

---

### 4. POS Terminal Logout
```
POST /api/auth/pos-logout
```

**Request Body:**
```json
{
  "sessionId": "pos-terminal-01-user-uid-123-1710333600000"
}
```

**Response (200):**
```json
{
  "message": "POS logout successful"
}
```

**Details:**
- Marks the POS session as inactive
- Records the logout timestamp
- User can only logout from their own sessions

---

### 5. Get User's Active POS Sessions
```
GET /api/auth/pos-sessions
```

**Response (200):**
```json
[
  {
    "sessionId": "pos-terminal-01-user-uid-123-1710333600000",
    "terminalId": "pos-terminal-01",
    "uid": "user-uid-123",
    "email": "user@example.com",
    "displayName": "John Barista",
    "role": "barista",
    "tenantId": "coffee-shop-123",
    "loginTime": "2024-03-13T10:30:00Z",
    "lastActivityTime": "2024-03-13T15:45:00Z",
    "active": true
  }
]
```

**Details:**
- Returns only active sessions for the authenticated user
- Useful for session management on the client side
- Can help users monitor their login activity

---

## Admin Routes (Admin Role Required)

All admin routes require:
1. Valid authentication token
2. Admin role verification

### 1. List All Users
```
GET /api/auth/admin/users
```

**Response (200):**
```json
[
  {
    "uid": "user-uid-123",
    "email": "user@example.com",
    "displayName": "John Barista",
    "role": "barista",
    "tenantId": "coffee-shop-123",
    "createdAt": "2024-03-13T10:30:00Z"
  },
  {
    "uid": "user-uid-456",
    "email": "manager@example.com",
    "displayName": "Jane Manager",
    "role": "manager",
    "tenantId": "coffee-shop-123",
    "createdAt": "2024-03-10T08:00:00Z"
  }
]
```

**Details:**
- Returns only users in the admin's tenant
- Enforces tenant isolation

---

### 2. Update User Role
```
PUT /api/auth/admin/users/:userId/role
```

**URL Parameters:**
- `userId` - The UID of the user to update

**Request Body:**
```json
{
  "role": "manager"
}
```

**Response (200):**
```json
{
  "uid": "user-uid-123",
  "email": "user@example.com",
  "displayName": "John Barista",
  "role": "manager",
  "tenantId": "coffee-shop-123"
}
```

**Valid Roles:**
- `admin` - Full system access
- `manager` - Can manage users and view reports
- `barista` - Can take orders and make drinks
- `kitchen` - Can view and fulfill orders

---

### 3. Delete User Account
```
DELETE /api/auth/admin/users/:userId
```

**URL Parameters:**
- `userId` - The UID of the user to delete

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Details:**
- Deletes user from Firebase Authentication
- Removes user profile from Firestore
- Admin cannot delete their own account
- All user sessions will be terminated

---

### 4. Set/Reset User PIN for POS
```
POST /api/auth/admin/users/:userId/pin
```

**URL Parameters:**
- `userId` - The UID of the user

**Request Body:**
```json
{
  "pin": "5678"
}
```

**Response (200):**
```json
{
  "message": "PIN set successfully",
  "uid": "user-uid-123"
}
```

**PIN Requirements:**
- Must be 4-6 digits
- Numeric characters only
- Used for POS terminal authentication
- Can be reset by admin at any time

**Error Responses:**
```json
{
  "error": "PIN must be 4-6 digits"
}
```

---

### 5. View All Active POS Sessions
```
GET /api/auth/admin/pos-sessions
```

**Response (200):**
```json
[
  {
    "sessionId": "pos-terminal-01-user-uid-123-1710333600000",
    "uid": "user-uid-123",
    "terminalId": "pos-terminal-01",
    "email": "user@example.com",
    "displayName": "John Barista",
    "role": "barista",
    "tenantId": "coffee-shop-123",
    "loginTime": "2024-03-13T10:30:00Z",
    "lastActivityTime": "2024-03-13T15:45:00Z",
    "active": true
  }
]
```

**Details:**
- Shows all active POS sessions in the admin's tenant
- Helps monitor terminal usage
- Useful for detecting stuck or abandoned sessions

---

### 6. Terminate POS Session
```
DELETE /api/auth/admin/pos-sessions/:sessionId
```

**URL Parameters:**
- `sessionId` - The session ID to terminate

**Response (200):**
```json
{
  "message": "POS session terminated successfully"
}
```

**Details:**
- Marks session as inactive
- Records termination timestamp and admin who terminated it
- User will need to login again on that terminal
- Useful for force-logging-out users if needed

---

## Database Schema

### Users Collection
```firestore
/users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── role: string (enum: admin, manager, barista, kitchen)
├── pin: string (4-6 digits for POS access)
├── tenantId: string
├── suspended: boolean
├── createdAt: timestamp
├── updatedAt: timestamp
└── [additional fields as needed]
```

### POS Sessions Collection
```firestore
/pos_sessions/{sessionId}
├── sessionId: string (unique identifier)
├── uid: string (user reference)
├── terminalId: string (POS terminal identifier)
├── email: string
├── displayName: string
├── role: string
├── tenantId: string
├── loginTime: timestamp
├── lastActivityTime: timestamp
├── logoutTime: timestamp (optional)
├── terminatedAt: timestamp (optional)
├── terminatedBy: string (admin uid who terminated, optional)
└── active: boolean
```

---

## Middleware Stack

### verifyAuth Middleware
- **Location:** `server/src/middleware/verifyAuth.js`
- **Purpose:** Validates authentication token and extracts user information
- **Adds to Request:**
  - `req.user.uid` - User's unique identifier
  - `req.user.tenantId` - User's tenant ID

### attachUserRole Middleware
- **Location:** `server/src/middleware/roleCheck.js`
- **Purpose:** Fetches user's role from Firestore
- **Adds to Request:**
  - `req.user.role` - User's role
  - `req.user.tenantId` - User's tenant ID

### roleCheck Middleware
- **Location:** `server/src/middleware/roleCheck.js`
- **Purpose:** Enforces role-based access control
- **Usage:** `roleCheck('admin')` - requires admin role
- **Role Hierarchy:**
  - `admin` > `manager` > `barista` > `kitchen`
  - Higher roles can access lower role endpoints

---

## Security Considerations

### PIN Security
- Pins are stored in Firestore and should be hashed in production
- Current implementation stores pins in plaintext (⚠️ TODO: Hash pins with bcrypt)
- PINs are 4-6 digits, providing limited entropy
- Consider implementing PIN attempt lockout after N failures

### Token Security
- Uses Firebase Custom Tokens (secure)
- Tokens should be sent only over HTTPS
- Implement token expiration and refresh mechanism
- Store tokens securely on client side (use httpOnly cookies in production)

### Tenant Isolation
- All queries filter by `tenantId` to ensure multi-tenant isolation
- Admins can only see/manage users and sessions in their tenant
- This prevents cross-tenant data leakage

### Session Management
- Each POS session has a unique identifier
- Sessions track login/logout times
- Admins can terminate sessions remotely
- Unused sessions should be cleaned up (consider implementing session timeout)

---

## Error Handling

### Common Error Responses

**400 Bad Request** - Missing or invalid required fields
```json
{
  "error": "PIN and terminalId are required"
}
```

**401 Unauthorized** - Invalid credentials or token
```json
{
  "error": "Invalid PIN"
}
```

**403 Forbidden** - Insufficient permissions
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found** - Resource doesn't exist
```json
{
  "error": "User not found"
}
```

**409 Conflict** - Resource already exists
```json
{
  "error": "Email already in use"
}
```

**500 Internal Server Error** - Server-side error
```json
{
  "error": "Login failed",
  "details": "Firebase error message"
}
```

---

## Implementation Checklist

- [x] POS Login Route with PIN authentication
- [x] POS Session management (create, read, delete)
- [x] User PIN management (set/reset by admin)
- [x] Admin session control (view all, terminate)
- [x] Tenant isolation for multi-tenant support
- [x] Role-based access control
- [x] Error handling and validation

## TODO/Future Improvements

1. **Hash PINs** - Implement bcrypt or similar for PIN hashing
2. **Session Timeout** - Auto-cleanup inactive sessions after X minutes
3. **Attempt Limiting** - Lock PIN input after N failed attempts
4. **Audit Logging** - Log all authentication events for compliance
5. **Two-Factor Authentication** - Add optional 2FA for admin accounts
6. **Session Activity Tracking** - Update `lastActivityTime` on each API call
7. **PIN Expiration** - Force PIN change after X days
8. **Device Fingerprinting** - Validate terminal identity for POS sessions

---

## Testing

### Manual Testing Examples

**Test POS Login:**
```bash
curl -X POST http://localhost:8080/api/auth/pos-login \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234", "terminalId": "pos-terminal-01"}'
```

**Test POS Logout:**
```bash
curl -X POST http://localhost:8080/api/auth/pos-logout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session-id-123"}'
```

**Test Get Active Sessions:**
```bash
curl -X GET http://localhost:8080/api/auth/pos-sessions \
  -H "Authorization: Bearer <token>"
```

**Test Admin Set PIN:**
```bash
curl -X POST http://localhost:8080/api/auth/admin/users/user-uid-123/pin \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"pin": "9999"}'
```

---

## Support and Contact

For issues or questions regarding POS authentication, contact the development team or create an issue in the project repository.

