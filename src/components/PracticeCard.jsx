import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Collapse, FormControlLabel, IconButton, Menu, MenuItem, Switch, Tooltip, Typography } from "@mui/material";
import { getPractice, handleUpdatePractice, deletePractice } from "../api/PracticeApi";
import { getTypeColor } from "../layouts/Colors";
import ExpandMore from './functions/ExpandMore';
import { PracticesContext } from './contexts/PracticesContext';
import { useContext, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';


const PracticeCard = ({ practice, formattedDate, done, setLocationFilter, setTypeFilter, setInfo }) => {

    const { practices, setPractices } = useContext(PracticesContext);
    const { getPractices } = useContext(PracticesContext);
    const [anchorEl, setAnchorEl] = useState(false);
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

    const FilterLink = ({ onClick, label, value }) => (
        <Typography
            component='span'
            sx={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
            }}
            onClick={() => onClick(value)}>
            {label}
        </Typography>
    );

    const filterType = (filterValue) => {
        setTypeFilter(filterValue);
        setInfo(`Näytetään harjoitukset tyypille ${filterValue}`);
        setLocationFilter(0);
    };

    const filterLocation = (filterValue) => {
        console.log("filter" + filterValue);
        setLocationFilter(filterValue);
        setInfo(`Näytetään harjoitukset sijainnissa ${filterValue}`);
        setTypeFilter(0);
    };

    const handleChangeDone = async (event, id) => {
        const checked = event.target.checked;
        try {
            const updateData = {
                columnName: 'done',
                newValue: checked ? 1 : 0,
                id: id
            };
            await handleUpdatePractice(updateData);
            const response = await getPractice(id);
            const updatedPractice = response.data;
            setPractices(prevList => prevList.map(item => item.id === id ? updatedPractice : item));
        } catch (error) {
            console.error('Virhe päivittäessä harjoitusta: ', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePractice(id);
            getPractices();
        } catch (error) {
            console.error('Virhe poistaessa harjoitusta: ', error);
        }
    };

    const handleDeleteMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{
            width: 315,
            bgcolor: getTypeColor(practice.done ? 'done' : practice.typeId)[100]
        }}>
            <CardHeader
                avatar={
                    <Tooltip title={practice.typeName}>
                        <Avatar sx={{ bgcolor: getTypeColor(practice.typeId)[500] }} aria-label='typeAvatar'>
                            {practice.typeName.charAt(0)}
                        </Avatar>
                    </Tooltip>
                }
                action={
                    <IconButton
                        aria-label="deleteMenu"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                        aria-controls={open ? 'delete-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}>
                        <MenuIcon />
                    </IconButton>
                }
                title={practice.description}
                subheader={formattedDate}
            />
            <Menu
                anchorEl={anchorEl}
                id="delete-menu"
                open={Boolean(anchorEl)}
                onClose={handleDeleteMenuClose}
                onClick={handleDeleteMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleDelete(practice.id)} sx={{ color: red[900] }}>
                    <DeleteIcon /> Poista
                </MenuItem>
            </Menu>
            <CardMedia
                component='img'
                height='315'
                image={practice.image || `src/assets/pics/defaultpics/${practice.typeId}.jpg`}
                alt={`${practice.typeName} kuva`}
                title={practice.typeName}
                sx={{ ...(done && { opacity: .4 }) }}
            />
            <CardContent>
                <Typography variant='body2' color='text.secondary'>
                    <FilterLink
                        onClick={filterType}
                        label={practice.typeName}
                        value={practice.typeId}
                    /><br />
                    <FilterLink
                        onClick={filterLocation}
                        label={practice.location}
                        value={practice.locationId}
                    />
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={done}
                            onChange={(event) => handleChangeDone(event, practice.id)}
                            size="small" />}
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


export default PracticeCard;