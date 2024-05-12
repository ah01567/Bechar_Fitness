import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";

const Home = () => {
    const { currentUser } = useAuth();
 
    return(
        <div>
            {!currentUser ? (<div><Login /></div>) : (            
            <div> Home page </div>
            )}
        </div>
    )
}
 
export default Home