import { db } from "../config/firebaseAdmin.js"
import admin from "firebase-admin"

const customerCollection = db.collection("customers")
const orderCollection = db.collection("orders")

// ========================
// Customer Profile Creation
// ========================

const createCustomer = async ({ firstName, lastName, phone }) => {
  if (!firstName) {
    throw new Error("firstName is required");
  }

  if (phone) {
    const phoneExists = await getCustomerByPhone(phone);
    if (phoneExists) {
      throw new Error("A customer with this phone number already exists");
    }
  }

  const customerData = {
    firstName,
    lastName: lastName || "",
    phone: phone || "",
    loyaltyPoints: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await customerCollection.add(customerData);

  return { customerId: docRef.id, ...customerData };
};

const getCustomerById = async (customerId) => {
  const doc = await customerCollection.doc(customerId).get();

  if (!doc.exists) {
    throw new Error("Customer not found");
  }

  return { customerId: doc.id, ...doc.data() };
};

// ========================
// Phone Lookup
// ========================


const getCustomerByPhone = async (phone) => {
  const snapshot = await customerCollection
    .where("phone", "==", phone)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { customerId: doc.id, ...doc.data() };
};

const lookupCustomer = async (query) => {

  const byPhone = await getCustomerByPhone(query);
  if (byPhone) return byPhone;

  return null;
};

// ========================
// Attach Customer to Order
// ========================

const attachCustomerToOrder = async (orderId, customerId) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  await orderCollection.doc(orderId).update({ customerId });
  await updateLastVisit(customerId);
  return { orderId, customerId };
};

// ========================
// Track Total Spent
// ======================== 

const updateTotalSpent = async (customerId, amount) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }
  if(typeof amount !== "number" || amount <= 0) {
    throw new Error("amount must be a positive number");
  }

  const customerRef = customerCollection.doc(customerId);
  await customerRef.update({
    totalSpent: admin.firestore.FieldValue.increment(amount),
  });
}

// ========================
// Order History
// ======================== 

const getOrderHistory = async (customerId) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }

  const snapshot = await orderCollection
    .where("customerId", "==", customerId)
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({ orderId: doc.id, ...doc.data() }));
};

// ========================
// Update Loyalty Points
// ======================== 

const updateLoyaltyPoints = async (customerId, points) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }
  if (typeof points !== "number") {
    throw new Error("points must be a number");
  }

  const customerRef = customerCollection.doc(customerId);
  await customerRef.update({
    loyaltyPoints: admin.firestore.FieldValue.increment(points),
  });
};

// ========================
// Last Visit Tracking
// ======================== 

const updateLastVisit = async (customerId) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }

  const customerRef = customerCollection.doc(customerId);
  await customerRef.update({
    lastVisit: admin.firestore.FieldValue.serverTimestamp(),
  });
};




export {
  createCustomer,
  getCustomerById,
  getCustomerByPhone,
  lookupCustomer,
  attachCustomerToOrder,
  updateTotalSpent,
  getOrderHistory,
  updateLoyaltyPoints,
  updateLastVisit,
}