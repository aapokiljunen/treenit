import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, styled } from "@mui/material";
import { useContext, useState } from "react";
import { getPractice, handleUpdatePractice } from "../api/PracticeApi";
import { getTypeColor } from "../layouts/Colors";
import Sample from './PracticeCalendar';
import { PracticesContext } from './PracticesContext';
import PracticeCard from './PracticeCard';

function PracticeList() {

    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [info, setInfo] = useState('');
    const [expandedStates, setExpandedStates] = useState([]);

    const { practices, setPractices } = useContext(PracticesContext);



    const clearFilters = () => {
        setTypeFilter('');
        setLocationFilter('');
        setInfo('');
    };

    const ControlPanel = () => {
        return (
            "hello"
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
                                    expandedStates={expandedStates}
                                    setExpandedStates={setExpandedStates}
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