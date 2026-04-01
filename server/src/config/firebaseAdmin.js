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
