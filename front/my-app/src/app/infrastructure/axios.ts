import axios from 'axios';

const instance = axios.create();
export const baseUrl = 'http://localhost:3000';

export default instance;
