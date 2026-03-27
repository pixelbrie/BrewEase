import { db } from "../config/firebaseAdmin.js"

export async function validateDB() {
  try {
    console.log("\nChecking Firestore DB connection...")
    await db.collection("dothiswork_questionmark").doc("idk").get()
    console.log("Firestore connection successful!\n")
    return true
  } catch (error) {
    console.error("Firestore connection failed!")
    console.log(error.message)
    console.error("Ending program early due to DB failure.")
    process.exit(1)
  }
}