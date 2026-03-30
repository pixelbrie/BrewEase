import express from "express";
import {
  signup,
  login,
  pinLogin,
  logout,
  getCurrentUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/pin-login", pinLogin);
router.post("/logout", requireAuth, logout);
router.get("/get-user", requireAuth, getCurrentUser);
router.get("/admin/users", requireAuth, getAllUsers);
router.put("/admin/users/:userId/role", requireAuth, updateUserRole);
router.delete("/admin/users/:userId", requireAuth, deleteUser);

export default router;