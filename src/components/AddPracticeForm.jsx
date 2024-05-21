import AddBoxIcon from '@mui/icons-material/AddBox';
import { Box, Button, FormControlLabel, IconButton, MenuItem, Modal, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { addPractice, addImage } from "../api/PracticeApi";
import { fetchPracticeTypes } from "../api/PracticeTypeApi";
import PracticeCalendar from "./PracticeCalendar";
import { LocationsContext } from "./contexts/LocationsContext";
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { PracticesContext } from './contexts/PracticesContext';
import FormatDate from './functions/FormatDate';
import AddLocationForm from './AddLocationForm';
import CloseIcon from '@mui/icons-material/Close';

function AddPracticeForm() {
    const [practice, setPractice] = useState({
        description: '',
        notes: '',
        date: '',
        image: null,
        done: 0,
        locationId: 0,
        typeId: 0,
    });
    const [info, setInfo] = useState('')
    const [practiceTypes, setPracticeTypes] = useState();
    const { calendarValue } = useContext(PracticeCalendarContext);
    const { getPractices } = useContext(PracticesContext);
    const { locations } = useContext(LocationsContext);
    const [openModal, setOpenModal] = useState(false);
    const [weekly, setWeekly] = useState(false);
    const [newImage, setNewImage] = useState(null);

    const handleDate = () => {
        setPractice({ ...practice, date: FormatDate(calendarValue) });
    }

    console.log("practi", practice)

    useEffect(() => {
        if (practice.date !== '') {
            handleAdd();
        }
    }, [practice.date]);

    const handleAdd = async () => {
        if (!practice.description || !practice.date || practice.typeId == 0 || practice.locationId == 0) {
            setInfo('Kenttä tyhjä. Ei voida lisätä tapahtumaa');
        } else {
            try {
                if(newImage) {
                    const formData = new FormData();
                    formData.append('image', newImage);
                    const response = await addImage(formData);
                    setInfo('Ladataan kuvaa')
                }
                setInfo('')
                if (weekly) {
                    for (let i = 0; i < 10; i++) {
                        const newDate = new Date(practice.date);
                        newDate.setDate(newDate.getDate() + 7 * i);
                        const formattedDate = FormatDate(newDate);
                        await addPractice({...pracice, date: formattedDate});
                    };

                    setInfo(`Lisättiin viikottain toistuva harjoitus ${practice.description}`);
                } else {
                    await addPractice(practice);
                    setPractice({
                        description: '',
                        notes: '',
                        date: '',
                        image: null,
                        done: 0,
                        locationId: 1,
                        typeId: 0
                    });
                    setInfo(`Lisättiin ${practice.description} `);
                }
                getPractices();
            } catch (error) {
                console.error('Virhe lisättäessä tapahtumaa: ', error);
                setInfo(`Virhe lisättäessä tapahtumaa: ${practice.description}`);
            }
        };
    }

    const handleChange = (e) => {
        setPractice({ ...practice, [e.target.name]: e.target.value });
        setInfo('');
    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        setPractice({...practice, 'image': file.name })
        setNewImage(file);
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

    const handleClose = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        getPracticeTypes();
    }, []);

    return (
        <Box sx={{ padding: 5 }}>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby='overlay-title'
            >
                <Box className="modalContent">
                    <IconButton
                        variant='contained'
                        onClick={handleClose}
                        sx={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                    <AddLocationForm />
                </Box>
            </Modal>
            <Stack spacing={2} sx={{ width: 500 }}>
                <Typography variant="h5">Lisää uusi harjoitus</Typography>
                <TextField
                    label="Kuvaus"
                    name="description"
                    value={practice.description}
                    onChange={(e) => handleChange(e)}
                    inputProps={{ maxLength: 25 }}
                    size="small"
                />
                <Select
                    name="typeId"
                    value={practice.typeId}
                    onChange={handleChange}
                    size="small"
                >
                    <MenuItem value={0} disabled>
                        Valitse harjoitustyyppi
                    </MenuItem>
                    {practiceTypes?.map((type, index) => (
                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                    ))}
                </Select>
                <Box
                    name="location-container"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Select
                        name="locationId"
                        value={practice.locationId}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <MenuItem value={0} disabled>
                            Valitse sijainti
                        </MenuItem>
                        {locations?.map((location, index) => (
                            <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                        ))}
                    </Select>
                    <IconButton
                        color='primary'
                        aria-label='add'
                        size='large'
                        onClick={() => setOpenModal(true)}
                    >
                        <AddBoxIcon />
                    </IconButton>
                </Box>
                <TextField
                    multiline
                    label="Huomioita"
                    name="notes"
                    value={practice.notes}
                    onChange={(e) => handleChange(e)}
                    minRows={3}
                    size="small"
                />
                <PracticeCalendar />
                <TextField 
                    type='file'
                    onChange={handleImage}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={weekly}
                            onChange={() => setWeekly(!weekly)}
                            size="large" />}
                    label='Viikottain toistuva'
                />
                <Button
                    variant="contained"
                    onClick={handleDate}
                    size="small"
                >
                    Lisää harjoitus
                </Button>
                <p style={{ color: 'red', marginBottom: 0 }}>{info}</p>
            </Stack >
        </Box >
    );
}

export default AddPracticeForm;