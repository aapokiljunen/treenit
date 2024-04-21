import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Collapse, Container, Fab, FormControlLabel, Grid, IconButton, MenuItem, Modal, Select, Switch, Typography } from "@mui/material";
import 'leaflet/dist/leaflet.css';
import { useContext, useEffect, useRef, useState } from "react";
import { fetchPracticeTypes } from "../api/PracticeTypeApi";
import '../assets/css/Styles.css';
import AddPracticeForm from "./AddPracticeForm";
import LocationsMap from './LocationsMap';
import PracticeCalendar from "./PracticeCalendar";
import PracticeCard from './PracticeCard';
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { PracticesContext } from './contexts/PracticesContext';
import ExpandMore from "./functions/ExpandMore";
import FormatDate from "./functions/FormatDate";

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState(0);
    const [locationFilter, setLocationFilter] = useState(0);
    const [info, setInfo] = useState('');
    const { calendarValue } = useContext(PracticeCalendarContext);
    const { practices } = useContext(PracticesContext);
    const [showGone, setShowGone] = useState(false);
    const [showDone, setShowDone] = useState(true);
    const [calendarOn, setCalendarOn] = useState(false);
    const gridRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [practiceTypes, setPracticeTypes] = useState([]);
    const [locations, setLocations] = useState([]);

    const clearFilters = () => {
        setTypeFilter(0);
        setLocationFilter(0);
        setInfo('');
    };

    const getPracticeTypes = async () => {
        try {
            const types = await fetchPracticeTypes();
            setPracticeTypes(types.data);
        } catch (error) {
            console.error('Virhe tyyppien hakemisessa:', error);
        }
    };

    const filterType = (filterValue) => {
        setTypeFilter(filterValue);
        setInfo(`Näytetään harjoitukset tyypille ${filterValue}`);
        setLocationFilter(0);
    };


    const handleClose = () => {
        setOpenModal(false);
    };

    const findDaysPractice = () => {
        const cV = FormatDate(calendarValue);
        const practice = practices.find(p => p.date === cV);
        let id;
        if (practice) {
            id = practice.id;
        } else {
            id = 0;
        }
        if (id) {
            return Number(id)
        }
        return -1;
    };

    //Tämä scrollauksen logiikka on täysin chatgpt:n visioima, ja muutenkin hinkattu sillä kuntoon,
    // että kuuluuko tätä sitten varsinaisesti koulutyöhön arvioida. 
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
                    selectedGridItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
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

    useEffect(() => {
        getPracticeTypes();
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Fab
                color='primary'
                aria-label='add'
                size='large'
                onClick={() => setOpenModal(true)}
                sx={{
                    float: 'right',
                    marginRight: 5
                }}>
                <AddIcon />
            </Fab>
            <Container
                aria-label='control-panel'
                className="control-panel"
                sx={{
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    borderRadius: '4px',
                    width: 530,
                    marginLeft: 0,
                    marginBottom: 2,
                }}
            >
                <ExpandMore
                    expand={calendarOn}
                    onClick={() => setCalendarOn(!calendarOn)}
                    aria-expanded={calendarOn}
                    aria-label="Näytä kartta"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
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
                <Select
                    name="typeFilter"
                    value={typeFilter}
                    onChange={(e) => filterType(e.target.value)}
                    size="small"
                >
                    <MenuItem value={0} disabled size="inherit">
                        Näytä harjoitustyyppi
                    </MenuItem>
                    {practiceTypes?.map((type, index) => (
                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                    ))}
                </Select>
                <Collapse className='control-panel' in={calendarOn} timeout="auto" unmountOnExit>
                    <PracticeCalendar />
                </Collapse>
            </Container>
            <Typography sx={{ paddingBottom: 2 }}>{info}</Typography>
            <Modal
                open={openModal}
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
                    const showType = practice.typeId == typeFilter || typeFilter == 0;
                    const showLocation = practice.locationId == locationFilter || locationFilter == 0;
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
                                    setLocationFilter={setLocationFilter}
                                    setTypeFilter={setTypeFilter}
                                    setInfo={setInfo}
                                />
                            </Grid>
                        );
                    }
                })}
            </Grid>
            {
                (typeFilter > 0 || locationFilter > 0) &&
                <div><Button sx={{ marginTop: 2 }} variant='contained' onClick={clearFilters}>Näytä kaikki harjoitukset</Button></div>
            }
        </Box >
    );
};

export default PracticeList;