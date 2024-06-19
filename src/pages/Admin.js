import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Container, CssBaseline, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid, TextField, MenuItem, ThemeProvider, Typography, createTheme } from '@mui/material';
import { ref, onValue, getDatabase, set, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import Alert from '@mui/material/Alert';

const Admin = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pendingUsers, setPendingUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFromAllUser, setSelectedFromAllUser] = useState(null);
    const [editableUser, setEditableUser] = useState({});

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


    const handleClickOpen = (user) => {
        setSelectedUser(user);
        setEditableUser(user); 
        setOpen(true);
    };

    const handleClickOpenAllUsers = (user) => {
        setSelectedFromAllUser(user);
        setEditableUser(user); 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setEditableUser({});
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

    const handlePendingSave = () => {
        if (selectedUser) {
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
    
            const userRef = ref(getDatabase(), `Users/${selectedUser.uid}`);
            set(userRef, editableUser)
                .then(() => {

                        // Remove from Pending DB
                        const pendingRef = ref(getDatabase(), `Pending/${selectedUser.uid}`);
                        remove(pendingRef)

                        // After successfully adding data to 'Users' DB, add to 'History' DB
                        const historyRef = ref(getDatabase(), `History/${selectedUser.uid}/${startDate}`);
                        set(historyRef, {
                            membershipType,
                            startDate,
                            expiryDate,
                            totalPaid,
                            debts
                        })
                        .then(() => {
                            setOpen(false);
                            setSelectedUser(null);
                            setEditableUser({});
                        })
                        .catch((error) => {
                            console.error("Error removing user from Pending DB:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                });
        }
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

    return (
        <ThemeProvider theme={createTheme()}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
                    Pending memberships
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {pendingUsers.length > 0 ? (
                        pendingUsers.map((user) => (
                            <Card key={user.uid} sx={{ margin: 2, width: '100%', cursor: 'pointer' }} onClick={() => handleClickOpen(user)}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <Typography variant="h6">User ID: {user.uid}</Typography>
                                            <Typography variant="h6">First Name: {user.fname}</Typography>
                                            <Typography variant="h6">Last Name: {user.lname}</Typography>
                                            <Typography variant="h6">Telephone: {user.phone}</Typography>
                                            <Typography variant="h6">Email: {user.email}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            {user.img && (
                                                <Box
                                                    component="img"
                                                    src={user.img}
                                                    alt="Profile"
                                                    sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1">No pending users at the moment.</Typography>
                    )}
                </Box>

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
                                            {user.img && (
                                                <Box
                                                    component="img"
                                                    src={user.img}
                                                    alt="Profile"
                                                    sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1">No expired memberships at the moment.</Typography>
                    )}
                </Box>


                {selectedUser && (
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit User Information</DialogTitle>
                        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }   
                        <DialogContent>
                        {editableUser.selectedImage && (
                                    <Box
                                        component="img"
                                        src={editableUser.selectedImage}
                                        alt="Profile"
                                        sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                    />
                                )}
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
                                    onChange={handleChange}
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
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handlePendingSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

                {selectedFromAllUser && (
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit User Information</DialogTitle>
                        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }
                        {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert> }       
                        <DialogContent>
                        <Button onClick={handleRemoveProfilePic} variant="outlined" color="error">
                            User wants to change profile pic
                        </Button>
                        {editableUser.selectedImage && (
                                    <Box
                                        component="img"
                                        src={editableUser.selectedImage}
                                        alt="Profile"
                                        sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                    />
                                )}
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
    );
};

export default Admin;
