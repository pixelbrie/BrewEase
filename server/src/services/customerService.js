import { db } from "../config/firebaseAdmin.js"
import admin from "firebase-admin"

const customerCollection = db.collection("customers")
const orderCollection = db.collection("orders")

// ========================
// Customer Profile Creation
// ========================

const createCustomer = async ({ firstName, lastName, email, phone }) => {
  if (!firstName) {
    throw new Error("firstName is required");
  }

  if (email) {
    const emailExists = await getCustomerByEmail(email);
    if (emailExists) {
      throw new Error("A customer with this email already exists");
    }
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
    email: email || "",
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
// Phone / Email Lookup
// ========================

const getCustomerByEmail = async (email) => {
  const snapshot = await customerCollection
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { customerId: doc.id, ...doc.data() };
};

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
  const byEmail = await getCustomerByEmail(query);
  if (byEmail) return byEmail;

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

  return { orderId, customerId };
};

export {
  createCustomer,
  getCustomerById,
  getCustomerByEmail,
  getCustomerByPhone,
  lookupCustomer,
  attachCustomerToOrder,
}