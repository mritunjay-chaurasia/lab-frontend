import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
let baseURL = String(rawBase).replace(/\/+$/, '');
if (!/\/api$/.test(baseURL)) {
  baseURL = `${baseURL}/api`;
}

const clientApi = axios.create({ baseURL });

export default clientApi;


