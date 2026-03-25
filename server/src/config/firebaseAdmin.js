import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./secrets/serviceAccountKey.json" with { type: "json" };

const firebaseAdminApp = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(firebaseAdminApp);
const auth = getAuth(firebaseAdminApp);

export { firebaseAdminApp, db, auth };