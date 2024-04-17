import { Box, Button, Grid, List, ListItem, ListItemText, Card, Typography, CardHeader, Avatar, IconButton, CardMedia, Tooltip, CardContent, CardActions, ToggleButton, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { handleUpdatePractice, fetchPractises, getPractice } from "../service/Api";
import { blueGrey, lightBlue, orange, red, yellow } from "@mui/material/colors";

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [info, setInfo] = useState('');
    const [practices, setPractices] = useState([]);

    const typeColors = {
        1: lightBlue,
        2: red,
        3: blueGrey,
        4: yellow,
        5: orange,
        'done': 'secondary.main',
    };

    const getTypeColor = (type) => {
        return typeColors[type] || 'secondary';
    }

    const getPractices = async () => {
        try {
            const practices = await fetchPractises();
            setPractices(practices.data);
        } catch (error) {
            console.error('Virhe harjoitustietojen hakemisessa:', error);
        }
    }
    const filterType = (filterValue) => {
        setTypeFilter(filterValue);
        setInfo(`Näytetään harjoitukset tyypille ${filterValue}`);
        setLocationFilter('');
    };

    const filterLocation = (filterValue) => {
        setLocationFilter(filterValue);
        setInfo(`Näytetään harjoitukset sijainnissa ${filterValue}`);
        setTypeFilter('');
    };

    const clearFilters = () => {
        setTypeFilter('');
        setLocationFilter('');
        setInfo('');
    }

    const FilterLink = ({ onClick, label, value }) => (
        <Typography component='span' sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => onClick(value)}>
            {label}
        </Typography>
    );

    const handleChangeDone = async (event, id) => {
        const checked = event.target.checked;
        try {
            const updateData = {columnName: 'done', newValue: checked ? 1 : 0, id: id};
            await handleUpdatePractice(updateData);
            const response = await getPractice(id);
            const updatedPractice = response.data;
            setPractices(prevList => prevList.map(item => item.id === id ? updatedPractice : item));
        } catch (error) {
            console.error('Virhe päivittäessä harjoitusta: ', error);
        }
    }

    useEffect(() => {
        getPractices();
    }, []);

    if (practices.length === 0) {
        return (
            <Typography variant='body1' align='center'>
                Ei näytettäviä harjoituksia
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
                {practices.map((practice, index) => {
                    const showType = typeFilter.length === 0 || practice.type === typeFilter;
                    const showLocation = locationFilter.length === 0 || practice.location === locationFilter;
                    const date = new Date(practice.date);
                    const formattedDate = date.toLocaleDateString('fi-FI')
                    const done = practice.done == 0 ? false : true;

                    if (showType && showLocation) {
                        return (
                            <Grid item key={practice.id}>
                                <Card sx={{ maxWidth: 300, bgcolor: getTypeColor(practice.done ? 'done' : practice.typeId)[100] }}>
                                    <CardHeader
                                        avatar={
                                            <Tooltip title={practice.typeName}>
                                                <Avatar sx={{ bgcolor: getTypeColor(practice.typeId)[500] }} aria-label='typeAvatar'>
                                                    {practice.typeName.charAt(0)}
                                                </Avatar>
                                            </Tooltip>
                                        }
                                        title={practice.description}
                                        subheader={formattedDate}
                                    />

                                    <CardMedia
                                        component='img'
                                        height='300'
                                        image={practice.image || `src/assets/pics/defaultpics/${practice.typeId}.jpg`}
                                        alt={`${practice.typeName} kuva`}
                                        title={practice.typeName}
                                    />

                                    <CardContent>
                                        <Typography variant='body2' color='text.secondary'>
                                            <FilterLink onClick={filterType} label={practice.typeName} value={practice.typeName} /><br />
                                            <FilterLink onClick={filterLocation} label={practice.location} value={practice.location} />
                                        </Typography>
                                    </CardContent>

                                    <CardActions disableSpacing>
                                        <FormControlLabel
                                            control={<Switch checked={done} onChange={() => handleChangeDone(event, practice.id)} />}
                                            label='Suoritettu'
                                        />
                                    </CardActions>

                                </Card>
                            </Grid>
                        );
                    } else {
                        return null;
                    }
                })}
            </Grid>
            {(typeFilter.length > 0 || locationFilter.length > 0) &&
                <div><Button sx={{ marginTop: 2 }} variant='contained' onClick={clearFilters}>Tyhjennä suodattimet</Button></div>
            }

            
        </Box >
    );
}

export default PracticeList;