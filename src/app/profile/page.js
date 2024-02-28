"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceMinPrice, setServiceMinPrice] = useState("");
  const [serviceMaxPrice, setServiceMaxPrice] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [serviceRange, setServiceRange] = useState("");
  const [services, setServices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serviceTypeID, setServiceTypeID] = useState(1);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await getSession();
      if (!session) {
        // Handle case where user is not authenticated
        setLoading(false); // Update loading state
        return;
      }

      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const user = data.users.find(
          (user) => user.email === session.user.email
        );
        const dbServicesResp = await fetch("/api/servicesProfile");
        const serviceData = await dbServicesResp.json();
        const vendorServices = serviceData.services.filter(
          (service) => service.vendorID === user.id
        );
        setCurrentUser(user);
        setServices(vendorServices || []);
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
  // To-do: Add backend
  async function handleAddService() {
    // Perform validation
    if (
      !serviceName ||
      !serviceDescription ||
      !serviceMinPrice ||
      !serviceMaxPrice ||
      !serviceAddress ||
      !serviceRange
    ) {
      setError(true);
      return;
    }

    setError(false);

    const newService = {
      name: serviceName,
      description: serviceDescription,
      minPrice: Number(serviceMinPrice),
      maxPrice: Number(serviceMaxPrice),
      address: serviceAddress,
      range: Number(serviceRange),
      typeID: Number(serviceTypeID),
      vendorID: Number(currentUser.id),
      image: selectedFile,
    };
    const response = await fetch("/api/servicesProfile", {
      method: "POST",
      body: JSON.stringify(newService),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setServices((prevServices) => [...prevServices, newService]);

    setOpenDialog(false);
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <>
      {currentUser.role === "CUSTOMER" && (
        <>
          <h1>My Profile (Customer)</h1>
        </>
      )}
      {currentUser.role === "VENDOR" && (
        <>
          <h1>My Profile (Vendor)</h1>
          <h2>My Services</h2>
          <Grid container spacing={3} sx={{ maxWidth: "900px", margin: "0" }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  {/* Check if service has an image, if not, use placeholder */}
                  {service.image ? (
                    <img
                      src={URL.createObjectURL(service.image)}
                      alt={service.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        marginBottom: "8px",
                      }}
                    />
                  ) : (
                    <img
                      src="/images/placeholder.png"
                      alt="Placeholder"
                      style={{
                        width: "100%",
                        height: "auto",
                        marginBottom: "8px",
                      }}
                    />
                  )}
                  <Typography variant="subtitle1" gutterBottom>
                    Name: {service.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Description: {service.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Min Price: {service.minPrice}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Max Price: {service.maxPrice}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Address: {service.address}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Range: {service.range}
                  </Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={handleOpenDialog}
              >
                <img
                  src="/images/placeholder.png"
                  alt="Placeholder"
                  style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "4 / 3",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />
                <Typography variant="subtitle1" gutterBottom>
                  Click to add a service
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogContent>
              <input
                type="file"
                accept="images/vendor/*"
                onChange={handleFileChange}
              />
              <TextField
                label="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Minimum Price"
                value={serviceMinPrice}
                onChange={(e) => setServiceMinPrice(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Maximum Price"
                value={serviceMaxPrice}
                onChange={(e) => setServiceMaxPrice(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={serviceAddress}
                onChange={(e) => setServiceAddress(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Range"
                value={serviceRange}
                onChange={(e) => setServiceRange(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Type"
                select
                value={serviceTypeID}
                onChange={(e) => setServiceTypeID(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value={1}>Venue</MenuItem>
                <MenuItem value={2}>Entertainment</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleAddService} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
