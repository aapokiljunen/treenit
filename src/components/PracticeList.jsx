import { Box, Button, Container, Fab, FormControlLabel, Grid, IconButton, Modal, Paper, Switch, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import PracticeCard from './PracticeCard';
import { PracticesContext } from './contexts/PracticesContext';
import AddPracticeForm from "./AddPracticeForm";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import '../assets/css/Styles.css'
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import PracticeCalendar from "./PracticeCalendar";
import FormatDate from "./functions/FormatDate";

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [info, setInfo] = useState('');
    const { calendarValue } = useContext(PracticeCalendarContext);
    const { practices } = useContext(PracticesContext);
    const [showGone, setShowGone] = useState(false);
    const [showDone, setShowDone] = useState(true);
    const gridRef = useRef(null);

    const clearFilters = () => {
        setTypeFilter('');
        setLocationFilter('');
        setInfo('');
    };
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const findDaysPractice = () => {
        const cV = FormatDate(calendarValue);
        console.log(cV);
        const practice = practices.find(p => p.date === cV);
        console.log(practice)
        let id;
        if (practice) {
            id = practice.id;
        } else {
            id = 0;
        }
        if (id) {
            console.log(id)
            return Number(id)
        }
        return -1;
    };

    //Tämä scrollaus on täysin chatgpt:n kanssa tehty, että tätä ei varsinaisesti varmaan kuulu koulutyöhön arvioida. 
    //Sinällään kyllä hemmetin tyytyväinen olen kun sain pitkän taistelun jälkeen toimimaan

    const scrollToSelectedCard = () => {
        const cardIndex = findDaysPractice();
        if (cardIndex !== -1) {
            const gridElement = gridRef.current;
            console.log(gridElement);
            if (gridElement) {
                const selectedGridItem = gridElement.querySelector(`[data-key="${cardIndex}"] .MuiCard-root`);
                console.log(selectedGridItem);
                if (selectedGridItem) {
                    selectedGridItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectedGridItem.classList.add('highlight-effect');
                    setTimeout(() => {
                        selectedGridItem.classList.remove('highlight-effect');
                    }, 1500);
                }
            }
        }

    };

    useEffect(() => {
        scrollToSelectedCard();
    }, [calendarValue]);

    return (
        <Box sx={{ padding: 2 }}>
            <PracticeCalendar />
            <Container
                aria-label='control-panel'
                sx={{
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    borderRadius: '4px',
                    width: 315,
                    marginLeft: 0,
                    marginBottom: 2,
                    paddingLeft: '1px'
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={showDone}
                            onChange={() => setShowDone(!showDone)}
                            size="large" />}
                    label='Suoritetut'
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={showGone}
                            onChange={() => setShowGone(!showGone)}
                        />}
                    label='Menneet'
                />
            </Container>
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
            <Grid ref={gridRef} container spacing={4}>
                {practices.map((practice, index) => {
                    const showType = typeFilter.length === 0 || practice.typeName === typeFilter;
                    const showLocation = locationFilter.length === 0 || practice.location === locationFilter;
                    const date = new Date(practice.date);
                    const formattedDate = date.toLocaleDateString('fi-FI')
                    const done = practice.done != 0;
                    const dateToday = new Date();

                    if (showType && showLocation && (showGone || date >= dateToday) && (showDone || !done)) {
                        return (
                            <Grid item key={practice.id} data-key={practice.id}>
                                <PracticeCard
                                    practice={practice}
                                    formattedDate={formattedDate}
                                    done={done}
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