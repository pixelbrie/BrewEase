import { db } from "../config/firebaseAdmin.js";
import { buildEmployeeUsername } from "../utils/generateEmployeeUsername.js";

async function usernameExists(username) {
  const snapshot = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get();

  return !snapshot.empty;
}

export async function generateUniqueEmployeeUsername(firstName, lastName, dateOfBirth) {
  let attempts = 0;

  while (attempts < 10) {
    const username = buildEmployeeUsername(firstName, lastName, dateOfBirth);
    const exists = await usernameExists(username);

    if (!exists) {
      return username;
    }

    attempts += 1;
  }

  throw new Error("Failed to generate a unique username");
}