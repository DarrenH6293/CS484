'use client'
import Image from 'next/image'
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TuneIcon from '@mui/icons-material/Tune';

export default function Home() {
  return (
    <>
    <Box sx={{backgroundImage: `url('https://images.unsplash.com/photo-1546449982-a01eedcc37c0?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFydHklMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition:'center',
              display: 'flex', width: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 300, margin: 0, zIndex: 0}}>
      <Box  sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent:"center", borderRadius: 50, borderColor: 'gray', 
                  borderWidth: 1, borderStyle: 'groove', width: .5, bgcolor: 'white'}}>
      <InputBase
        sx={{ ml: 1, flex: 1, justifyContent:'center' }}
        placeholder="Search for vendors..."
        inputProps={{ 'aria-label': 'search for vendors'}}
      />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton aria-label="filter">
          <TuneIcon />
        </IconButton>
      </Box>
    </Box>

    </>
  )
}
