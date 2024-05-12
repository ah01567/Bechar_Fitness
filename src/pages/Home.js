import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/login");
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log(error);
        });
      }

    return(
        <div>
            {!currentUser ? (<div><Login /></div>) : (        
            <div>    
                <div> Home page </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            )}
        </div>
    )
}
 
export default Home