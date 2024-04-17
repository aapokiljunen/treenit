import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchPractises = () => {
    return axios.get(`${API_URL}/practices`);
};
