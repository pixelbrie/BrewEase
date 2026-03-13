# POS Authentication Quick Reference

## Quick Setup

### 1. Create a User with PIN
```bash
# First, create a user via signup (standard auth)
POST /api/auth/signup
{
  "email": "barista@example.com",
  "password": "securePassword",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123"
}

# Then, admin sets their PIN
POST /api/auth/admin/users/{userId}/pin
Authorization: Bearer <admin-token>
{
  "pin": "1234"
}
```

### 2. Login with PIN on POS Terminal
```bash
POST /api/auth/pos-login
{
  "pin": "1234",
  "terminalId": "pos-terminal-01"
}

# Response includes sessionId needed for logout
```

### 3. Logout from POS Terminal
```bash
POST /api/auth/pos-logout
Authorization: Bearer <token-from-login>
{
  "sessionId": "session-id-from-login"
}
```

---

## API Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/signup` | None | Create new user |
| POST | `/login` | None | Login with email/password |
| POST | `/pos-login` | None | Login with PIN (POS) |
| POST | `/logout` | Token | Logout user |
| GET | `/me` | Token | Get user profile |
| POST | `/refresh-token` | Token | Refresh auth token |
| POST | `/pos-logout` | Token | Logout from POS session |
| GET | `/pos-sessions` | Token | View own POS sessions |
| GET | `/admin/users` | Token + Admin | List all users |
| PUT | `/admin/users/{id}/role` | Token + Admin | Update user role |
| DELETE | `/admin/users/{id}` | Token + Admin | Delete user |
| POST | `/admin/users/{id}/pin` | Token + Admin | Set/reset PIN |
| GET | `/admin/pos-sessions` | Token + Admin | View all POS sessions |
| DELETE | `/admin/pos-sessions/{id}` | Token + Admin | Terminate session |

---

## PIN-Based Authentication Flow

```
┌─────────────┐
│ POS Terminal│
└──────┬──────┘
       │
       │ POST /pos-login
       │ { pin: "1234", terminalId: "pos-01" }
       ↓
┌──────────────────┐
│ Backend Server   │
├──────────────────┤
│ 1. Find user by PIN
│ 2. Check if active
│ 3. Create session
│ 4. Generate token
└────────┬─────────┘
         │
         │ Response
         │ { token, sessionId, userInfo }
         ↓
┌─────────────┐
│ POS Terminal│ ← Store token + sessionId
└──────┬──────┘
       │
       │ Use token for subsequent requests
       │
       │ POST /pos-logout
       │ { sessionId }
       ↓
┌──────────────────┐
│ Backend Server   │
├──────────────────┤
│ Mark session inactive
└──────────────────┘
```

---

## Response Examples

### Successful POS Login
```json
{
  "uid": "user-123",
  "email": "barista@example.com",
  "displayName": "John Barista",
  "role": "barista",
  "tenantId": "coffee-shop-123",
  "token": "eyJhbGc...",
  "sessionId": "pos-terminal-01-user-123-1710333600000"
}
```

### Error: Invalid PIN
```json
{
  "error": "Invalid PIN"
}
```

### Error: Invalid PIN Format
```json
{
  "error": "PIN must be 4-6 digits"
}
```

---

## Key Features

✅ **PIN-Based Authentication** - Simple 4-6 digit codes for POS terminals  
✅ **Session Tracking** - Track all active POS sessions  
✅ **Multi-Terminal Support** - Multiple terminals per user  
✅ **Admin Controls** - Manage users and sessions remotely  
✅ **Tenant Isolation** - Multi-tenant support built-in  
✅ **Role-Based Access** - Control permissions by role  
✅ **Token-Based** - Secure JWT-based authentication  

---

## Common Scenarios

### Scenario 1: Barista Clock In
```
1. Barista enters PIN on POS terminal
2. POST /pos-login with PIN and terminalId
3. Backend validates PIN, creates session
4. Terminal receives token and sessionId
5. Terminal can now make authenticated API calls
6. Admin can see this session in /admin/pos-sessions
```

### Scenario 2: Admin Resets Employee PIN
```
1. Admin goes to staff management page
2. Admin clicks "Reset PIN" for employee
3. POST /admin/users/{userId}/pin with new PIN
4. Employee can now login with new PIN
5. Old PIN becomes invalid
```

### Scenario 3: Admin Terminates Lost Session
```
1. Terminal loses connection or is unresponsive
2. Admin sees session in /admin/pos-sessions
3. Admin clicks "Terminate Session"
4. DELETE /admin/pos-sessions/{sessionId}
5. Session is marked inactive
6. Employee must login again
```

### Scenario 4: Barista Clocks Out
```
1. Barista clicks logout on POS terminal
2. POST /pos-logout with sessionId
3. Backend marks session as inactive
4. Token becomes unusable (optional: implement expiry)
5. Barista must login again to use terminal
```

---

## Database Queries (Firestore)

### Get all active POS sessions for a terminal
```javascript
db.collection('pos_sessions')
  .where('terminalId', '==', 'pos-terminal-01')
  .where('active', '==', true)
  .get()
```

### Get all sessions for a user
```javascript
db.collection('pos_sessions')
  .where('uid', '==', 'user-uid-123')
  .get()
```

### Find user by PIN (for login)
```javascript
db.collection('users')
  .where('pin', '==', '1234')
  .get()
```

### Get all users in a tenant
```javascript
db.collection('users')
  .where('tenantId', '==', 'coffee-shop-123')
  .get()
```

---

## Environment Variables

No special environment variables needed. The system uses existing Firebase configuration.

---

## Files Modified/Created

- ✅ `server/src/routes/authRoutes.js` - All auth routes (public, protected, admin)
- ✅ `server/src/controllers/authController.js` - All auth controller functions
- 📄 `POS_AUTH_DOCUMENTATION.md` - Complete documentation (this file)
- 📄 `POS_AUTH_QUICK_REFERENCE.md` - Quick reference guide (you're reading it)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid PIN" error | Verify PIN is 4-6 digits and matches what's in database |
| "Session not found" error | Ensure sessionId is correct and session is still active |
| "Insufficient permissions" | Verify user has admin role for admin endpoints |
| "User not authenticated" | Include valid Bearer token in Authorization header |
| "Tenant ID not found" | Ensure user has tenantId in their profile |

---

## Next Steps

1. ✅ Implement routes in `authRoutes.js`
2. ✅ Implement controllers in `authController.js`
3. ⏳ Hook up routes to main app (see below)
4. ⏳ Test with frontend POS application
5. ⏳ Add PIN hashing for production
6. ⏳ Implement session timeout cleanup

### Hook up routes to main app

In `server/src/app.js`, add:
```javascript
import authRoutes from './routes/authRoutes.js';

// ... other middleware ...

app.use('/api/auth', authRoutes);
```

---

## Performance Tips

- **Index Firestore queries** on `(pin)`, `(tenantId, active)`, `(uid, active)`
- **Cache user roles** to reduce Firestore reads
- **Use session timeout** to auto-cleanup stale sessions
- **Archive old sessions** to keep collection lean

---

## Support

For issues or questions, check the full documentation in `POS_AUTH_DOCUMENTATION.md`

