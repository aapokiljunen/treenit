import { Box, Button, Grid, List, ListItem, ListItemText, Card, Typography, CardHeader, Avatar, IconButton, CardMedia, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchPractises } from "../service/Api";
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
    };

    const getTypeColor = (type) => {
        return typeColors[type] || "gray";
    }

    const getPractices = async () => {
        try {
            const practices = await fetchPractises();
            setPractices(practices.data);
        } catch (error) {
            console.error('Virhe harjoitustietojen hakemisessa:', error);
        }
    }

    useEffect(() => {
        getPractices();
    }, []);

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
        <a href='#' onClick={() => onClick(value)}>{label}</a>
    );

    if (practices.length === 0) {
        return (
            <Typography variant="body1" align="center">
                Ei näytettäviä harjoituksia
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Grid>
                <List>
                    {practices.map((practice, index) => {
                        const showType = typeFilter.length === 0 || practice.type === typeFilter;
                        const showLocation = locationFilter.length === 0 || practice.location === locationFilter;
                        const date = new Date(practice.date);
                        const formattedDate = date.toLocaleDateString('fi-FI')

                        if (showType && showLocation) {
                            return (
                                <ListItem key={index}>
                                    <Card sx={{ maxWidth: 300, bgcolor: getTypeColor(practice.typeId)[50] }}>
                                        <CardHeader
                                            avatar={
                                                <Tooltip title={practice.typeName}>
                                                    <Avatar sx={{ bgcolor: getTypeColor(practice.typeId)[500] }} aria-label="recipe">
                                                        {practice.typeName.charAt(0)}
                                                    </Avatar>
                                                </Tooltip>
                                            }
                                            title={practice.description}
                                            subheader={formattedDate}
                                        />

                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={practice.image || `src/assets/pics/defaultpics/${practice.typeId}.jpg`}
                                            alt={`${practice.typeName} kuva`}
                                            title={practice.typeName}
                                        />
                                        <FilterLink onClick={filterType} label={practice.typeName} value={practice.typeName} /><br />
                                        <FilterLink onClick={filterLocation} label={practice.location} value={practice.location} /><br />
                                        {practice.description}
                                    </Card>
                                </ListItem>
                            );
                        } else {
                            return null;
                        }
                    })}
                    {(typeFilter.length > 0 || locationFilter.length > 0) &&
                        <div><Button variant="contained" onClick={clearFilters}>Tyhjennä suodattimet</Button></div>
                    }
                </List>
            </Grid>
        </Box >
    );
}

export default PracticeList;