import { db } from "../config/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";
import { accumulatePointsForOrder } from "./rewardService.js"
import { updateTotalSpent, updateLastVisit } from "./customerService.js"


const ordersCollection = db.collection("orders");
const customersCollection = db.collection("customers");
const orderCountersCollection = db.collection("order_counters");

const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

const getNextOrderNumber = async () => {
  const todayKey = getTodayKey();
  const counterRef = orderCountersCollection.doc(todayKey);

  return await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists) {
      transaction.set(counterRef, {
        date: todayKey,
        currentNumber: 1,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return 1;
    }

    const currentNumber = counterDoc.data().currentNumber || 0;
    const nextNumber = currentNumber + 1;

    if (nextNumber > 100) {
      throw new Error("Daily order limit of 100 reached");
    }

    transaction.update(counterRef, {
      currentNumber: nextNumber,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return nextNumber;
  });
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

  const orderNumber = await getNextOrderNumber();
  const orderDate = getTodayKey();

  const orderPayload = {
    orderNumber,
    orderDate,
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
  
  if (customerData) {
    await accumulatePointsForOrder(customerData.id, orderPayload.total);
    await updateTotalSpent(customerData.id, orderPayload.total);
    await updateLastVisit(customerData.id);
  }
  

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

const getOrderByOrderNumber = async (orderNumber, orderDate = null) => {
  let query = ordersCollection.where("orderNumber", "==", Number(orderNumber));

  if (orderDate) {
    query = query.where("orderDate", "==", orderDate);
  }

  const snapshot = await query.limit(1).get();

  if (snapshot.empty) {
    throw new Error("Order not found");
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};

const getAllOrdersToday = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let query = ordersCollection.where("createdAt", ">=", startOfDay);
  
  const snapshot = await query.get();
  
  if (snapshot.empty) {
    return []
  }
  
  const orders = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });
  
  return orders;
};

const updateOrderStatus = async (orderId, newStatus) => {
  try{ 
    await ordersCollection.doc(orderId).update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    return { id: orderId, status: newStatus };
  } catch (error) {
    console.error("DB Error updating status:", error);
    throw new Error("Failed to update order status");
  }
}

export {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getAllOrdersToday,
  updateOrderStatus
};