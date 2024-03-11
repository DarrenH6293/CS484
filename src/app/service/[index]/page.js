"use client";

import { useEffect, useState } from "react";

export default function Service({ params }) {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [user, SetUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    startTime: "",
    endTime: "",
    email: "",
    startDate: null,
    endDate: null,
  });
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMakeBookingClick = () => {
    // Open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
    // Reset booking information
    setBookingInfo({
      date: "",
      startTime: "",
      endTime: "",
      email: "",
      price: 0,
      startDate: null, // New state for start date
      endDate: null, // New state for end date
    });
    setIsStartTimeValid(true);
    // Reset submission status
    setIsSubmitting(false);
  };

  const handleStartTimeChange = (event) => {
    const startTime = event.target.value;
    if (bookingInfo.date == "") {
      window.alert("Select Date.");
      return;
    }
    // Check if the start time is not later than the end time
    const isStartTimeValid = startTime <= bookingInfo.endTime;
    setIsStartTimeValid(isStartTimeValid);
    const startDate = new Date(`${bookingInfo.date}T${startTime}`);
    setBookingInfo((prevInfo) => ({ ...prevInfo, startTime, startDate }));
  };

  const handleEndTimeChange = (event) => {
    const endTime = event.target.value;
    if (bookingInfo.date == "") {
      window.alert("Select Date.");
      return;
    }
    // Check if the end time is not earlier than the start time
    const isStartTimeValid = bookingInfo.startTime <= endTime;
    setIsStartTimeValid(isStartTimeValid);
    const endDate = new Date(`${bookingInfo.date}T${endTime}`);
    setBookingInfo((prevInfo) => ({ ...prevInfo, endTime, endDate }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmitBooking = async () => {
    let newBooking;
    let currentUser = null;
    try {
      if (bookingInfo.startTime > bookingInfo.endTime) {
        setIsStartTimeValid(false);
        return;
      }
      // Assuming you have an API endpoint for submitting bookings

      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        currentUser = data.users.find(
          (user) => user.email === bookingInfo.email
        );

        if (currentUser == null || currentUser.role == "VENDOR") {
          return;
        }
        newBooking = {
          status: false,
          hasBeenConfirmed: false,
          start: bookingInfo.startDate,
          end: bookingInfo.endDate,
          price: Number(bookingInfo.price),
          custID: currentUser.id,
          serviceID: service.id,
        };
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          body: JSON.stringify(newBooking),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add booking");
        }
        const responseData = await response.json();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      window.alert("Error submitting BOOKING:", error);
      return;
    } finally {
      if (!isStartTimeValid) {
        window.alert("Invalid start & end time");
        return;
      } else if (bookingInfo.date == "") {
        window.alert("Need to input a date.");
        return;
      } else if (currentUser == null || currentUser.role == "VENDOR") {
        console.log("IN HERE");
        console.log(currentUser);
        window.alert("Invalid customer email.");
        return;
      }
      setIsSubmitting(true);
      // Update UI as needed
      setIsSubmitting(false);
      // Close the modal after a delay
      setTimeout(() => closeModal(), 500);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch("/api/servicesProfile");
        if (response.ok) {
          const data = await response.json();
          const services = data.services;
          const selectedService = services.find(
            (service) => service.id === parseInt(params.index)
          );
          if (selectedService) {
            setService(selectedService);
          } else {
            console.error("Service not found");
          }
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
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
      <p>
        Service ID: {params.index} <br />
        Title: {service.name}
      </p>
      {/* Display other service information here */}
      <button onClick={handleMakeBookingClick}>Request Booking</button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Date:</p>
            <input
              type="date"
              name="date"
              value={bookingInfo.date}
              onChange={handleInputChange}
            />

            <p>Start Time:</p>
            <input
              type="time"
              name="startTime"
              value={bookingInfo.startTime}
              onChange={handleStartTimeChange}
            />

            <p>End Time:</p>
            <input
              type="time"
              name="endTime"
              value={bookingInfo.endTime}
              onChange={handleEndTimeChange}
            />

            <p>Email:</p>
            <input
              type="text"
              name="email"
              value={bookingInfo.email}
              onChange={handleInputChange}
            />
            <p>Proposed Price:</p>
            <input
              type="number"
              name="price"
              value={bookingInfo.price}
              onChange={handleInputChange}
            />

            {!isStartTimeValid && (
              <p style={{ color: "red" }}>
                Start time cannot be later than end time.
              </p>
            )}

            {isSubmitting ? (
              <p>Submitting booking...</p>
            ) : (
              <button onClick={handleSubmitBooking}>Submit Booking</button>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
