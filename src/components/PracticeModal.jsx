import AddBoxIcon from '@mui/icons-material/AddBox';
import { Box, Button, FormControlLabel, IconButton, MenuItem, Modal, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { addPractice, getPractice} from "../api/PracticeApi";
import { fetchPracticeTypes } from "../api/PracticeTypeApi";
import PracticeCalendar from "./PracticeCalendar";
import { LocationsContext } from "./contexts/LocationsContext";
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { PracticesContext } from './contexts/PracticesContext';
import FormatDate from './functions/FormatDate';
import AddLocationForm from './AddLocationForm';
import CloseIcon from '@mui/icons-material/Close';

function PracticeModal(id) {
    const [practice, setPractice] = useState({});
    const [info, setInfo] = useState('')
    const [practiceTypes, setPracticeTypes] = useState();
    const { calendarValue } = useContext(PracticeCalendarContext);
    const { getPractices } = useContext(PracticesContext);
    const { locations } = useContext(LocationsContext);
    const [weekly, setWeekly] = useState(false);
    const [editOn, setEditOn] = useState(false);

    const handleDate = () => {
        setPractice({ ...practice, date: FormatDate(calendarValue) });
    }

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
                if (weekly) {
                    for (let i = 0; i < 10; i++) {
                        const newDate = new Date(practice.date);
                        newDate.setDate(newDate.getDate() + 7 * i);
                        const formattedDate = FormatDate(newDate);
                        await addPractice({ ...practice, date: formattedDate });
                    };

                    setInfo(`Lisättiin viikottain toistuva harjoitus ${practice.description}`);
                } else {
                    await addPractice(practice);
                    setPractice({
                        description: '',
                        notes: '',
                        date: '',
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

    const getPracticeTypes = async () => {
        try {
            const types = await fetchPracticeTypes();
            setPracticeTypes(types.data);
        } catch (error) {
            console.error('Virhe tyyppien hakemisessa:', error);
        }
    };

    const getPractice = async () => {
        try {
            const practice = await getPractice(id);
            setPractice(practice);
        } catch (error) {
            console.error('Virhe tyyppien hakemisessa:', error);
        }
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        getPracticeTypes();
        getPractice();
    }, []);

    return (
        <Box sx={{ padding: 5 }}>
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