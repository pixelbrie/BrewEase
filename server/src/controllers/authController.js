import { auth, db } from "../config/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";

const validRoles = ["admin", "manager", "barista", "kitchen"];

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

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      displayName,
      role,
      firstName,
      lastName,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const resolvedDisplayName =
      displayName || [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!resolvedDisplayName) {
      return res.status(400).json({
        error: "Display name is required, or provide firstName and lastName",
      });
    }

    const generatedPin = await generateUniquePin();

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: resolvedDisplayName,
    });

    const uid = userRecord.uid;

    await db.collection("users").doc(uid).set({
      uid,
      email,
      displayName: resolvedDisplayName,
      firstName: firstName || null,
      lastName: lastName || null,
      role,
      pin: generatedPin,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      uid,
      email,
      displayName: resolvedDisplayName,
      firstName: firstName || null,
      lastName: lastName || null,
      role,
      pin: generatedPin,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "Email already in use" });
    }

    return res.status(500).json({
      error: "Signup failed",
      details: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userRecord = await auth.getUserByEmail(email).catch(() => null);

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    req.session.userId = userRecord.uid;

    return res.status(200).json({
      message: "Login successful",
      uid: userRecord.uid,
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
      email: userData.email,
      displayName: userData.displayName,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
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
        email: data.email,
        displayName: data.displayName,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
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