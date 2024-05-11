import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
//import { ref, onValue } from 'firebase/database';

export default function useAuth() {

    const [currentUser, setCurrentUser] = useState(null);  
    const [isAdmin, setIsAdmin] = useState(false);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });
        
    }, [])
    return { currentUser, isAdmin, firebaseInitialized };
}