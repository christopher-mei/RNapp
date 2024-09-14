// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://clever-peace-production.up.railway.app/', // Replace with your FastAPI server URL
});

export default api;