import express from "express";
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/number/:orderNumber", getOrderByOrderNumber);

export default router;