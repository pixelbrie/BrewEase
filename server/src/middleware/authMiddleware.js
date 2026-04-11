import { db } from "../config/firebaseAdmin.js";

export const requireAuth = async (req, res, next) => {
  try {
    const uid = req.session?.userId;

    if (!uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = userDoc.data();
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(500).json({
      error: "Authentication check failed",
      details: error.message
    });
  }
};