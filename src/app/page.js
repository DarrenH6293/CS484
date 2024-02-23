'use client'
import Image from 'next/image'
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
import Paper from '@mui/material/Paper';
import { Chip, Stack, Modal, Typography, FormControl, InputLabel, Select, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';




const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const itemData = [
  {name: 'Vendor 1', image: 'https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVuZG9yc3xlbnwwfHwwfHx8MA%3D%3D',
   minPrice: 100, maxPrice: 500, location: 'Location 1'},
  {name: 'Vendor 2', image: 'https://images.unsplash.com/photo-1481669624812-c47721341026?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVuZG9yc3xlbnwwfHwwfHx8MA%3D%3D',
   minPrice: 300, maxPrice: 600, location: 'Location 2'},
   {name: 'Vendor 3', image: 'https://images.unsplash.com/photo-1620095198790-2f663d67677d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmVuZG9yc3xlbnwwfHwwfHx8MA%3D%3D',
   minPrice: 100, maxPrice: 800, location: 'Location 3'},
   {name: 'Vendor 4', image: 'https://images.unsplash.com/photo-1534683251650-3fd64cd1561a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmVuZG9yc3xlbnwwfHwwfHx8MA%3D%3D',
   minPrice: 50, maxPrice: 300, location: 'Location 4'},
   {name: 'Vendor 5', image: 'https://images.unsplash.com/photo-1525294065345-1708669da7b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZlbmRvcnN8ZW58MHx8MHx8fDA%3D',
   minPrice: 100, maxPrice: 200, location: 'Location 5'},
   {name: 'Vendor 6', image: 'https://plus.unsplash.com/premium_photo-1686464778950-5f9c3ea99769?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZlbmRvcnN8ZW58MHx8MHx8fDA%3D',
   minPrice: 500, maxPrice: 1000, location: 'Location 6'},
   {name: 'Vendor 7', image: 'https://images.unsplash.com/photo-1621491405839-8841dce73023?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHZlbmRvcnN8ZW58MHx8MHx8fDA%3D',
   minPrice: 800, maxPrice: 1000, location: 'Location 7'},
   {name: 'Vendor 8', image: 'https://images.unsplash.com/photo-1610596677104-e8967f878371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHZlbmRvcnN8ZW58MHx8MHx8fDA%3D',
   minPrice: 100, maxPrice: 200, location: 'Location 8'},
]



export default function Home() {
  const [tags, setTags] = useState([
    { key: 'tag1', label: 'Catering', selected: false },
    { key: 'tag2', label: 'Venue', selected: false },
    { key: 'tag3', label: 'Entertainment', selected: false },
    { key: 'tag4', label: 'Production', selected: false },
    { key: 'tag5', label: 'Decoration', selected: false },
    // Add more tags as needed
  ]);

  // Opening filter pop-up
const [open, setOpen] = useState(false);

const handleOpen = () => {
  setOpen(true);
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
  };
  return (
    <>
    <Box sx={{position:'relative', backgroundImage: `url(https://images.unsplash.com/photo-1554228422-b8d4e6b3fa1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition:'center',
              display: 'flex', width: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 300, margin: 0, zIndex: 0}}>
      <Box  sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent:"center", borderRadius: 50, borderColor: 'gray', 
                  borderWidth: 1, borderStyle: 'groove', width: .5, bgcolor: 'white', height:.2}}>
      <InputBase
        sx={{ ml: 1, flex: 1, justifyContent:'center' }}
        placeholder="Search for vendors..."
        inputProps={{ 'aria-label': 'search for vendors'}}
      />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton aria-label="filter" onClick={handleOpen}>
          <TuneIcon />
        </IconButton>
      </Box>
      <Stack direction="row" spacing={1} sx={{ position:'absolute', display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', 
        top: 185, overflowX: 'auto', color: 'white', padding: '10px'}}>
        {tags.map((tag) => (
          <Chip key={tag.key} label={<span style={{color:'white'}}>{tag.label}</span>} color='info' onClick={() => handleTagClick(tag.key)}
              variant={tag.selected ? 'filled' : 'outlined'}/>
        ))}
    </Stack>
    </Box>

    <Modal // Filter pop-up
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

    {/* Price */}
    <FormControl fullWidth sx={{ my: 1 }}>
      <p>Price</p>
    </FormControl>

    {/* Divider */}
    <Divider sx={{ my: 2 }} />

    {/* Tags */}
    <FormControl fullWidth sx={{ my: 1 }}>
      <p>Tags</p>
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
      <Button variant="outlined" color="secondary">
        Clear Filters
      </Button>
      <Button variant="contained" color="primary" onClick={handleClose}>
        Confirm
      </Button>
    </Box>
  </Box>
</Modal>


    <ImageList cols={4} gap={10} sx={{ width: 1, height: .5 }}>
      {itemData.map((item) => (
        <ImageListItem key={item.image}>
          <img
            srcSet={`${item.image}?w=250&h=300&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.image}?w=250&h=300&fit=crop&auto=format`}
            alt={item.name}
            loading="lazy"
          />
          <ImageListItemBar sx={{ backgroundColor: '#F0F0F0' }}
            title={<span style={{  padding: 1,textAlign: 'center'}}><b>{item.name}</b></span>}
            subtitle={<div> <span style={{color: 'green', textAlign: 'center'}}> <b>Price:</b> ${item.minPrice} - ${item.maxPrice} </span> <br/>
                            <span><b>Location:</b> {item.location}</span> </div>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
    </>
  )
}
