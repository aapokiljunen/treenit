import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, styled } from "@mui/material";
import { blueGrey, lightBlue, orange, red, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { fetchPractises, getPractice, handleUpdatePractice } from "../api/PracticeApi";
import { getTypeColor } from "../layouts/Colors";
import Sample from './PracticeCalendar';

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [info, setInfo] = useState('');
    const [practices, setPractices] = useState([]);
    const [expandedStates, setExpandedStates] = useState([]);

    const handleExpandClick = (id) => {
        if (!expandedStates.hasOwnProperty(id)) {
            setExpandedStates(prevState => ({ ...prevState, [id]: false }));
        }
        setExpandedStates(prevStates => {
            const updatedStates = { ...prevStates };
            updatedStates[id] = !updatedStates[id];
            return updatedStates;
        });
    };

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    })); //https://mui.com/material-ui/react-card/

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
    };

    const FilterLink = ({ onClick, label, value }) => (
        <Typography component='span' sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => onClick(value)}>
            {label}
        </Typography>
    );

    const getPractices = async () => {
        try {
            const practices = await fetchPractises();
            setPractices(practices.data);
        } catch (error) {
            console.error('Virhe harjoitustietojen hakemisessa:', error);
        }
    };

    const handleChangeDone = async (event, id) => {
        const checked = event.target.checked;
        try {
            const updateData = { columnName: 'done', newValue: checked ? 1 : 0, id: id };
            await handleUpdatePractice(updateData);
            const response = await getPractice(id);
            const updatedPractice = response.data;
            setPractices(prevList => prevList.map(item => item.id === id ? updatedPractice : item));
        } catch (error) {
            console.error('Virhe päivittäessä harjoitusta: ', error);
        }
    };

    useEffect(() => {
        getPractices();
    }, []);

    if (practices.length === 0) {
        return (
            <Typography variant='body1' align='center'>
                Ei näytettäviä harjoituksia
            </Typography>
        );
    };

    const ControlPanel = () => {
        return (
            "hello"
        )
    };

    const PracticeCard = ({ practice, formattedDate, done }) => {
        return (
            <Card sx={{ width: 300, bgcolor: getTypeColor(practice.done ? 'done' : practice.typeId)[100] }}>
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
                    sx={{ ...(done && { opacity: .4 }) }}
                />
                <CardContent>
                    <Typography variant='body2' color='text.secondary'>
                        <FilterLink onClick={filterType} label={practice.typeName} value={practice.typeName} /><br />
                        <FilterLink onClick={filterLocation} label={practice.location} value={practice.location} />
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <FormControlLabel
                        control={<Switch checked={done} onChange={(event) => handleChangeDone(event, practice.id)} />}
                        label='Suoritettu'
                    />
                    <ExpandMore
                        expand={expandedStates[practice.id]}
                        onClick={() => handleExpandClick(practice.id)}
                        aria-expanded={expandedStates[practice.id]}
                        aria-label="Näytä lisää"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expandedStates[practice.id]} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph >{practice.notes}</Typography>
                    </CardContent>
                </Collapse>

            </Card>
        )
    };

    return (
        <Box sx={{ padding: 2 }}>
            <ControlPanel />
            <Sample />
            <Grid container spacing={2}>
                {practices.map((practice, index) => {
                    const showType = typeFilter.length === 0 || practice.typeName === typeFilter;
                    const showLocation = locationFilter.length === 0 || practice.location === locationFilter;
                    const date = new Date(practice.date);
                    const formattedDate = date.toLocaleDateString('fi-FI')
                    const done = practice.done != 0;

                    if (showType && showLocation) {
                        return (
                            <Grid item key={practice.id}>
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