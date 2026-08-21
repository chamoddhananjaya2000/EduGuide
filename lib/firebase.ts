import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG18J6OuSr7ELTmBRyr7y44drunYTHy-k",
  authDomain: "eduguide-94918.firebaseapp.com",
  projectId: "eduguide-94918",
  storageBucket: "eduguide-94918.firebasestorage.app",
  messagingSenderId: "251123384909",
  appId: "1:251123384909:web:6776315854058e464e1204",
  measurementId: "G-7PPSFHLPXB"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Apply custom OAuth parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, googleProvider };
