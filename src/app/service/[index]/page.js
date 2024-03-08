'use client'

import { useEffect, useState } from 'react';

export default function Service({ params }) {
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch('/api/servicesProfile');
                if (response.ok) {
                    const data = await response.json();
                    const services = data.services;
                    const selectedService = services.find(service => service.id === parseInt(params.index));
                    if (selectedService) {
                        setService(selectedService);
                    } else {
                        console.error('Service not found');
                    }
                } else {
                    console.error('Failed to fetch services');
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [params.index]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!service) {
        return <p>Service not found</p>;
    }

    return (
        <div>
            <p>Service ID: {params.index} <br></br>
                Title: {service.name}</p>
            {/* Display other service information here */}
        </div>
    );
}
