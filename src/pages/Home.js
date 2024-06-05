import React from 'react';
import Login from './Login';
import useAuth from "./currentUser";
import SideBar from "../components/Sidebar";
import Spinner from '../components/Spinner';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { QRCodeCanvas } from 'qrcode.react';

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
                    <h1>Welcome to Bechar Fitness!</h1>
                    <Card style={{ marginTop: '50px', width: '300px' }}>
                    <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <QRCodeCanvas value={currentUser.uid} size={200} />
                        </div>
                    </CardContent>
                    </Card>
                    <h2>Scan the above QR code</h2>
              </div>
                </div>
            )}
        </div>
    )
}
export default Home