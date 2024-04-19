import { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem, Select } from "@mui/material";
import PracticeCalendar from "./PracticeCalendar";
import FormatDate from './functions/FormatDate';
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { fetchPracticeTypes } from "../api/PracticeTypeApi";
import { fetchLocations } from "../api/LocationApi";
import { addPractice } from "../api/PracticeApi";

function AddPracticeForm() {
    const [practice, setPractice] = useState({
        description: '',
        notes: '',
        date: '',
        done: 0,
        locationId: 1,
        typeId: 1,
    });
    const [info, setInfo] = useState('')
    const [practiceTypes, setPracticeTypes] = useState();
    const [locations, setLocations] = useState();
    const { calendarValue } = useContext(PracticeCalendarContext);

    const handleDate = () => {
        setPractice({ ...practice, date: FormatDate(calendarValue) });
        handleAdd();
    }

    const handleAdd = async () => {
        if (!practice.description || !practice.date) {
            setInfo('Kenttä tyhjä. Ei voida lisätä tapahtumaa');
        } else {
            try {
                await addPractice(practice);
                setPractice({ description: '', notes: '', date: '', done: 0, locationId: 1, typeId: 1 });
                setInfo('Uusi tapahtuma lisättiin');
            } catch (error) {
                console.error('Virhe lisättäessä tapahtumaa: ', error);
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

    const getLocations = async () => {
        try {
            const locations = await fetchLocations();
            setLocations(locations.data);
        } catch (error) {
            console.error('Virhe sijaintien hakemisessa:', error);
        }
    };

    useEffect(() => {
        getPracticeTypes();
        getLocations();
    }, []);

    return (
        <Box sx={{ marginTop: 10 }}>
            <TextField
                fullWidth
                label="Kuvaus"
                name="description"
                value={practice.description}
                onChange={(e) => handleChange(e)}
                size="small"
                sx={{ marginBottom: 2 }}
            />
            <Select
                name="typeId"
                value={practice.typeId}
                onChange={handleChange}
                size="small"
                sx={{ marginBottom: 2 }}
            >
                {practiceTypes?.map((type, index) => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
            </Select><br />
            <Select
                name="locationId"
                value={practice.locationId}
                onChange={handleChange}
                size="small"
                sx={{ marginBottom: 2 }}
            >
                {locations?.map((location, index) => (
                    <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                ))}
            </Select>
            <PracticeCalendar />
            <TextField
                fullWidth
                value={FormatDate(calendarValue)}
                disabled
                size="small"
                sx={{ marginTop: 2, marginBottom: 2 }}
            />
            <TextField
                fullWidth
                multiline
                label="Huomioita"
                name="notes"
                value={practice.notes}
                onChange={(e) => handleChange(e)}
                minRows={3}
                size="small"
                sx={{ marginBottom: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleDate}
                size="small"
                sx={{ marginBottom: 1 }}
            >
                Lisää harjoitus
            </Button>
            <p style={{ color: 'red', marginBottom: 0 }}>{info}</p>
        </Box>
    );
}

export default AddPracticeForm;