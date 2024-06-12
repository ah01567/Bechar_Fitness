import React, { useState, useEffect } from 'react';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import useAuth from "./currentUser";
import SideBar from "../components/Sidebar";
import Spinner from '../components/Spinner';
import Alert from '@mui/material/Alert';

const MAX_IMAGE_SIZE = 7 * 1024 * 1024;

const Profile = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('')

    const { currentUser, firebaseInitialized } = useAuth();
    const [img, setSelectedImage] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [membershipType, setMembership] = useState('');
    const [startDate, setStart] = useState('');
    const [expiryDate, setExpiry] = useState('');
    const [totalPaid, setPaid] = useState('');
    const [debts, setDebt] = useState('');

        //Fetch User's credentials from Database for display 
        useEffect(() => {
            const currentUserID = currentUser?.uid;
            window.scrollTo(0, 0);
            
            if (!currentUserID) {
            return;
            }

            const dbRef = ref(getDatabase(), `Users/${currentUserID}`);
            onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) { // check if data is not null or undefined
                setSelectedImage(data.img); 
                setFname(data.fname); 
                setLname(data.lname);
                setGender(data.gender);
                setPhoneNumber(data.phone);
                setEmail(data.email);
                setMembership(data.membershipType);
                setStart(data.startDate);
                setExpiry(data.expiryDate);
                setPaid(data.totalPaid);
                setDebt(data.debts);
            }
            });
        }, [currentUser?.uid]);

    if (!firebaseInitialized) {
        return( 
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> 
                <Spinner /> 
            </div>
        )
      } 

      const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                setError('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                console.log(base64String);
                setSelectedImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save the changes and push to Database
    const handleSave = (event) => {
        event.preventDefault();
        const currentUserID = currentUser?.uid;
        const userRef = ref(getDatabase(), `Users/${currentUserID}`);
        const newData = {
            img: img || '',
            fname: fname || '',
            lname: lname || '', 
            gender: gender || '',
            membershipType: membershipType || '',
            email: email || '',
            phone: phone || '',
            startDate: startDate || '',
            expiryDate: expiryDate || '',
            totalPaid: totalPaid || '',
            debts: debts || '',
        };
        set(userRef, newData);
        navigate('/');

    };

    return(
        <div>
            {!currentUser ? (<div><Login /></div>) : (      
            <div style={{}}>
                <div style={{ borderRight: '1px solid #ccc', paddingRight: '10px', height: '100%'  }}>
                    <SideBar />
                </div>   
                {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }    
                <div> 
                    <ThemeProvider theme={createTheme()}>
                        <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            }}
                        >
                            
                            <Avatar
                                src={img || "/Users/ahmedhenine/Desktop/fitness/src/imgs/pfp.png"}
                                sx={{ width: 170, height: 170, border: '1px solid Black' }}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ marginTop: 2, backgroundColor: 'black', color: 'yellow', 
                                '&:hover': {
                                    color: 'yellow',
                                    backgroundColor: 'black'
                                }}}
                            >
                                Upload Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </Button>


                            <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={fname}
                                    //onChange={(e) => setFname(e.target.value)}
                                    autoFocus
                                    disabled
                                />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={lname}
                                    //onChange={(e) => setLname(e.target.value)}
                                    autoComplete="family-name"
                                    disabled
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    name="phoneNumber"
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    //disabled={!isEditing}
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    //onChange={(e) => setEmail(e.target.value)}
                                    disabled
                                    
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                    labelId="gender-label"
                                    id="gender"
                                    value={gender}
                                    label="Gender"
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled
                                    >
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} >
                                <FormControl fullWidth>
                                    <InputLabel id="membership-label">Membership type</InputLabel>
                                    <Select
                                    labelId="membership-label"
                                    id="membership"
                                    value={membershipType}
                                    label="Membership type"
                                    onChange={(e) => setMembership(e.target.value)}
                                    disabled
                                    >
                                        <MenuItem value="Bodybuilding">Bodybuilding</MenuItem>
                                        <MenuItem value="Cardio">Cardio </MenuItem>
                                        <MenuItem value="Bodybuilding & Cardio">Bodybuilding & Cardio </MenuItem>
                                        <MenuItem value="Bodybuilding with coaching">Bodybuilding with coaching </MenuItem>
                                        <MenuItem value="Bodybuilding & Cardio with coaching">Bodybuilding & Cardio with coaching </MenuItem>
                                        <MenuItem value="Women">Women </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="start-date"
                                    name="start"
                                    required
                                    fullWidth
                                    id="start"
                                    type="date"
                                    value={startDate}
                                    label="Start date"
                                    //onChange={(e) => setStart(e.target.value)}
                                    autoFocus
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="expiry-date"
                                    name="expiry"
                                    required
                                    fullWidth
                                    id="expiry"
                                    type="date"
                                    label="Expiry date"
                                    value={expiryDate}
                                    //onChange={(e) => setExpiry(e.target.value)}
                                    autoFocus
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="Paid"
                                    name="paid"
                                    required
                                    fullWidth
                                    id="paid"
                                    label="Total paid (DZD)"
                                    value={totalPaid}
                                    //onChange={(e) => setPaid(e.target.value)}
                                    autoFocus
                                    disabled
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'green',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: '2px solid green',
                                        },
                                        '& .MuiInput-underline:hover:before': {
                                            borderBottom: '2px solid darkgreen',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: '2px solid green',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="debt"
                                    name="debt"
                                    required
                                    fullWidth
                                    id="debt"
                                    label="Debt (DZD)"
                                    value={debts}
                                    //onChange={(e) => setDebt(e.target.value)}
                                    autoFocus
                                    disabled
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'red',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: '2px solid red',
                                        },
                                        '& .MuiInput-underline:hover:before': {
                                            borderBottom: '2px solid darkred',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: '2px solid red',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                            
                            <Grid item xs={12} sx={{ mt: 2 }} display="flex" justifyContent="space-between">

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSave}
                                    sx={{ bgcolor: 'green', width: '100%' }}
                                >
                                    Save
                                </Button>
                            </Grid>
                            </Box>
                        </Box>
                        </Container>
                    </ThemeProvider>
                    <br />
                </div>
            </div>
            )}
        </div>
    )
}
 
export default Profile