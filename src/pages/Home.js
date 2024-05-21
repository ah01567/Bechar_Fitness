import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import SideBar from "../components/Sidebar";

const Home = () => {
    const { currentUser } = useAuth();

    return(
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
                <div>
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