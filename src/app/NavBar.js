'use client'

import { usePathname } from 'next/navigation'
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { checkLoggedIn } from "@/lib/auth";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Box sx={{ flexGrow: 0, padding: 0, marginRight: 0, justifyContent: 'space-between', display: { xs: 'none', md: 'flex' } }}>
    </Box>
  );
}