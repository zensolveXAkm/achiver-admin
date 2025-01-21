import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";  // Import for Cloud Storage
import { getAnalytics } from "firebase/analytics";  // Import for Analytics (if used)

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ390k6Ra1HWpLEONVQouNOkd7KfLK648",
  authDomain: "uday-online-classes.firebaseapp.com",
  projectId: "uday-online-classes",
  storageBucket: "uday-online-classes.appspot.com",
  messagingSenderId: "697730371746",
  appId: "1:697730371746:web:c96c427384eb58f0ec47fb",
  measurementId: "G-R74WDJ1QCS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore database
const auth = getAuth(app);  // Firebase authentication
const storage = getStorage(app);  // Firebase cloud storage
const analytics = getAnalytics(app);  // Optional: Analytics

// Named exports for easier imports
export { db, auth, storage, analytics };

// Default export for the app instance if needed elsewhere
export default app;
