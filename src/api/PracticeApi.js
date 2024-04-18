import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchPractises = async () => {
    try {
        return await axios.get(`${API_URL}/practices`);
    } catch (error)  {
        console.error('Error fetching practices:', error);
        throw error;
    }
};

export const getPractice = async (id) => {
    try {
        return await axios.get(`${API_URL}/practice/${id}`);
    } catch (error)  {
        console.error('Error getting a practice:', error);
        throw error;
    }
};

export const handleUpdatePractice = async (updateData) => {
    try {
        const response = await axios.post(`${API_URL}/updatePractice`, updateData);
        console.log(response.data); 
    } catch (error) {
        console.error('Error updating column:', error);
        throw error;
    }
};