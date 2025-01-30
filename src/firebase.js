import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";  // Import for Cloud Storage
import { getAnalytics } from "firebase/analytics";  // Import for Analytics (if used)

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXfDDWug4MFlTKQNHiRSqQ-8uPgaI2c4w",
  authDomain: "tap-education.firebaseapp.com",
  projectId: "tap-education",
  storageBucket: "tap-education.firebasestorage.app",
  messagingSenderId: "974393163915",
  appId: "1:974393163915:web:1535471b36f5cb99df548e",
  measurementId: "G-0Z34XE1X9P"
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
