import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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

// Initialize Firebase services with proper type annotations
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized services
export { app, analytics, auth, db, storage };