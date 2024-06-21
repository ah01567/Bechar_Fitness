import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid, TextField, MenuItem, ThemeProvider, Typography, createTheme } from '@mui/material';
import { ref, onValue, getDatabase, set, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import useAuth from "../pages/currentUser";
import Spinner from '../components/Spinner';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';

const AllMemberships = () => {
    
    const { firebaseInitialized } = useAuth();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFromAllUser, setSelectedFromAllUser] = useState(null);
    const [editableUser, setEditableUser] = useState({});


    useEffect(() => {
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

    const handleClickOpenAllUsers = (user) => {
        setSelectedFromAllUser(user);
        setEditableUser(user); 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setEditableUser({});
        setError('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditableUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to handle the removal of the profile picture
const handleRemoveProfilePic = async () => {

    // Initialize Firebase services
    const storage = getStorage();
    const db = getDatabase();
    const userImageRef = storageRef(storage, `user_images/${editableUser.uid}`);
    const userRef = ref(db, `Users/${editableUser.uid}/img`);

    // Remove the image from Firebase Storage
    try {
        await deleteObject(userImageRef);

    } catch (error) {
        setError('Error deleting image from storage');
        console.log(`user_images/${editableUser.uid}`);
        console.error('Error deleting image from storage:', error.message, error.code);
        return;
    }

    // Remove the image URL from the database
    try {
        await set(userRef, null);
        setEditableUser({ ...editableUser, img: null });
        setSuccess('Profile picture successfully deleted !');
        handleClose();
    } catch (error) {
        setError('Error removing image URL from database');
        console.error('Error removing image URL from database:', error.message, error.code);
        return;
    }

    setEditableUser({ ...editableUser, img: null });
};    
    
    const handleRenewalSave = () => {
        if (selectedFromAllUser) {
            // Check if all required fields are filled
            const { fname, lname, phone, email, gender, membershipType, startDate, expiryDate, totalPaid, debts } = editableUser;
    
            if (
                !fname || 
                !lname || 
                !phone || 
                !email || 
                !gender || 
                !membershipType || 
                !startDate || 
                !expiryDate || 
                totalPaid === undefined || 
                debts === undefined
            ) {
                setError("Please fill in all inputs before saving.");
                return;
            }

            // if (debts > 0) {
            //     setError("Clients must pay their debts first before renewing membership !");
            //     return;
            // }

            const userRef = ref(getDatabase(), `Users/${selectedFromAllUser.uid}`);
            set(userRef, editableUser)
                .then(() => {
                    // After successfully adding data to 'Users' DB, add to 'History' DB
                    const historyRef = ref(getDatabase(), `History/${selectedFromAllUser.uid}/${startDate}`);
                    set(historyRef, {
                        membershipType,
                        startDate,
                        expiryDate,
                        totalPaid,
                        debts
                    })
                    .then(() => {
                        // Successfully added to 'History' DB
                        setOpen(false);
                        setSelectedFromAllUser(null);
                        setEditableUser({});
                    })
                    .catch((error) => {
                        console.error("Error adding to History DB:", error);
                    });
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                });
        }
    };

    if (!firebaseInitialized) {
        return( 
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> 
                <Spinner /> 
            </div>
        )
    } 

    return (
        <div>
                <ThemeProvider theme={createTheme()}>
                    <Container component="main" maxWidth="lg">
                        <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
                        All Memberships
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <Card key={user.uid} sx={{ margin: 2, width: '100%', cursor: 'pointer' }} onClick={() => handleClickOpenAllUsers(user)}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={8}>
                                                    <Typography variant="h6">QR ID: {user.uid}</Typography>
                                                    <Typography variant="h6">First Name: {user.fname}</Typography>
                                                    <Typography variant="h6">Last Name: {user.lname}</Typography>
                                                    <Typography variant="h6">Telephone: {user.phone}</Typography>
                                                    <Typography variant="h6">Email: {user.email}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    {user.img ? (
                                                        <Box
                                                            component="img"
                                                            src={user.img}
                                                            alt="Profile"
                                                            sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                        src={"/Users/ahmedhenine/Desktop/fitness/src/imgs/pfp.png"}
                                                            sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                                        />
                                                    )}
                                                </Grid>

                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body1">No registered memberships at the moment.</Typography>
                            )}
                        </Box>
                        {selectedFromAllUser && (
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Edit User Information</DialogTitle>
                                {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }
                                {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert> }       
                                <DialogContent>
                                <Button onClick={handleRemoveProfilePic} variant="outlined" color="error">
                                    User wants to change profile pic
                                </Button>
                                    <DialogContentText>
                                    <TextField
                                            margin="dense"
                                            name="fname"
                                            label="First Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.fname || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="lname"
                                            label="Last Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.lname || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="phone"
                                            label="Telephone"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.phone || ''}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="email"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.email || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="gender"
                                            label="Gender"
                                            select
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.gender || ''}
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </TextField>
                                        <TextField
                                            margin="dense"
                                            name="membershipType"
                                            label="Membership Type"
                                            select
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.membershipType || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Bodybuilding">Bodybuilding</MenuItem>
                                            <MenuItem value="Cardio">Cardio</MenuItem>
                                            <MenuItem value="Bodybuilding & Cardio">Bodybuilding & Cardio</MenuItem>
                                            <MenuItem value="Bodybuilding with coaching">Bodybuilding with coaching</MenuItem>
                                            <MenuItem value="Bodybuilding & Cardio with coaching">Bodybuilding & Cardio with coaching</MenuItem>
                                            <MenuItem value="Women">Women</MenuItem>
                                        </TextField>
                                        <TextField
                                            margin="dense"
                                            name="startDate"
                                            label="Start Date"
                                            type="date"
                                            fullWidth
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            value={editableUser.startDate || ''}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="expiryDate"
                                            label="Expiry Date"
                                            type="date"
                                            fullWidth
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            value={editableUser.expiryDate || ''}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="totalPaid"
                                            label="Total Paid"
                                            type="number"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.totalPaid || ''}
                                            onChange={handleChange}
                                            sx={{ 
                                                '& .MuiInputBase-root': {
                                                    color: 'green',
                                                }
                                            }}
                                        />
                                        <TextField
                                            margin="dense"
                                            name="debts"
                                            label="Debts"
                                            type="number"
                                            fullWidth
                                            variant="standard"
                                            value={editableUser.debts || ''}
                                            onChange={handleChange}
                                            sx={{ 
                                                '& .MuiInputBase-root': {
                                                    color: 'red',
                                                }
                                            }}
                                        />
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleRenewalSave} color="primary">
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </Container>
                </ThemeProvider>
            </div>
    );
};

export default AllMemberships;
