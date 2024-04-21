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

export const addLocation = async (newLocation) => {
    try {
        const response = await axios.post(`${API_URL}/location/add`, newLocation);
        console.log(response.data); 
    } catch (error) {
        console.error('Error adding practice:', error);
        throw error;
    }
};