// This file INITIALIZES the DB/Auth, but it doesn't actually create the connection just yet. That happens upon the first time we try making a request over to Firebase. That's why, in config, we're also gonna use validateDB.js to double-check that we're solid to continue the program.
import { initializeApp, cert } from ('firebase-admin/app');
import { getFirestore } from ('firebase-admin/firestore');
import { createRequire } from 'module';

const require = createRequire(import.meta.url); // Needed to import a JSON file in ESM.
const serviceAccount = require(process.env.FIREBASE_KEY_PATH);
/* 
Normally this is the quickest way to do this:

import serviceAccount from './path/to/key.json' with { type: 'json' };

But this would require that we know the string leading to the JSON. And it must be a static string, not a variable holding the string itself.
*/

const app = initializeApp({
  credential: cert(serviceAccount)
})

export const db = getFirestore(app);
// export const auth = getAuth(app);

/*
// const { initializeApp, cert } = require('firebase-admin/app'); | Don't do what I did, this is how you would regularly import stuff in normal CommonJS, but specifically when using ESM (which you can tell by looking at package.json and seeing type: "module"), you import it as above in the actual code.

    // Imports the core initialization and cert functions from the Firebase app module.
    const { initializeApp, cert } = require('firebase-admin/app'); 
    // Imports the database connection function from the Firebase Firestore module
    const { getFireStore } = require('firebase-admin/firestore');
    // We only have to do dotenv.config once in server.js, since that grabs everything from .env and puts it in an object called process.env. All files thereforward can call process.env and get the same results.
const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

    // Initializing the app thru the serviceAccountKey
    // When this function runs, it doesn't connect to the internet. Instead, it just locally holds it in the Node.js server. This is kinda like a lil container, which holds all the settings, credentials, and internal state needed for Firebase to work. It also reads the project_id thru the credentials passed and ties it to this app instance.
const app = initializeApp({
        // cert(): Kinda like a translator & security guard. It parses the JSOn and extracts the client email that speciies your specific server, and a private key which is just a giant cryptic password.
        // It'll create an object called a Credential Provider. This generates JSON Web Tokens (JWTs). Whenever the backend wants to talk to Google servers, like adding something to the db, this provider will make a temp signed token that uses the private key. This is kinda like an approval stamp for every request you make to show it's legit.
    credential: cert(serviceAccount)
})

    // Now that app is a fully loaded container, we can call it later with stuff like getFirestore(app), or in the future with getAuth(app), which looks at the services inside of the app container to figure out where to send data and how to prove their requests.
const db = getFirestore(app);

    // This'll export the services so we can import them from any backend file. It only ever needs to get connected once upon initialization of the project tho, so don't worry about reconnecting if you call it again.
module.exports = { db };
*/