import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://auth-service1-bkdhfbh9a3a2g4ba.canadacentral-01.azurewebsites.net/api/v1', // replace with your backend URL
});

export default instance;