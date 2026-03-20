import express from "express"
import { db } from "../config/firebaseAdmin.js"

const router = express.Router()

router.get("/test-firestore", async (req, res) => {
  try {
    const ref = db.collection("test").doc("connection")

    await ref.set({
      message: "Firestore connected",
      createdAt: new Date().toISOString(),
    })

    const snap = await ref.get()

    res.json({
      ok: true,
      data: snap.data(),
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    })
  }
})

export default router