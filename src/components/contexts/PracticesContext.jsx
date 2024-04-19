import { createContext, useEffect, useState } from 'react';
import { fetchPractises } from '../../api/PracticeApi';
import { Typography } from '@mui/material';

const PracticesContext = createContext();

const PracticesProvider = ({ children }) => {
    const [practices, setPractices] = useState([]);

    const getPractices = async () => {
        try {
            const practices = await fetchPractises();
            setPractices(practices.data);
        } catch (error) {
            console.error('Virhe harjoitustietojen hakemisessa:', error);
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


    return (
        <PracticesContext.Provider value={{ practices, setPractices }}>
            {children}
        </PracticesContext.Provider>
    );
};

export { PracticesContext, PracticesProvider };