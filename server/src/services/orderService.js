import { db } from "../config/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";

const ordersCollection = db.collection("orders");
const customersCollection = db.collection("customers");

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `ORD-${timestamp}${random}`;
};

const createOrder = async ({
  items,
  customerId,
  customerName,
  orderType,
  notes,
  subtotal,
  tax,
  total,
  status,
}) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("At least one item is required");
  }

  let customerData = null;

  if (customerId) {
    const customerDoc = await customersCollection.doc(customerId).get();

    if (!customerDoc.exists) {
      throw new Error("Customer not found");
    }

    customerData = {
      id: customerDoc.id,
      ...customerDoc.data(),
    };
  }

  if (!customerId && !customerName) {
    throw new Error("customerName is required for guest orders");
  }

  const orderNumber = generateOrderNumber();

  const orderPayload = {
    orderNumber,
    items,
    customerId: customerData ? customerData.id : null,
    customerName: customerData
      ? `${customerData.firstName || ""} ${customerData.lastName || ""}`.trim()
      : customerName,
    customerPhone: customerData?.phone || null,
    rewards: customerData?.rewards || 0,
    isGuest: !customerData,
    orderType: orderType || "in-store",
    notes: notes || "",
    subtotal: subtotal ?? 0,
    tax: tax ?? 0,
    total: total ?? 0,
    status: status || "open",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const docRef = await ordersCollection.add(orderPayload);

  return {
    id: docRef.id,
    ...orderPayload,
  };
};

const getOrderById = async (id) => {
  const doc = await ordersCollection.doc(id).get();

  if (!doc.exists) {
    throw new Error("Order not found");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

const getOrderByOrderNumber = async (orderNumber) => {
  const snapshot = await ordersCollection
    .where("orderNumber", "==", orderNumber)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new Error("Order not found");
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};

export {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
};