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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [tags, setTags] = useState([
    { key: 'tag1', label: 'Venue', selected: false },
    { key: 'tag2', label: 'Entertainment', selected: false },
    { key: 'tag3', label: 'Catering', selected: false },
    { key: 'tag4', label: 'Production', selected: false },
    { key: 'tag5', label: 'Decoration', selected: false },
    // Add more tags as needed
  ]);
  const [services, setServices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchInput, setSearchInput] = useState("")

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

  const filterServices = () => {
    let filteredServices = services;
    if (selectedTypes.length > 0) {
      filteredServices = filteredServices.filter(service => selectedTypes.includes(service.type.name));
    }
    filteredServices = filteredServices.filter(service => (service.minPrice >= minPrice && service.maxPrice <= maxPrice));
    if (searchInput != "") {
      filteredServices = filteredServices.filter(service => 
        {const name = service.name.toLowerCase();
          return name.includes(searchInput.toLowerCase())})
    }
    return filteredServices;
  };


  // Opening filter pop-up
  const [open, setOpen] = useState(false);

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
  };

  return (
    <>
      <Box sx={{
        position: 'relative', backgroundImage: `url(https://images.unsplash.com/photo-1554228422-b8d4e6b3fa1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
        display: 'flex', width: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 300, margin: 0, zIndex: 0
      }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: "center", borderRadius: 50, borderColor: 'gray',
          borderWidth: 1, borderStyle: 'groove', width: .5, bgcolor: 'white', height: .2
        }}>
          <InputBase
            sx={{ ml: 1, flex: 1, justifyContent: 'center' }}
            placeholder="Search for vendors..."
            onChange={handleChange}
            value={searchInput}
          />
          <Divider orientation="vertical" flexItem />
          <IconButton aria-label="filter" onClick={handleOpen}>
            <TuneIcon />
          </IconButton>
        </Box>
        <Stack direction="row" spacing={1} sx={{
          position: 'absolute', display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center',
          top: 185, overflowX: 'auto', color: 'white', padding: '10px'
        }}>
          {tags.map((tag) => (
            <Chip key={tag.key} label={<span style={{ color: 'white' }}>{tag.label}</span>} color='info' onClick={() => handleTagClick(tag.key)}
              variant={tag.selected ? 'filled' : 'outlined'} />
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
              <TextField
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                label='Minimum Price'
                placeholder='0'
                value={minPrice}
                style={{ width: 120 }}
                name="minPrice"
                onChange={(e) => setMinPrice(e.target.value)}
              >
              </TextField>
              <MinimizeIcon></MinimizeIcon>
              <TextField
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                autoWidth
                label="Maximum Price"
                value={maxPrice}
                placeholder='100'
                style={{ width: 120 }}
                onChange={(e) => setMaxPrice(e.target.value)}
                name="maxPirce">
              </TextField>
            </Box>
          </FormControl>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Location */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <p>Location</p>
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
          <ImageListItem key={service.id}>
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
            <ImageListItemBar
              sx={{ backgroundColor: '#F0F0F0', borderRadius: '5px 5px 5px 5px' }}
              title={<span style={{ padding: 5, textAlign: 'center' }}><b><Link href={`/service/${service.id}`}>{service.name}</Link></b></span>}
              subtitle={<div>
                <span style={{ textAlign: 'center', padding: 5 }}><b>Type:</b> {service.type.name}</span><br />
                <span style={{ textAlign: 'center', padding: 5 }}><b>Price:</b> ${service.minPrice} - ${service.maxPrice}</span><br />
                <span style={{ padding: 5, textAlign: 'center' }}><b>Location:</b> {service.address}</span>
              </div>}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  )
}
