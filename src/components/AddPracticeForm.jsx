import { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import PracticeCalendar from "./PracticeCalendar";
import FormatDate from './functions/FormatDate';
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { fetchPracticeTypes } from "../api/PracticeTypeApi";
import { fetchLocations } from "../api/LocationApi";
import { addPractice } from "../api/PracticeApi";
import { PracticesContext } from './contexts/PracticesContext';

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
    const { getPractices } = useContext(PracticesContext);

    const handleDate = () => {
        console.log(calendarValue);
        setPractice({ ...practice, date: FormatDate(calendarValue) });
    }

    useEffect(() => {
        if (practice.date !== '') {
            handleAdd();
        }
    }, [practice.date]);

    const handleAdd = async () => {
        if (!practice.description || !practice.date) {
            setInfo('Kenttä tyhjä. Ei voida lisätä tapahtumaa');
        } else {
            try {
                await addPractice(practice);
                setPractice({
                    description: '',
                    notes: '',
                    date: '',
                    done: 0,
                    locationId: 1,
                    typeId: 1
                });
                setInfo(`Lisättiin ${practice.description} `);
                getPractices();
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
                    {practiceTypes?.map((type, index) => (
                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                    ))}
                </Select>
                <Select
                    name="locationId"
                    value={practice.locationId}
                    onChange={handleChange}
                    size="small"
                >
                    {locations?.map((location, index) => (
                        <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                    ))}
                </Select>
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