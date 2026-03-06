const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "path/to/serviceAccountKey.json");

const serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://brewease-2026-default-rtdb.firebaseio.com"
});

module.exports = admin;
