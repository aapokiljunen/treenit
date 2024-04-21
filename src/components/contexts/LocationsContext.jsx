import { createContext, useEffect, useState } from 'react';
import { fetchLocations } from '../../api/LocationApi';
import { Typography } from '@mui/material';

const LocationsContext = createContext();


const LocationsProvider = ({ children }) => {
    const [locations, setLocations] = useState([]);

    const getLocations = async () => {
        try {
            const locations = await fetchLocations();
            setLocations(locations.data);
        } catch (error) {
            console.error('Virhe sijaintien hakemisessa:', error);
        }
    };
    
    useEffect(() => {
        getLocations();
    }, []);

    if (locations.length === 0) {
        return (
            <Typography variant='body1' align='center'>
                Ei näytettäviä harjoituksia
            </Typography>
        );
    };
    return (
        <LocationsContext.Provider value={{ locations, setLocations, getLocations }}>
            {children}
        </LocationsContext.Provider>
    );
};

export { LocationsContext, LocationsProvider };