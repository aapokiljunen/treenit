import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchPracticeTypes= async () => {
    try {
        return await axios.get(`${API_URL}/practicetype/all`);
    } catch (error)  {
        console.error('Error fetching practices:', error);
        throw error;
    }
};