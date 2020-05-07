import axios from 'axios';
const token = localStorage.getItem('compreAqui@token');

const api = axios.create({
    baseURL: 'http://localhost:3002/',
    headers: { token }
})

export default api;