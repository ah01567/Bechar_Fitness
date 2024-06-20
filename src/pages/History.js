import React, { useState, useEffect } from 'react';
import useAuth from "./currentUser";
import { getDatabase, onValue, ref } from 'firebase/database';
import Login from './Login';
import SideBar from "../components/Sidebar";
import Spinner from '../components/Spinner';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const History = () => {
    const { currentUser, firebaseInitialized } = useAuth();
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const historyRef = ref(getDatabase(), `History/${currentUser.uid}`);
            onValue(historyRef, (snapshot) => {
                const data = snapshot.val();
                setHistory(data || {});
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (!firebaseInitialized || loading) {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
                <div>
                    <div style={{ borderRight: '1px solid #ccc', paddingRight: '10px', height: '100%'  }}>
                        <SideBar />
                    </div>  
                    <div style={{ flex: 1, display: 'block', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                        <h1>Users History:</h1>
                        {Object.keys(history).length === 0 ? (
                            <Typography>No history found!</Typography>
                        ) : (
                            Object.keys(history).map((startDate, index) => (
                                <Accordion key={startDate}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}-content`}
                                        id={`panel${index}-header`}
                                    >
                                        <Typography><b>Membership {index + 1}</b></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div><b>Membership Type:</b> {history[startDate].membershipType}</div>
                                        <div><b>Start date:</b> {startDate}</div>
                                        <div><b>Expiry date:</b> {history[startDate].expiryDate}</div>
                                        <div><b>Paid:</b> {history[startDate].totalPaid}</div>
                                        <div><b>Debts:</b> {history[startDate].debts}</div>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;