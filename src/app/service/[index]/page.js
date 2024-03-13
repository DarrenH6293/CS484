"use client";

import { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import { getSession } from "next-auth/react";
import Divider from '@mui/material/Divider';

export default function Service({ params }) {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [user, SetUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    startTime: "",
    endTime: "",
    email: "",
    price: 0,
    startDate: null,
    endDate: null,
  });
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [review, setReview] = useState({ stars: 0, description: "" });
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      const session = await getSession();
      if (!session) return;

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
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/review");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        const modifiedReviews = data.reviews.map(review => {
          const dateObject = new Date(review.date);
          const month = dateObject.toLocaleString('default', { month: 'short' });
          const day = dateObject.getDate();
          const hours = dateObject.getHours();
          const minutes = dateObject.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes < 10

          return {
            ...review,
            date: `${month} ${day}`,
            time: `${formattedHours}:${formattedMinutes} ${ampm}`
          };
        });

        setReviews(modifiedReviews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);



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
    let newNotif;
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
        console.log(responseData)
        newNotif = {
          title: "New Booking",
          description: "A New Booking has been requested",
          dismissed: false,
          start: new Date().toISOString(),
          bookingID: responseData.booking.id,
          userID: service.vendorID
        }

        const responsenotif = await fetch("/api/Notifs", {
          method: "POST",
          body: JSON.stringify(newNotif),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!responsenotif.ok) {
          throw new Error("Failed to add notification");
        }
        const responseDataNotif = await responsenotif.json();

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

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleSubmitReview = async () => {
    const newReview = {
      stars: Number(review.stars),
      description: review.description,
      authorID: Number(currentUser.id),
      serviceID: Number(service.id),
    };
    try {
      const response = await fetch("/api/review", {
        method: "PUT",
        body: JSON.stringify(newReview),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      setReview({
        stars: 0,
        description: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!service) {
    return <p>Service not found</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: "1", marginRight: "20px" }}>
          <h1>{service.name}</h1>
          {/* Display service image */}
          <div style={{ maxWidth: "400px" }}>
            {service.image ? (
              <img
                src={`/images/vendor/${service.id}.png`}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left",
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
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left",
                  marginBottom: "8px",
                  borderRadius: '10px'
                }}
              />
            )}
          </div>
          <br />
        </div>
        <div style={{ flex: "1", border: "1px solid #ccc", marginTop: "90px", borderRadius: "5px", padding: "10px" }}>
          <h2>Details</h2>
          <p>{service.description}<br />
            Type: {service.type.name}<br />
            Price: ${service.minPrice} - ${service.maxPrice}<br />
            Location: {service.address}</p>
        </div>
      </div>
      <button onClick={handleMakeBookingClick}>Request Booking</button>

      {/* Modal */}
      {isModalOpen && (
        <div>
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

      {/* Area for Reviews */}
      {/* Needs backend */}
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Reviews<StarIcon style={{ verticalAlign: "-3.5px" }} /></h2>
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
          {currentUser && (<div><h2>Add Review</h2>
            <p>Stars:</p>
            <input
              type="number"
              name="stars"
              value={review.stars}
              onChange={handleReviewChange}
            />

            <p>Description:</p>
            <textarea
              name="description"
              value={review.description}
              onChange={handleReviewChange}
            />

            {isSubmitting ? (
              <p>Submitting review...</p>
            ) : (
              <button onClick={handleSubmitReview}>Submit Review</button>
            )} <Divider sx={{ marginTop: '20px' }} /> <Divider sx={{ marginTop: '10px' }} /></div>)}

          {reviews.map((review, index) => (
            <div key={index}>
              <p>UserID: {review.authorID} Stars: {review.stars}</p><p>Date: {review.date} {review.time}</p>
              <p>Review: {review.description}</p>
              <Divider sx={{ marginTop: '0px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
