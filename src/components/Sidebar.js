import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Divider, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PolicyIcon from '@mui/icons-material/Policy';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';

const SideBar = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/login");
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log(error);
        });
      }

    return(
        <div>
            <Toolbar />
            <Divider />
            <IconButton onClick={toggleDrawer} style={{ position: 'fixed', top: '10px' }}>
                <MenuIcon />
            </IconButton>
            {isOpen && (
            <div>
            <List>
                {['Home', 'Profile', 'Policy'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => navigate(index === 0 ? '/' : index === 1 ? '/profile' : '/policy')}>
                        <ListItemIcon>
                        {index == 0 ? <HomeIcon fontSize="large"/> : 
                        index == 1 ? <AccountCircleIcon fontSize="large"/> : 
                        index == 2 ? <PolicyIcon fontSize="large"/> : null}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Logout'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                        {index == 0 ? <LogoutIcon fontSize="large"/> : null}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                    </ListItem>
                ))}
            </List> 
            <Divider />
            </div>)}
        </div>
    )
}
 
export default SideBar