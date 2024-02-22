'use client'

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await getSession();
      if (!session) {
        // Handle case where user is not authenticated
        setLoading(false); // Update loading state
        return;
      }

      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const user = data.users.find(user => user.email === session.user.email);
        setCurrentUser(user);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setPhone(user.phone);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Update loading state after fetching user
      }
    };

    fetchCurrentUser();
  }, []);

  // Loading page...
  if (loading) {
    return <p>Loading...</p>;
  }

function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    // Validate input fields
    if (newPassword && (newPassword === confirmPassword)) {
      const resetPasswordData = {
        email: currentUser.email,
        password: newPassword,
      };

      try {
        const response = await fetch("/api/users", {
          method: 'POST',
          body: JSON.stringify(resetPasswordData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Password reset successfully
          alert('Password reset successfully');
          setNewPassword('');
          setConfirmPassword('');
          handleCloseDialog();
        } else {
          // Password reset failed
          setError(true);
          alert('Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setError(true);
      }
    } else {
      // Missing input fields or passwords don't match
      setError(true);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();

    // Validate input fields
    if (email && displayName && phone) {
      const updateUserData = {
        email: email,
        displayName: displayName,
        phone: phone
      };

      try {
        const response = await fetch("/api/users", {
          method: 'POST',
          body: JSON.stringify(updateUserData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Profile updated successfully
          alert('Profile updated successfully');
          handleCloseDialog();
          setDisplayName(updateUserData.displayName);
          setEmail(updateUserData.email);
          setPhone(updateUserData.phone);
        } else {
          // Profile update failed
          setError(true);
          alert('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setError(true);
      }
    } else {
      // Missing input fields
      setError(true);
    }
    console.log("Updating user profile...");
    console.log("New Display Name:", displayName);
    console.log("New Email:", email);
    console.log("New Phone:", phone);
  };

  return (
    <>
      <h1>My Profile</h1>
      <h2>User Type: {currentUser.role}</h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
        <label htmlFor="displayName">Display Name:</label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ maxWidth: '150px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ maxWidth: '150px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ maxWidth: '150px' }}
        />
      </div>
      <button onClick={handleUpdate} style={{ justifySelf: 'start' }}>Update Info</button>
    </div>
      <Button variant="contained" onClick={handleOpenDialog}>
        Reset Password
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <form onSubmit={handleResetPassword}>
          <DialogContent>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Reset Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}