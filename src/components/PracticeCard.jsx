import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import ExpandMore from './ExpandMore';
import { getPractice, handleUpdatePractice } from "../api/PracticeApi";
import { getTypeColor } from "../layouts/Colors";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";


// const FilterLink = ({ onClick, label, value }) => (
//     <Typography component='span' sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => onClick(value)}>
//         {label}
//     </Typography>
// );

// const filterType = (filterValue) => {
//     setTypeFilter(filterValue);
//     setInfo(`Näytetään harjoitukset tyypille ${filterValue}`);
//     setLocationFilter('');
// };

// const filterLocation = (filterValue) => {
//     setLocationFilter(filterValue);
//     setInfo(`Näytetään harjoitukset sijainnissa ${filterValue}`);
//     setTypeFilter('');
// };

// const handleChangeDone = async (event, id) => {
//     const checked = event.target.checked;
//     try {
//         const updateData = { columnName: 'done', newValue: checked ? 1 : 0, id: id };
//         await handleUpdatePractice(updateData);
//         const response = await getPractice(id);
//         const updatedPractice = response.data;
//         setPractices(prevList => prevList.map(item => item.id === id ? updatedPractice : item));
//     } catch (error) {
//         console.error('Virhe päivittäessä harjoitusta: ', error);
//     }
// };

const PracticeCard = ({ practice, formattedDate, done, expandedStates, setExpandedStates}) => {

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
        <Typography component='span' sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => onClick(value)}>
            {label}
        </Typography>
    );
    
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


export default PracticeCard;