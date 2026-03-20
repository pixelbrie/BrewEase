const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "path/to/serviceAccountKey.json");

const serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://brewease-2026-default-rtdb.firebaseio.com"
});

module.exports = admin;
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import serviceAccount from './secrets/serviceAccountKey.json' with { type: 'json' }

const app = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
