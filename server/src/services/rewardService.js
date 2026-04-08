import { db } from "../config/firebaseAdmin.js"
import admin from "firebase-admin"
import { getCustomerById, updateLoyaltyPoints } from "./customerService.js"

const rewardCollection = db.collection("rewards")

const VALID_REWARD_TYPES = ["free_item", "discount"]

const POINTS_PER_DOLLAR = 1

// ========================
// Reward Catalog CRUD
// ========================

const createReward = async ({ name, description, pointsCost, type, discountValue, active = true }) => {
  if (!name) {
    throw new Error("name is required")
  }
  if (typeof pointsCost !== "number" || pointsCost < 0) {
    throw new Error("pointsCost must be a non-negative number")
  }
  if (!VALID_REWARD_TYPES.includes(type)) {
    throw new Error(`type must be one of: ${VALID_REWARD_TYPES.join(", ")}`)
  }
  if (type === "discount" && (typeof discountValue !== "number" || discountValue <= 0)) {
    throw new Error("discountValue must be a positive number for discount rewards")
  }

  const rewardData = {
    name,
    description: description || "",
    pointsCost,
    type,
    discountValue: type === "discount" ? discountValue : null,
    active,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  const docRef = await rewardCollection.add(rewardData)

  return { rewardId: docRef.id, ...rewardData }
}

const getRewardById = async (rewardId) => {
  if (!rewardId) {
    throw new Error("rewardId is required")
  }

  const doc = await rewardCollection.doc(rewardId).get()

  if (!doc.exists) {
    throw new Error("Reward not found")
  }

  return { rewardId: doc.id, ...doc.data() }
}

const getAllRewards = async ({ activeOnly = false } = {}) => {
  let query = rewardCollection
  if (activeOnly) {
    query = query.where("active", "==", true)
  }

  const snapshot = await query.get()

  if (snapshot.empty) return []

  return snapshot.docs.map((doc) => ({ rewardId: doc.id, ...doc.data() }))
}

const updateReward = async (rewardId, updates) => {
  if (!rewardId) {
    throw new Error("rewardId is required")
  }
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("updates cannot be empty")
  }

  const allowedFields = ["name", "description", "pointsCost", "type", "discountValue", "active"]
  const sanitized = {}
  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      sanitized[key] = updates[key]
    }
  }

  if (Object.keys(sanitized).length === 0) {
    throw new Error("no valid fields to update")
  }

  if (sanitized.pointsCost !== undefined) {
    if (typeof sanitized.pointsCost !== "number" || sanitized.pointsCost < 0) {
      throw new Error("pointsCost must be a non-negative number")
    }
  }
  if (sanitized.type !== undefined && !VALID_REWARD_TYPES.includes(sanitized.type)) {
    throw new Error(`type must be one of: ${VALID_REWARD_TYPES.join(", ")}`)
  }

  const rewardRef = rewardCollection.doc(rewardId)
  const doc = await rewardRef.get()
  if (!doc.exists) {
    throw new Error("Reward not found")
  }

  
  const currentData = doc.data()
  const finalType = sanitized.type !== undefined ? sanitized.type : currentData.type
  const finalDiscountValue = sanitized.discountValue !== undefined ? sanitized.discountValue : currentData.discountValue

  if (finalType === "discount") {
    if (typeof finalDiscountValue !== "number" || finalDiscountValue <= 0) {
      throw new Error("discountValue must be a positive number for discount rewards")
    }
  } else if (finalType === "free_item") {
    
    sanitized.discountValue = null
  }
  

  await rewardRef.update(sanitized)

  const updated = await rewardRef.get()
  return { rewardId: updated.id, ...updated.data() }
}

const deleteReward = async (rewardId) => {
  if (!rewardId) {
    throw new Error("rewardId is required")
  }

  const rewardRef = rewardCollection.doc(rewardId)
  const doc = await rewardRef.get()
  if (!doc.exists) {
    throw new Error("Reward not found")
  }

  await rewardRef.update({ active: false })
  

  return { rewardId }
}

// ========================
// Points Accumulation
// ========================

const accumulatePointsForOrder = async (customerId, orderTotal) => {
  if (!customerId) {
    throw new Error("customerId is required")
  }
  if (typeof orderTotal !== "number" || orderTotal <= 0) {
    throw new Error("orderTotal must be a positive number")
  }

  // Verify the customer exists — surfaces "Customer not found" cleanly instead
  // of a raw Firestore NOT_FOUND error from the increment below.
  const customer = await getCustomerById(customerId)

  const pointsAwarded = Math.floor(orderTotal * POINTS_PER_DOLLAR)

  if (pointsAwarded <= 0) {
    // Order was under $1 — valid order, just nothing to credit yet.
    return {
      customerId,
      pointsAwarded: 0,
      newTotalPoints: customer.loyaltyPoints ?? 0,
    }
  }

  await updateLoyaltyPoints(customerId, pointsAwarded)

  // Re-fetch to return the post-increment total so the caller can display it.
  const updated = await getCustomerById(customerId)

  return {
    customerId,
    pointsAwarded,
    newTotalPoints: updated.loyaltyPoints ?? 0,
  }
}

export {
  createReward,
  getRewardById,
  getAllRewards,
  updateReward,
  deleteReward,
  accumulatePointsForOrder,
}
