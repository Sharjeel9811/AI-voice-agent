// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_AUTH_KEY,
  authDomain: "ai-voice-agent-8d1b3.firebaseapp.com",
  projectId: "ai-voice-agent-8d1b3",
  storageBucket: "ai-voice-agent-8d1b3.firebasestorage.app",
  messagingSenderId: "737556613255",
  appId: "1:737556613255:web:a3be20d4d90763ed109022",
  measurementId: "G-WGZXK4M1TH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }