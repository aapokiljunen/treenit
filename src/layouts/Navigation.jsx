import { Box } from "@mui/material";
import { Outlet } from 'react-router-dom';

export default function Navigation() {

     return (
        <Box>
            <Outlet />
        </Box>
    )
};

