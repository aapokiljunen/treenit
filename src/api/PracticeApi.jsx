import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchPractises = async () => {
    try {
        return await axios.get(`${API_URL}/practice/all`);
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
        const response = await axios.post(`${API_URL}/practice/update`, updateData);
        console.log(response.data); 
    } catch (error) {
        console.error('Error updating column:', error);
        throw error;
    }
};

export const addPractice = async (newPractice) => {
    try {
        const response = await axios.post(`${API_URL}/practice/add`, newPractice);
        console.log(response.data); 
    } catch (error) {
        console.error('Error adding practice:', error);
        throw error;
    }
};

export const deletePractice = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/practice/delete/${id}`);
        console.log(response.data); 
    } catch (error) {
        console.error('Error deleting practice:', error);
        throw error;
    }
};