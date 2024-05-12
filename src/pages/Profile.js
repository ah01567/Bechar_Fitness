import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";

const Profile = () => {
    const { currentUser } = useAuth();
 
    return(
        <div>
            {!currentUser ? (<div><Login /></div>) : (            
            <div> Profile page page </div>
            )}
        </div>
    )
}
 
export default Profile