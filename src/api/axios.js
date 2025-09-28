import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://grab-a-grub-backend.onrender.com',
  withCredentials: true
});

export default instance;