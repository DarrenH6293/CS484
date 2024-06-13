'use client'
import Image from 'next/image'
import Link from "next/link";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TuneIcon from '@mui/icons-material/Tune';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { styled } from '@mui/material/styles';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import MinimizeIcon from '@mui/icons-material/Minimize';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import { Chip, Stack, Modal, Typography, FormControl, InputLabel, Select, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getSession } from "next-auth/react";
import StarIcon from '@mui/icons-material/Star';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [tags, setTags] = useState([
    { key: 'tag1', label: 'Plumbing', selected: false },
    { key: 'tag2', label: 'Lawncare', selected: false },
    { key: 'tag3', label: 'Electrical', selected: false },
    { key: 'tag4', label: 'Roofing', selected: false },
    { key: 'tag5', label: 'Pest Control', selected: false },
    { key: 'tag6', label: 'Cleaning', selected: false },
    // Add more tags as needed
  ]);
  const [services, setServices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [searchInput, setSearchInput] = useState("")
  const [city, setCity] = useState('')
  const [rating, setRating] = useState('')
  const [reviews, setReviews] = useState([]);


  const re = /^[0-9\b]+$/;

  const handleNumbers = (event, p) => {
    let num = event.target.value
    if (!re.test(event.target.value)) {
      event.preventDefault();
    }
    else if (p == 'min') {
      if (num > maxPrice) {
        alert('Min Price cannot be greater than Max Price');
        event.preventDefault();
      }
      else
        setMinPrice(event.target.value)
    }
    else {
      if (num < minPrice) {
        alert('Min Price cannot be greater than Max Price');
        event.preventDefault();
      }
      else
        setMaxPrice(event.target.value)
    }
  }

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/servicesProfile');
        if (response.ok) {
          const data = await response.json();
          setServices(data.services);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }

    fetchServices();
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

  const filterServices = () => {
    let filteredServices = services;
    if (selectedTypes.length > 0) {
      filteredServices = filteredServices.filter(service => selectedTypes.includes(service.type.name));
    }
    filteredServices = filteredServices.filter(service => (service.minPrice >= minPrice && service.maxPrice <= maxPrice));
    if (searchInput != "") {
      filteredServices = filteredServices.filter(service => {
        const name = service.name.toLowerCase();
        return name.includes(searchInput.toLowerCase())
      })
    }
    if (city != '') {
      filteredServices = filteredServices.filter(service => {
        let c = service.address.split(',')[1].toLowerCase();
        return c.includes(city.toLowerCase())
      })
    }
    if (rating !== null) {
      filteredServices = filteredServices.filter(service =>
        calculateOverallRating(service) >= rating
      );
    }
    return filteredServices;
  };

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
    const fetchFavorites = async () => {
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
        setFavorites(user.favorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);


  // Opening filter pop-up
  const [open, setOpen] = useState(false);

  const toggleFavorite = async (userId, service) => {
    try {
      const updateFavoriteData = { id: userId, favorites: [service] };
      try {
        const response = await fetch(`/api/users`, {
          method: 'POST',
          body: JSON.stringify(updateFavoriteData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Toggle favorite successful
          const newFavorites = currentUser.favorites.some(fav => fav.id === service.id)
            ? currentUser.favorites.filter(fav => fav.id !== service.id)
            : [...currentUser.favorites, service];
          const updatedUser = { ...currentUser, favorites: newFavorites };
          setCurrentUser(updatedUser);
        } else {
          // Toggle favorite failed
          console.error('Failed to toggle favorite');
          alert('Failed to toggle favorite');
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Error toggling favorite');
      }
    } catch (error) {
      console.error('Error preparing favorite data:', error);
      alert('Error preparing favorite data');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTagClick = (tagKey) => {
    const newTags = tags.map(tag => {
      if (tag.key === tagKey) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });
    setTags(newTags);
    const selectedTypes = newTags.filter(tag => tag.selected).map(tag => tag.label);
    setSelectedTypes(selectedTypes);
  };

  const handleClearFilters = () => {
    // Reset all tags to unselected
    const resetTags = tags.map(tag => ({ ...tag, selected: false }));
    setTags(resetTags);
    // Reset selected types
    setSelectedTypes([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setCity('');
    setRating('');
  };

  const calculateOverallRating = (service) => {
    const serviceReviews = reviews.filter(review => review.serviceID === service.id);

    if (serviceReviews.length === 0) return 0;

    const totalStars = serviceReviews.reduce((acc, curr) => acc + curr.stars, 0);

    return totalStars / serviceReviews.length;
  };

  return (
    <>
      <Box sx={{
        position: 'relative', backgroundImage: `url(./images/000-1068x534.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
        display: 'flex', width: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 300, margin: 0, zIndex: 0, marginTop: 10
      }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: "center", borderRadius: 50, borderColor: 'gray',
          borderWidth: 1, borderStyle: 'groove', width: .5, bgcolor: 'white', height: .2
        }}>
          <InputBase
            sx={{ ml: 1, flex: 1, justifyContent: 'center' }}
            placeholder="   Search for services..."
            onChange={handleChange}
            value={searchInput}
          />
          <Divider orientation="vertical" flexItem />
          <IconButton aria-label="filter" onClick={handleOpen}>
            <TuneIcon />
          </IconButton>
        </Box>
        <Stack direction="row" spacing={5} sx={{
          position: 'absolute', display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center',
          top: 185, overflowX: 'auto', color: 'white', padding: '30px'
        }}>
          {tags.map((tag) => (
            <Chip key={tag.key} label={<span style={{ fontSize: 17 }}>{tag.label}</span>} color='info' onClick={() => handleTagClick(tag.key)} sx={{
              backgroundColor: tag.selected ? '#63D2FF' : 'white',
              color: tag.selected ? 'white' : 'black',
              borderColor: 'black',
              borderWidth: '1px',
              borderStyle: 'solid',
              '&:hover': {
                backgroundColor: tag.selected ? '#63D2FF' : '#BED9D4',
              },
            }} />
          ))}
        </Stack>
      </Box>

      {/* Filter pop-up */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2.5, // Rounded corners
          }}
        >
          {/* Filter Options */}
          <Typography variant="h6" gutterBottom>
            Filter Options
          </Typography>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Tags */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <FormGroup>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag.key}
                  control={
                    <Checkbox
                      checked={tag.selected}
                      onChange={() => handleTagClick(tag.key)}
                    />
                  }
                  label={tag.label}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Divider */}
          <Divider sx={{ my: 1 }} />

          {/* Price */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <p>Price</p>
            <Box>
              <TextField type='number'
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                label='Minimum Price'
                placeholder='0'
                value={minPrice}
                style={{ width: 120 }}
                name="minPrice"
                onChange={(e) => handleNumbers(e, 'min')}
              >
              </TextField>
              <MinimizeIcon></MinimizeIcon>
              <TextField type='number'
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                label="Maximum Price"
                value={maxPrice}
                placeholder='100'
                style={{ width: 120 }}
                onChange={(e) => handleNumbers(e, 'max')}
                name="maxPrice">
              </TextField>
            </Box>
          </FormControl>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Location */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <p>City</p>
            <TextField
              label='City'
              value={city}
              fullWidth
              name="city"
              onChange={(e) => setCity(e.target.value)}
            >
            </TextField>
          </FormControl>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Rating */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <p>Rating</p>
            <TextField type='number'
              label='Rating'
              value={rating}
              fullWidth
              name="rating"
              onChange={(e) => setRating(e.target.value)}
            >
            </TextField>
          </FormControl>


          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              color: 'action.disabled',
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>


      <ImageList id='services' cols={4} gap={10} sx={{ width: 1, height: 0.5, borderRadius: '10px' }}>
        {filterServices().map((service) => (
          <ImageListItem key={service.id} sx={{ position: 'relative' }}>
            {service.image ? (
              <img
                src={`/images/vendor/${service.id}.png`}
                alt={service.name}
                style={{
                  fontFamily: "Georgia, sans-serif",
                  width: "100%",
                  height: "250px",
                  objectFit: "fit",
                  objectPosition: "center",
                  marginBottom: "8px",
                  borderRadius: '10px',
                  border: "2px solid black"
                }}
              />
            ) : (
              <img
                src={`/images/placeholder.png`}
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
            {currentUser && (
              <IconButton
                aria-label={`favorite ${service.name}`}
                onClick={() => toggleFavorite(currentUser.id, service)}
                sx={{
                  position: 'absolute',
                  top: '2.5px',
                  right: '2.5px',
                  color: currentUser.favorites.some(fav => fav.id === service.id) ? 'red' : 'black'
                }}
              >
                {currentUser.favorites.some(fav => fav.id === service.id) ? (
                  <FavoriteIcon sx={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon sx={{ color: 'white', stroke: 'black', strokeWidth: 2 }} />
                )}
              </IconButton>
            )}
            <ImageListItemBar
              sx={{ backgroundColor: '#F0F0F0', borderRadius: '5px 5px 5px 5px' }}
              title={
                <span style={{ fontFamily: "Arial-Black, sans-serif", padding: 5, textAlign: 'center', fontSize: 20 }}>
                  <b><Link href={`/service/${service.id}`}>{service.name}</Link></b>
                </span>
              }
              subtitle={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <span style={{ fontFamily: "Georgia, sans-serif", textAlign: 'center', padding: 5, fontSize: 15 }}><b>Type:</b> {service.type.name}</span><br />
                    <span style={{ fontFamily: "Georgia, sans-serif", textAlign: 'center', padding: 5, fontSize: 15 }}><b>Price:</b> ${service.minPrice} - ${service.maxPrice}</span><br />
                    <span style={{ fontFamily: "Georgia, sans-serif", padding: 5, textAlign: 'center', fontSize: 15 }}><b>Location:</b> {service.address}</span>
                  </Box>
                  <Box sx={{ position: 'absolute', top: '5px', right: '10px', display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ verticalAlign: 'middle', color: '#FFD700', stroke: 'black', strokeWdith: 2 }} />
                    <span style={{ fontFamily: "Georgia, sans-serif", paddingLeft: 5, fontSize: 20 }}>{calculateOverallRating(service).toFixed(1)} ({reviews.filter(review => review.serviceID === service.id).length})</span>
                  </Box>
                </Box>
              }
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  )
}
