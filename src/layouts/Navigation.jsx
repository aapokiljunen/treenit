import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Link, Outlet } from 'react-router-dom';

export default function Navigation() {

     return (
        <Box>

            <Outlet />
        </Box>
    )
};

