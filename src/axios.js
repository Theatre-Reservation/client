import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8500/api/v1', // replace with your backend URL
});

export default instance;