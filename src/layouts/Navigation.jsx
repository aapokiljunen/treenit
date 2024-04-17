import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import PracticeList from '../components/PracticeList';

export default function Navigation() {

    const [tab, setTab] = useState(0)

    const handleChange = (event, value) => {
        setTab(value);
    }


    return (
        <Box>
            <AppBar >
                <Tabs value={tab} onChange={handleChange} textColor='inherit'>
                    <Tab label='Treenit' icon={< HomeIcon />} />
                </Tabs>
            </AppBar>
            <Box marginTop={"100px"}>
                {tab === 0 && <PracticeList />}

            </Box>
        </Box>
    )
};

