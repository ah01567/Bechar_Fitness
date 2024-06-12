// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// import Firebase Database 
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXB9UVd6fPoSR-7VJrWA8TVdNma_PW1AY",
  authDomain: "fitness-bechar-bc5ca.firebaseapp.com",
  databaseURL: "https://fitness-bechar-bc5ca-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "fitness-bechar-bc5ca",
  storageBucket: "fitness-bechar-bc5ca.appspot.com",
  messagingSenderId: "477953990408",
  appId: "1:477953990408:web:d998d25c17d3c11a41d6bd",
  measurementId: "G-CBV9F7JFZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Export the Firebase Realtime Database object
export const db = getDatabase();

export default app;
