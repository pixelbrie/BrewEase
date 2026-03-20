import { db } from "./firebaseAdmin.js"

export async function validateDB() {
  try {
    console.log("Checking Cloud Firestore DB connection...")
    await db.collection("dothiswork_questionmark").doc("idk").get()
    console.log("Firestore connection successful!")
    return true
  } catch (error) {
    console.error("Firestore connection failed!")
    console.log(error.message)
    console.error("Ending program early due to DB failure.")
    process.exit(1)
  }
}