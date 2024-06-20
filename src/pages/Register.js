import * as React from 'react';
import { auth } from '../firebase';
import { db } from '../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { ref, set } from "firebase/database";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

const Register = () => {
  const navigate = useNavigate();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fname || !lname || !phone || !email || !password || !confirmedPassword) {
        setError('Make sure to fill in all information');
    } else if (password !== confirmedPassword) {
        setError("Passwords don't match");
    } else {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                // Add user UID to 'Pending' DB
                const pendingRef = ref(db, `Pending/${uid}`);
                const pendingData = {
                  uid: uid,
                  fname: fname,
                  lname: lname,
                  phone: phone,
                  email: email,
                };
                set(pendingRef, pendingData)
                    .then(() => {
                        // Add user details to 'Users' DB
                        const userRef = ref(db, `Users/${uid}`);
                        const userData = {
                            img: '',
                            fname: fname,
                            lname: lname,
                            phone: phone,
                            email: email,
                        };
                        set(userRef, userData)
                            .then(() => {
                                // Take user to home page
                                navigate("/");
                                console.log('User was successfully registered in the DB');
                            })
                            .catch((error) => {
                                console.error("Error adding user to Users DB:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error adding user to Pending DB:", error);
                    });
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    setError("This email is already registered. Please Log in");
                } else if (error.code === "auth/invalid-email") {
                    setError("This email address is not valid.");
                } else if (error.code === "auth/operation-not-allowed") {
                    setError("Operation not allowed.");
                } else if (error.code === "auth/weak-password") {
                    setError("Your password is too weak.");
                } else {
                    console.error("Error creating user:", error);
                }
            });
    }
};

  return (
    <div>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert> }   
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
            <Avatar sx={{ m: 1, bgcolor: 'black', color: 'yellow'  }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registration form
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                    onChange={(e) => setFname(e.target.value)}
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
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="phone"
                    name="phone"
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Confirm password"
                    type="password"
                    id="Confirmpassword"
                    autoComplete="new-password"
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'black', color: 'yellow'  }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default Register;