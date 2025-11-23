// Import SDKs
import { initializeApp } from "firebase/app"
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCGwJ6ZhCC_444R6hhlm4mY5xOc_yM0jjs",
  authDomain: "onde-main.firebaseapp.com",
  projectId: "onde-main",
  storageBucket: "onde-main.firebasestorage.app",
  messagingSenderId: "1025167915640",
  appId: "1:1025167915640:web:0f059c5a19f198576e0b8d",
  measurementId: "G-1K3SLGQTC3",
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

setPersistence(auth, browserLocalPersistence)

const db = getFirestore(app)

export { auth, db }
