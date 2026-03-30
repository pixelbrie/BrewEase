import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  const serviceAccountPath = path.resolve(
    __dirname,
    "./secrets/serviceAccountKey.json",
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file not found at ${serviceAccountPath}`,
    );
  }

  const stats = fs.statSync(serviceAccountPath);

  if (stats.isDirectory()) {
    throw new Error(
      `Expected a JSON file at ${serviceAccountPath}, but found a directory. Replace it with your Firebase service account JSON file.`,
    );
  }

  return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

const serviceAccount = loadServiceAccount();

const firebaseAdminApp = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(firebaseAdminApp);
const auth = getAuth(firebaseAdminApp);

export { firebaseAdminApp, db, auth };
