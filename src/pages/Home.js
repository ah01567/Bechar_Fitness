import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SideBar from "../components/Sidebar";

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return(
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
                <div style={{display: 'flex', height: '100vh'  }}>
                    <div style={{ borderRight: '1px solid #ccc', paddingRight: '10px', height: '100%'  }}>
                        <SideBar />
                    </div>
                    <div style={{ padding: '20px' }}>
                        <div>Home page</div>
                    </div>
                </div>
            )}
        </div>
    )
}
 
export default Home