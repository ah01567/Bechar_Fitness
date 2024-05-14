import * as React from 'react';
import { auth } from '../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import useAuth from "./currentUser";

const Profile = () => {
    const { currentUser } = useAuth();

    return(
        <div>
            {!currentUser ? (<div><Login /></div>) : (            
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
                        <Typography component="h1" variant="h5">
                            <h1> User's Profile </h1>
                        </Typography>

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
                                //value={fname}
                                //onChange={(e) => setFname(e.target.value)}
                                autoFocus
                            />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                //value={lname}
                                //onChange={(e) => setLname(e.target.value)}
                                autoComplete="family-name"
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="dob"
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                //value={dob}
                                //onChange={(e) => setDob(e.target.value)}
                            InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                labelId="gender-label"
                                id="gender"
                                //value={gender}
                                label="Gender"
                                //onChange={(e) => setGender(e.target.value)}
                                //disabled={!isEditing}
                                >
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl fullWidth disabled>
                                <InputLabel id="membership-label">Membership type</InputLabel>
                                <Select
                                labelId="membership-label"
                                id="membership"
                                //value={gender}
                                label="Membership type"
                                //onChange={(e) => setGender(e.target.value)}
                                //disabled={!isEditing}
                                >
                                <MenuItem value="Daily pass">Daily pass</MenuItem>
                                <MenuItem value="Monthly">Monthly </MenuItem>
                                <MenuItem value="Yearly">Yearly </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                //value={email}
                                //onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }} display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="primary"
                                //onClick={() => setIsEditing(!isEditing)}
                                sx={{ bgcolor: 'blue', width: '48%' }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                //onClick={handleProfileUpdate}
                                sx={{ bgcolor: 'green', width: '48%' }}
                            >
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                //onClick={handleDeleteAccount}
                                fullWidth
                            >
                                Delete Account
                            </Button> <break/>
                        </Grid>
                        </Box>
                    </Box>
                    </Container>
                </ThemeProvider>
            </div>
            )}
        </div>
    )
}
 
export default Profile