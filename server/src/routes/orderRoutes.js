import express from "express";
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getAllOrders
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/number/:orderNumber", getOrderByOrderNumber);
router.get("/:id", getOrderById);
router.get("/view", requireAuth, getAllOrders);

export default router;