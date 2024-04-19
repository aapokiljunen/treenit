import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material";
import { useContext, useState } from "react";
import PracticeCard from './PracticeCard';
import { PracticesContext } from './contexts/PracticesContext';
import AddPracticeForm from "./AddPracticeForm";
import CloseIcon from '@mui/icons-material/Close';
import AddBoxIcon from '@mui/icons-material/AddBox';
import '../assets/css/Styles.css'

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [info, setInfo] = useState('');
    const [expandedStates, setExpandedStates] = useState([]);
    const { practices } = useContext(PracticesContext);

    const clearFilters = () => {
        setTypeFilter('');
        setLocationFilter('');
        setInfo('');
    };

    const ControlPanel = () => {
        return (
            "hello"
        )
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 2 }}>

            <IconButton color='primary' onClick={handleOpen} size="large">
                <AddBoxIcon fontSize="inherit"/>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='overlay-title'
                aria-describedby='overlay-description'
            >
                <Box className="modalContent">
                    <IconButton variant='contained' onClick={handleClose} sx={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                    <AddPracticeForm />
                </Box>
            </Modal>
            <Grid container spacing={4}>
                {practices.map((practice, index) => {
                    const showType = typeFilter.length === 0 || practice.typeName === typeFilter;
                    const showLocation = locationFilter.length === 0 || practice.location === locationFilter;
                    const date = new Date(practice.date);
                    const formattedDate = date.toLocaleDateString('fi-FI')
                    const done = practice.done != 0;

                    if (showType && showLocation) {
                        return (
                            <Grid item key={practice.id}>
                                <PracticeCard
                                    practice={practice}
                                    formattedDate={formattedDate}
                                    done={done}
                                    expandedStates={expandedStates}
                                    setExpandedStates={setExpandedStates}
                                />
                            </Grid>
                        );
                    }
                })}
            </Grid>
            {
                (typeFilter.length > 0 || locationFilter.length > 0) &&
                <div><Button sx={{ marginTop: 2 }} variant='contained' onClick={clearFilters}>Tyhjennä suodattimet</Button></div>
            }
        </Box >
    );
};

export default PracticeList;