import express from "express";
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getAllOrdersToday
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/number/:orderNumber", getOrderByOrderNumber);
router.get("/view", requireAuth, getAllOrdersToday);
router.get("/:id", getOrderById);

export default router;