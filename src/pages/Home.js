import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import SideBar from "../components/Sidebar";
import Spinner from '../components/Spinner';

const Home = () => {
    const { currentUser, firebaseInitialized } = useAuth();

    if (!firebaseInitialized) {
        return( 
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> 
                <Spinner /> 
            </div>
        )
      } 

    return(
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
                <div>
                    <div style={{ borderRight: '1px solid #ccc', paddingRight: '10px'}}>
                        <SideBar />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                        <div>Home page</div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Home