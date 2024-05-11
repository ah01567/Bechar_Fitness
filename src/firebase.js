// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0cF7uMoQLMtPrMhQy-koaJwtAvsZyLz4",
  authDomain: "fitness-bechar.firebaseapp.com",
  projectId: "fitness-bechar",
  storageBucket: "fitness-bechar.appspot.com",
  messagingSenderId: "72358334389",
  appId: "1:72358334389:web:486942cd05ef4ec90993fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
