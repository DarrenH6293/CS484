'use client'

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Box, TextField, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceMinPrice, setServiceMinPrice] = useState('');
  const [serviceMaxPrice, setServiceMaxPrice] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceRange, setServiceRange] = useState('');
  const [services, setServices] = useState([]);

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
        setServices(user.services || []);
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

  // Function to add service for vendors
  async function handleAddService() {
    // Perform validation
    if (!serviceName || !serviceDescription || !serviceMinPrice || !serviceMaxPrice || !serviceAddress || !serviceRange) {
      setError(true);
      return;
    }

    setError(false);

    const newService = {
      name: serviceName,
      description: serviceDescription,
      minPrice: serviceMinPrice,
      maxPrice: serviceMaxPrice,
      address: serviceAddress,
      range: serviceRange,
    };

    setServices(prevServices => [...prevServices, newService]);

    setOpenDialog(false);
  }

  return (
    <>
      {currentUser.role === 'CUSTOMER' && (
        <>
          <h1>My Profile (Customer)</h1>
        </>
      )}
      {currentUser.role === 'CUSTOMER' && (
        <>
          <h1>My Profile (Customer)</h1>
        </>
      )}
      {currentUser.role === 'VENDOR' && (
        <>
          <h1>My Profile (Vendor)</h1>
          <h2>My Services</h2>
          <Grid container spacing={3} sx={{ maxWidth: '900px', margin: '0' }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                  }}
                >
                  <img src="/images/placeholder.png" alt="Placeholder" style={{ width: '100%', height: 'auto', marginBottom: '8px' }} />
                  <Typography variant="subtitle1" gutterBottom>Name: {service.name}</Typography>
                  <Typography variant="body2" gutterBottom>Description: {service.description}</Typography>
                  <Typography variant="body2" gutterBottom>Min Price: {service.minPrice}</Typography>
                  <Typography variant="body2" gutterBottom>Max Price: {service.maxPrice}</Typography>
                  <Typography variant="body2" gutterBottom>Address: {service.address}</Typography>
                  <Typography variant="body2" gutterBottom>Range: {service.range}</Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleOpenDialog}
              >
                <img src="/images/placeholder.png" alt="Placeholder" style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'contain', marginBottom: '8px' }} />
                <Typography variant="subtitle1" gutterBottom>Click to add a service</Typography>
              </Box>
            </Grid>
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogContent>
              <TextField
                label="Service Name"
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={serviceDescription}
                onChange={e => setServiceDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Minimum Price"
                value={serviceMinPrice}
                onChange={e => setServiceMinPrice(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Maximum Price"
                value={serviceMaxPrice}
                onChange={e => setServiceMaxPrice(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={serviceAddress}
                onChange={e => setServiceAddress(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Range"
                value={serviceRange}
                onChange={e => setServiceRange(e.target.value)}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleAddService} color="primary">Add</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}