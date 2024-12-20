import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAh0cC62A-tEWn1VDIZdFn4hsKb1HVU-Q",
  authDomain: "sky-investments-hrms.firebaseapp.com",
  databaseURL: "https://sky-investments-hrms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sky-investments-hrms",
  storageBucket: "sky-investments-hrms.firebasestorage.app",
  messagingSenderId: "578279043991",
  appId: "1:578279043991:web:0e0b7d4b0c2d98b9f78ad2",
  measurementId: "G-SFW495KXL9"
};

// Initialize Firebase with type safety
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

console.log("Firebase initialized successfully");

// Export initialized services
export { app, analytics, auth, db, storage };