// firebaseConfig.js
import { initializeApp } from "firebase/app";

import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './constants/config';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enable session persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence enabled");
  })
  .catch((error) => {
    console.error("Error enabling session persistence: ", error);
  });

const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, analytics, auth, db };