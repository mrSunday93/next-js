// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGwJ6ZhCC_444R6hhlm4mY5xOc_yM0jjs",
  authDomain: "onde-main.firebaseapp.com",
  projectId: "onde-main",
  storageBucket: "onde-main.firebasestorage.app",
  messagingSenderId: "1025167915640",
  appId: "1:1025167915640:web:0f059c5a19f198576e0b8d",
  measurementId: "G-1K3SLGQTC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)