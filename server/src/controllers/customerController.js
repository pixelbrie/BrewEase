import {
  createCustomer as createCustomerService,
  getCustomerById as getCustomerByIdService,
  lookupCustomer as lookupCustomerService,
  attachCustomerToOrder as attachCustomerToOrderService,
  updateTotalSpent as updateTotalSpentService,
  getOrderHistory as getOrderHistoryService,
  updateLoyaltyPoints as updateLoyaltyPointsService,
  updateLastVisit as updateLastVisitService,
} from "../services/customerService.js"

const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    if (!firstName) {
      return res.status(400).json({ error: "firstName is required" });
    }

    const customer = await createCustomerService({
      firstName,
      lastName,
      phone,
    });

    return res.status(201).json(customer);
  } catch (err) {
    if (err.message.includes("already exists")) {
      return res.status(409).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);

    return res.status(200).json(customer);
  } catch (err) {
    if (err.message === "Customer not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ========================
// Phone Lookup
// ========================

const lookupCustomer = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "A search query is required" });
    }

    const customer = await lookupCustomerService(query);

    if (!customer) {
      return res.status(404).json({ error: "No customer found" });
    }

    return res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ========================
// Attach Customer to Order
// ========================

const attachCustomerToOrder = async (req, res) => {
  try {
    const { orderId, customerId } = req.body;

    if (!orderId || !customerId) {
      return res.status(400).json({ error: "orderId and customerId are required" });
    }

    const result = await attachCustomerToOrderService(orderId, customerId);

    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Customer not found")   {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ========================
// Track Total Spent
// ========================

const updateTotalSpent = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "amount is required" });
    }

    await updateTotalSpentService(id, amount);

    return res.status(200).json({ message: "Total spent updated" });
  } catch (err) {
    if (err.message === "amount must be a positive number") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ========================
// order History
// ========================

const getOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await getOrderHistoryService(id);

    return res.status(200).json(orders);
  } catch (err) {
    if (err.message === "customerId is required") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ========================
// update Loyalty Points
// ========================

const updateLoyaltyPoints = async (req, res) => {
  try {

    const { id } = req.params;
    
    const { points } = req.body;

    await updateLoyaltyPointsService(id, points);

    return res.status(200).json({ message: "Loyalty points updated" });
  } catch (err) {
    if (err.message === "points must be a number") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }

}

// ========================
// Last Visit Tracking
// ========================

const updateLastVisit = async (req, res) => {
  try {
    const { id } = req.params;

    await updateLastVisitService(id);

    return res.status(200).json({ message: "Last visit updated" });
  } catch (err) {
    if (err.message === "customerId is required") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

  



export {
  createCustomer,
  getCustomerById,
  lookupCustomer,
  attachCustomerToOrder,
  updateTotalSpent,
  getOrderHistory,
  updateLoyaltyPoints,
  updateLastVisit,
}