'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';
import Login from './Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Signup from './Signup';
import { useSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { signOut } from "next-auth/react"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Link from 'next/link';


const theme = createTheme({});

export default function RootLayout({ children, title }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: session, status }  = useSession();

  let loginSection;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });  // Sign out the user first
  };
  

  if (status === 'authenticated') {
    loginSection = (
      <>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleMenuOpen}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
        <span>My Account</span>
        <img 
        src="/images/default_pfp.webp" 
        style={{ 
        width: '25px', 
        height: '25px', 
        borderRadius: '50%',
        marginLeft: '8px' // Apply border-radius to make it a circle
        }} 
        alt="Profile"
        />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}><Link href="/profile">Profile</Link></MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleSignOut(); }}>Sign Out</MenuItem>
        </Menu>
      </>
    );
  } else {
    loginSection = <Login />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {title}
              </Typography>
              <NavBar />
              <Box sx={{ flexGrow: 0 }}>
                <Stack direction='row' spacing={2}>
                  {loginSection}
                </Stack>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}