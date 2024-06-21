import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase } from 'firebase/database';
import Login from './Login';
import useAuth from "./currentUser";
import Spinner from '../components/Spinner';
import SideBar from '../components/Sidebar';
import Tabs from '../components/Tabs';

const Admin = () => {
    
    const { currentUser, firebaseInitialized } = useAuth();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
    const pendingRef = ref(getDatabase(), 'Pending');
    onValue(pendingRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const pendingList = Object.keys(data).map((key) => ({
                uid: key,
                ...data[key]
            }));
            setPendingUsers(pendingList);
        } else {
            setPendingUsers([]);
        }
    });

    const expiredRef = ref(getDatabase(), 'Users');
    onValue(expiredRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const expiredList = Object.keys(data).map((key) => ({
                uid: key,
                ...data[key]
            }));
            setUsers(expiredList);
        } else {
            setUsers([]);
        }
        });
}, []);

    if (!firebaseInitialized) {
        return( 
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> 
                <Spinner /> 
            </div>
        )
    } 

    return (
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
            <div>
                <div style={{ borderRight: '1px solid #ccc', paddingRight: '10px'}}>
                    <SideBar />
                </div>

                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tabs />
                </div>
                
            </div>
            )}
        </div>
    );
};

export default Admin;
