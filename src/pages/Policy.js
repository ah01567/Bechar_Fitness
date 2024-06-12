import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import SideBar from "../components/Sidebar";
import Spinner from '../components/Spinner';
import workInProgress from '../imgs/work-in-progress.png'; 

const Policy = () => {
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
                        <img src={workInProgress} alt="Policy" style={{ marginTop: '10px', maxWidth: '40%', height: 'auto' }} />
                    </div>
                </div>
            )}
        </div>
    )
}
export default Policy