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
  MenuItem
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
  const types = [null, 'Venue', 'Entertainment', 'Catering', 'Production', 'Decoration']

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await getSession();
      if (!session) {
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
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Update loading state after fetching user
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!currentUser) return;

      try {
        setLoading(true); // Set loading state to true before fetching services
        const dbServicesResp = await fetch("/api/servicesProfile");
        if (!dbServicesResp.ok) {
          throw new Error("Failed to fetch services");
        }
        const serviceData = await dbServicesResp.json();
        const vendorServices = serviceData.services.filter(
          (service) => service.vendorID === currentUser.id
        );
        setServices(vendorServices || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading state to false after fetching services
      }
    };

    fetchServices();
  }, [currentUser]);

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

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/servicesProfile`, {
        method: 'DELETE',
        body: JSON.stringify({ id: serviceId })
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.status === 200) {
          // Update services state after deletion
          setServices((prevServices) => prevServices.filter(service => service.id !== serviceId));
        } else {
          throw new Error('Failed to delete service');
        }
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  // Function to add service for vendors
  async function handleAddService() {
    if (
      !serviceName ||
      !serviceDescription ||
      !serviceMinPrice ||
      !serviceMaxPrice ||
      !serviceAddress ||
      !serviceRange ||
      !selectedFile
    ) {
      setError(true);
      return;
    }

    setError(false);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async function () {
      const base64data = reader.result.split(",")[1];

      const newService = {
        name: serviceName,
        description: serviceDescription,
        minPrice: Number(serviceMinPrice),
        maxPrice: Number(serviceMaxPrice),
        address: serviceAddress,
        range: Number(serviceRange),
        typeID: Number(serviceTypeID),
        vendorID: Number(currentUser.id),
        image: {
          data: base64data,
        },
      };

      try {
        const response = await fetch("/api/servicesProfile", {
          method: "POST",
          body: JSON.stringify(newService),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add service");
        }
        const responseData = await response.json();
        if (responseData.hasOwnProperty('service')) {
          responseData.service.image = `/images/vendor/${responseData.service.id}.png`;
          setServices((prevServices) => [...prevServices, responseData.service]);
        } else {
          console.error("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error(error);
      }

      setOpenDialog(false);
    };
  }


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
          <Grid container spacing={3} sx={{ maxWidth: "1400px", margin: "0" }}>
            {services.map((service, index) => (
              <Grid item xs="auto" sm="auto" md={3} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {service.image ? (
                    <img
                      src={`/images/vendor/${service.id}.png`}
                      alt={service.name}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "fill",
                        objectPosition: "center",
                        marginBottom: "8px",
                        borderRadius: '10px'
                      }}
                    />
                  ) : (
                    <img
                      src="/images/placeholder.png"
                      alt="Placeholder"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "fill",
                        objectPosition: "center",
                        marginBottom: "8px",
                        borderRadius: '10px'
                      }}
                    />
                  )}
                  <Typography variant="subtitle1" gutterBottom>
                    Name: {service.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Type: {types[service.typeID]}
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
                  {/* Edit button */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      position: "absolute",
                      bottom: "8px", // Adjust this value for vertical positioning
                      right: "8px", // Adjust this value for horizontal positioning
                    }}
                    onClick={() => handleEditService(service)} // Pass the service data to the edit function
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      position: "absolute",
                      top: "8px", // Adjust this value for vertical positioning
                      right: "8px", // Adjust this value for horizontal positioning
                    }}
                    onClick={() => deleteService(service.id)} // Pass service id to delete function
                  ></Button>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sm="auto" md={3}>
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
              Add a service image<br></ br>
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <br></ br>
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
                <MenuItem value={3}>Catering</MenuItem>
                <MenuItem value={4}>Production</MenuItem>
                <MenuItem value={5}>Decoration</MenuItem>
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
