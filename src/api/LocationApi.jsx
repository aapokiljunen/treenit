import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchLocations = async () => {
    try {
        return await axios.get(`${API_URL}/location/all`);
    } catch (error)  {
        console.error('Error fetching practices:', error);
        throw error;
    }
};