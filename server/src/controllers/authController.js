import { auth, db } from "../config/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";
import bcrypt from "bcrypt";

const validRoles = ["admin", "manager", "barista", "kitchen"];
const BCRYPT_ROUNDS = 10; // Salt rounds for bcrypt

function generateFourDigitPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function generateUniquePin() {
  let isUnique = false;
  let pin = "";

  while (!isUnique) {
    pin = generateFourDigitPin();

    const snapshot = await db
      .collection("users")
      .where("pin", "==", pin)
      .limit(1)
      .get();

    if (snapshot.empty) {
      isUnique = true;
    }
  }

  return pin;
}

/**
 * Generate unique ID from firstName, lastName, and dateOfBirth
 * Format: first letter of firstName + first 4 letters of lastName + 3 random digits from DOB
 * Example: "jonah smith" + "1994-11-23" => "jsmit913"
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} dateOfBirth - User's date of birth (YYYY-MM-DD)
 * @returns {Promise<string>} - Unique user ID
 */
async function generateUniqueUserId(firstName, lastName, dateOfBirth) {
  const firstChar = firstName.toLowerCase().replace(/\s+/g, "").charAt(0);
  const lastFour = lastName.toLowerCase().replace(/\s+/g, "").substring(0, 4);
  const dobDigits = dateOfBirth.replace(/-/g, ""); // e.g. "19941123"

  // Pick 3 random digits from the DOB string
  function pickRandomDigits(digits, count) {
    let picked = "";
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * digits.length);
      picked += digits[idx];
    }
    return picked;
  }

  let isUnique = false;
  let userId = "";

  while (!isUnique) {
    const threeDigits = pickRandomDigits(dobDigits, 3);
    userId = `${firstChar}${lastFour}${threeDigits}`;

    const snapshot = await db
      .collection("users")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      isUnique = true;
    }
  }

  return userId;
}

/**
 * Hash password using bcrypt with salt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches hash
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const {
      password,
      displayName,
      role,
      firstName,
      lastName,
      dateOfBirth,
    } = req.body;

    // Validate required fields
    if (!password || !role || !firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({
        error: "Missing required fields. Required: password, role, firstName, lastName, dateOfBirth",
      });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Validate dateOfBirth format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return res.status(400).json({
        error: "Invalid dateOfBirth format. Use YYYY-MM-DD",
      });
    }

    const resolvedDisplayName =
      displayName || [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!resolvedDisplayName) {
      return res.status(400).json({
        error: "Display name is required, or provide firstName and lastName",
      });
    }

    // Check displayName uniqueness
    const displayNameSnapshot = await db
      .collection("users")
      .where("displayName", "==", resolvedDisplayName)
      .limit(1)
      .get();

    if (!displayNameSnapshot.empty) {
      return res.status(409).json({
        error: "Display name is already taken. Please choose a different one.",
      });
    }

    // Generate unique user ID from firstName, lastName, and dateOfBirth
    const generatedUserId = await generateUniqueUserId(
      firstName,
      lastName,
      dateOfBirth,
    );

    // Generate unique PIN
    const generatedPin = await generateUniquePin();

    // Hash password with bcrypt (salt only, no pepper)
    const hashedPassword = await hashPassword(password);

    // Create Firebase Auth user (no email)
    const userRecord = await auth.createUser({
      displayName: resolvedDisplayName,
    });
    const uid = userRecord.uid;

    // Store user document in Firestore with generated userId
    await db.collection("users").doc(uid).set({
      uid,
      userId: generatedUserId,
      passwordHash: hashedPassword,
      displayName: resolvedDisplayName,
      firstName,
      lastName,
      dateOfBirth,
      role,
      pin: generatedPin,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      uid,
      userId: generatedUserId,
      displayName: resolvedDisplayName,
      firstName,
      lastName,
      dateOfBirth,
      role,
      pin: generatedPin,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error.message);


    return res.status(500).json({
      error: "Signup failed",
      details: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ error: "userId and password are required" });
    }

    // Look up user by generated userId
    const snapshot = await db
      .collection("users")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify password against stored hash
    const passwordMatch = await verifyPassword(password, userData.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.userId = userData.uid;

    return res.status(200).json({
      message: "Login successful",
      uid: userData.uid,
      userId: userData.userId,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

// POST /api/auth/pin-login
export const pinLogin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: "PIN is required" });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN must be exactly 4 digits" });
    }

    const snapshot = await db
      .collection("users")
      .where("pin", "==", pin)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid PIN" });
    }

    const matchedUser = snapshot.docs[0].data();

    if (!["admin", "manager", "barista", "kitchen"].includes(matchedUser.role)) {
      return res.status(403).json({ error: "Role not allowed for POS access" });
    }

    req.session.userId = matchedUser.uid;

    return res.status(200).json({
      uid: matchedUser.uid,
      displayName: matchedUser.displayName,
      role: matchedUser.role,
      pin: matchedUser.pin,
      message: "PIN login successful",
    });
  } catch (error) {
    console.error("PIN login error:", error.message);

    return res.status(500).json({
      error: "PIN login failed",
      details: error.message,
    });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          error: "Logout failed",
          details: err.message,
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      error: "Logout failed",
      details: error.message,
    });
  }
};

// GET /api/auth/get-user
export const getCurrentUser = async (req, res) => {
  try {
    const uid = req.session?.userId;

    if (!uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid: userData.uid,
      userId: userData.userId,
      displayName: userData.displayName,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      dateOfBirth: userData.dateOfBirth ?? null,
      role: userData.role,
      pin: userData.pin,
      createdAt: userData.createdAt ?? null,
      updatedAt: userData.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      error: "Failed to fetch user profile",
      details: error.message,
    });
  }
};

// GET /api/auth/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const adminUid = req.session?.userId;

    if (!adminUid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const adminDoc = await db.collection("users").doc(adminUid).get();

    if (!adminDoc.exists) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const adminData = adminDoc.data();

    if (adminData.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const usersSnapshot = await db.collection("users").get();

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        uid: data.uid,
        userId: data.userId,
        displayName: data.displayName,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        dateOfBirth: data.dateOfBirth ?? null,
        role: data.role,
        pin: data.pin,
      };
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
};

// PUT /api/auth/admin/users/:userId/role
export const updateUserRole = async (req, res) => {
  try {
    const adminUid = req.session?.userId;
    const { userId } = req.params;
    const { role } = req.body;

    if (!adminUid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const adminDoc = await db.collection("users").doc(adminUid).get();

    if (!adminDoc.exists || adminDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await db.collection("users").doc(userId).update({
      role,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Role updated successfully",
      uid: userId,
      role,
    });
  } catch (error) {
    console.error("Update user role error:", error.message);

    return res.status(500).json({
      error: "Failed to update role",
      details: error.message,
    });
  }
};

// DELETE /api/auth/admin/users/:userId
export const deleteUser = async (req, res) => {
  try {
    const adminUid = req.session?.userId;
    const { userId } = req.params;

    if (!adminUid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const adminDoc = await db.collection("users").doc(adminUid).get();

    if (!adminDoc.exists || adminDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    if (adminUid === userId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await auth.deleteUser(userId);
    await db.collection("users").doc(userId).delete();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);

    return res.status(500).json({
      error: "Failed to delete user",
      details: error.message,
    });
  }
};