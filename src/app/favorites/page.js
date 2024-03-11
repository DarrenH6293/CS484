'use client'

import { useState, useEffect } from 'react';
import { Box, TextField, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { getSession } from "next-auth/react";

export default function Favorites() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

    // Loading page...
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h2>My Favorites</h2>
            <Grid container spacing={3} sx={{ maxWidth: "1400px", margin: "0" }}>
                {currentUser.favorites.map((service, index) => (
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
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}