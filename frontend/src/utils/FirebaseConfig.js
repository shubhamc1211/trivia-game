import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDakw2X4NoLEdzMj3Xb4wrqKtDVVeLJzPw",
  authDomain: "serverlesscomputing-391212.firebaseapp.com",
  projectId: "serverlesscomputing-391212",
  storageBucket: "serverlesscomputing-391212.appspot.com",
  messagingSenderId: "85182323218",
  appId: "1:85182323218:web:e565bb9d8ec5fb0730d6cb",
  measurementId: "G-WE3CNJZKHX"
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }
