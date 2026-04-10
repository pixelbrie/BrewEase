import {
  createOrder as createOrderService,
  getOrderById as getOrderByIdService,
  getOrderByOrderNumber as getOrderByOrderNumberService,
} from "../services/orderService.js";

const createOrder = async (req, res) => {
  try {
    const {
      items,
      customerId,
      customerName,
      orderType,
      notes,
      subtotal,
      tax,
      total,
      status,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    if (!customerId && !customerName) {
      return res
        .status(400)
        .json({ error: "customerName is required for guest orders" });
    }

    const order = await createOrderService({
      items,
      customerId,
      customerName,
      orderType,
      notes,
      subtotal,
      tax,
      total,
      status,
    });

    return res.status(201).json(order);
  } catch (err) {
    if (err.message === "Customer not found") {
      return res.status(404).json({ error: err.message });
    }

    if (
      err.message === "At least one item is required" ||
      err.message === "customerName is required for guest orders" ||
      err.message === "Daily order limit of 100 reached"
    ) {
      return res.status(400).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);

    return res.status(200).json(order);
  } catch (err) {
    if (err.message === "Order not found") {
      return res.status(404).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getOrderByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { orderDate } = req.query;

    const order = await getOrderByOrderNumberService(orderNumber, orderDate);

    return res.status(200).json(order);
  } catch (err) {
    if (err.message === "Order not found") {
      return res.status(404).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
};