import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
//import { ref, onValue } from 'firebase/database';

export default function useAuth() {

    const [currentUser, setCurrentUser] = useState(null);  
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    //const [isAdmin, setIsAdmin] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
            setFirebaseInitialized(true);
        });
        
    }, [])
    //return { currentUser, isAdmin, firebaseInitialized };
    return { currentUser, firebaseInitialized };
}