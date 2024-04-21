import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import LocationsMap from './LocationsMap';
import { ClickMarkerContext, } from "./contexts/ClickMarkerContext";
import { addLocation } from "../api/LocationApi";
import { LocationsContext } from './contexts/LocationsContext';

function AddLocationForm() {
    const [location, setLocation] = useState({
        name: '',
        latitude: null,
        longitude: null,
    });
    const [info, setInfo] = useState('');
    const { clickMarker} = useContext(ClickMarkerContext);
    const { getLocations } = useContext(LocationsContext);

    const handleAdd = async () => {
        if (!location.name || !location.latitude || !location.longitude) {
            setInfo('Kenttä tyhjä. Ei voida lisätä sijaintia');
        } else {
            try {
                await addLocation(location);
                setLocation({
                    name: '',
                    latitude: null,
                    longitude: null,
                });
                setInfo(`Lisättiin ${location.name} `);
                getLocations();
            } catch (error) {
                console.error('Virhe lisättäessä sijaintia: ', error);
            }
        };
    }

    const handleChange = (e) => {
        setLocation({ ...location, [e.target.name]: e.target.value });
        setInfo('');
    }

    useEffect(() => {
        if (clickMarker) {
            setLocation({ ...location, longitude: clickMarker.lng, latitude: clickMarker.lat });

        }
        console.log(location)
    }, [clickMarker]);


    return (
        <Box sx={{ padding: 5 }}>
            <Stack spacing={2} sx={{ width: 500 }}>
                <Typography variant="h5">Lisää uusi paikka</Typography>
                <TextField
                    label="Paikan nimi"
                    name="name"
                    value={location.name}
                    onChange={(e) => handleChange(e)}
                    inputProps={{ maxLength: 25 }}
                    size="small"
                />
                <LocationsMap />
                <Button
                    variant="contained"
                    onClick={handleAdd}
                    size="small"
                >
                    Lisää sijainti
                </Button>
                <p style={{ color: 'red', marginBottom: 0 }}>{info}</p>
            </Stack >
        </Box >
    );
}

export default AddLocationForm;