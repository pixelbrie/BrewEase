import express from "express"
import {
  createCustomer,
  getCustomerById,
  lookupCustomer,
  attachCustomerToOrder,
} from "../controllers/customerController.js"

const router = express.Router()

router.post("/", createCustomer)
router.get("/lookup", lookupCustomer)
router.get("/:id", getCustomerById)
router.post("/attach-order", attachCustomerToOrder)

export default router
