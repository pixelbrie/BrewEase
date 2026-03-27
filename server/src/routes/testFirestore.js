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

/* Comments on curr code: (3-12-26)
// importing the express framework + using the already initialized db object
import express from "express"
import { db } from "../config/firebaseAdmin.js"

// creates a mini-app that allows you to group related routes together and export them to server.js, app.js, etc.
const router = express.Router()

// defines an endpoint so that, when you visit url/test-firestore, this code will run
router.get("/test-firestore", async (req, res) => {
  try {
    // Creates a reference that looks at the location of a collection named test and a doc in that called connection. It's not actually looking at a file just yet, it's just the reference to this location.
    // IF you were just testing to see if the connection is fine, there's no need for an actual file here, it'll just give an error if the database isn't actually initialized yet.
    // However, if you want to also test the permissions available, then adding .set() and .get() is great to test that as well.
    const ref = db.collection("test").doc("connection")

    // Creates a 
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
*/