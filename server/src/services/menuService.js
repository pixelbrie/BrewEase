import { db } from "../config/firebaseAdmin.js";

const COLLECTION_NAME = "purchaseableItems";

export async function getAllMenu() {
  const snapshot = await db.collection(COLLECTION_NAME).get();

  return snapshot.docs.map((doc) => ({
    itemId: doc.id,
    ...doc.data(),
  }));
}

export async function getMenuById(itemId) {
  const doc = await db.collection(COLLECTION_NAME).doc(itemId).get();

  if (!doc.exists) {
    return null;
  }

  return {
    itemId: doc.id,
    ...doc.data(),
  };
}

export async function createMenuItem(item) {
  const docRef = await db.collection(COLLECTION_NAME).add(item);

  return {
    itemId: docRef.id,
    ...item,
  };
}

export async function updateMenuItem(itemId, update) {
  const docRef = db.collection(COLLECTION_NAME).doc(itemId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  await docRef.update(update);

  return {
    itemId,
    ...doc.data(),
    ...update,
  };
}

export async function deleteMenuItem(itemId) {
  const docRef = db.collection(COLLECTION_NAME).doc(itemId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  await docRef.delete();

  return {
    itemId,
    message: "Menu Item Deleted",
  };
}