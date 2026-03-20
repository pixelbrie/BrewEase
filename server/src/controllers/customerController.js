import {
  createCustomer as createCustomerService,
  getCustomerById as getCustomerByIdService,
  lookupCustomer as lookupCustomerService,
  attachCustomerToOrder as attachCustomerToOrderService,
} from "../services/customerService.js"

const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName) {
      return res.status(400).json({ error: "firstName is required" });
    }

    const customer = await createCustomerService({
      firstName,
      lastName,
      email,
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
// Phone / Email Lookup
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
    if (err.message === "Customer not found") {
      return res.status(404).json({ error: err.message });
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
}