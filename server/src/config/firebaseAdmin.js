import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://brewease-2026-default-rtdb.firebaseio.com',
})

const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }