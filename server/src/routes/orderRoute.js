import express from "express";
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/number/:orderNumber", getOrderByOrderNumber);
router.get("/:id", getOrderById);

export default router;