import { Box, Button, Grid } from "@mui/material";
import { useContext, useState } from "react";
import PracticeCard from './PracticeCard';
import { PracticesContext } from './contexts/PracticesContext';

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
        <Box sx={{ padding: 2, marginTop: 10 }}>
            <ControlPanel />
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