import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getPractice, handleUpdatePractice } from "../api/PracticeApi";
import LocationsMap from './LocationsMap';
import { LocationsContext } from "./contexts/LocationsContext";
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { PracticesContext } from './contexts/PracticesContext';
import { getTypeColor } from "../layouts/Colors";

function PracticeModal({ id }) {
    const [practice, setPractice] = useState({});
    const [info, setInfo] = useState('')
    const { getPractices } = useContext(PracticesContext);
    const [editOn, setEditOn] = useState(false);
    const date = new Date(practice.date);
    const formattedDate = date.toLocaleString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    const handleEdit = async () => {
        if (!practice.description || !practice.date || practice.typeId == 0 || practice.locationId == 0) {
            setInfo('Kenttä tyhjä. Ei voida muokata tapahtumaa');
        } else {
            try {
                const updateDesc = {
                    columnName: 'description',
                    newValue: practice.description,
                    id: id
                };
                const updateNotes = {
                    columnName: 'notes',
                    newValue: practice.notes,
                    id: id
                };
                await handleUpdatePractice(updateDesc);
                await handleUpdatePractice(updateNotes);
                await getThisPractice();
                getPractices();
                setEditOn(false);
            } catch (error) {
                console.error('Virhe päivittäessä harjoitusta: ', error);
            }
        };
    }

    const handleChange = (e) => {
        setPractice({ ...practice, [e.target.name]: e.target.value });
        setInfo('');
    }

    const handleChangeDone = async (event) => {
        const checked = event.target.checked;
        try {
            const updateData = {
                columnName: 'done',
                newValue: checked ? 1 : 0,
                id: id
            };
            await handleUpdatePractice(updateData);
            await getThisPractice();
            getPractices();
        } catch (error) {
            console.error('Virhe päivittäessä harjoitusta: ', error);
        }
    };

    const getThisPractice = async () => {
        try {
            const thisPractice = await getPractice(id);
            setPractice(thisPractice.data);
        } catch (error) {
            console.error('Virhe harjoituksen hakemisessa:', error);
        }
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    console.log(practice);


    useEffect(() => {
        getThisPractice();
    }, []);

    return (
        <Box sx={{
            padding: 5,
            bgcolor: getTypeColor(practice.typeId)[50],
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
            borderRadius: '4px',

        }}>
            <Stack spacing={1} sx={{ width: 500 }}>
                <Box
                    name="location-container"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5">{practice.typeName}</Typography>
                    <IconButton
                        color='primary'
                        aria-label='edit'
                        size='large'
                        onClick={() => setEditOn(!editOn)}
                        sx={{ float: 'right' }}
                    >
                        <EditIcon />
                    </IconButton>
                </Box>
                <Divider flexItem />
                <Typography variant="subtitle">{formattedDate}</Typography>
                <Typography>{practice.location}</Typography>
                <Divider flexItem />
                {editOn && (<TextField
                    label="Kuvaus"
                    name="description"
                    value={practice.description || ''}
                    onChange={(e) => handleChange(e)}
                    inputProps={{ maxLength: 25 }}
                    size="small"
                    sx={{bgcolor:'white'}}
                />)}
                {!editOn && <Typography sx={{ fontWeight: 'bold' }}>{practice.description}</Typography>}
                {editOn && (
                    <TextField
                        multiline
                        label="Huomioita"
                        name="notes"
                        value={practice.notes || ''}
                        onChange={(e) => handleChange(e)}
                        minRows={3}
                        size="small"
                        sx={{bgcolor:'white'}}
                    />)}
                {!editOn && <Typography>{practice.notes}</Typography>}

                {editOn && (
                    <>
                        <Button
                            variant="contained"
                            onClick={handleEdit}
                            size="small"
                        >
                            Muokkaa harjoitusta
                        </Button>
                        <p style={{ color: 'red', marginBottom: 0 }}>{info}</p>
                    </>
                )}
                {practice.locationLat &&
                    <LocationsMap
                        position={[practice.locationLat, practice.locationLong]}
                        zoom={15}
                    />
                }
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={practice.done == 1}
                            onChange={(event) => handleChangeDone(event)}
                            size="small" />}
                    label='Suoritettu'
                    sx={{ marginLeft: 3 }}
                />

            </Stack >
        </Box >
    );
}

export default PracticeModal;