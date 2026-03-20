import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries


//Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDDUgs0W96-t2ZDMS60-lkxkF5herSpDbA ",
    authDomain: "brewease-2026.firebaseapp.com ",
    projectId: "brewease-2026 ",
    storageBucket: "brewease-2026.firebasestorage.app ",
    messagingSenderId: "1020243116972 ",
    appId: "1:1020243116972:web:df3b4b3c77e049ce847009 "
}

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);