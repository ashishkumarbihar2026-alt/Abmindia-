import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDyEHLHzCNJ1BxHXmqCOKbinJqrTIBC7Gw",
  authDomain: "investapp-954d7.firebaseapp.com",
  projectId: "investapp-954d7",
  storageBucket: "investapp-954d7.firebasestorage.app",
  messagingSenderId: "530020859885",
  appId: "1:530020859885:web:5d1e0c6cd5220694d83974"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
