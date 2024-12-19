import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

// Your web app's Firebase configuration with proper type annotation
const firebaseConfig: FirebaseOptions = {
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
let app: FirebaseApp;
let analytics: Analytics;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Export initialized services
export { app, analytics, auth, db, storage };