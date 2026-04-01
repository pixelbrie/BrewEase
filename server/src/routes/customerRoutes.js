import express from "express"
import {
  createCustomer,
  getCustomerById,
  lookupCustomer,
  attachCustomerToOrder,
  updateTotalSpent,
  getOrderHistory,
  updateLoyaltyPoints,
  updateLastVisit,
} from "../controllers/customerController.js"

const router = express.Router()

router.post("/", createCustomer)
router.get("/lookup", lookupCustomer)
router.get("/:id", getCustomerById)
router.post("/attach-order", attachCustomerToOrder)
router.patch("/:id/update-total-spent", updateTotalSpent)
router.get("/:id/order-history", getOrderHistory)
router.patch("/:id/update-loyalty-points", updateLoyaltyPoints)
router.patch("/:id/update-last-visit", updateLastVisit)

export default router
