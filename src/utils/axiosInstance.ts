import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
    baseURL: 'http://localhost:3000/'
});

// Request interceptor
instance.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

// Response interceptor
instance.interceptors.response.use(response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // if (axios.isAxiosError(error)) {
    //     const response = error.response;
    //     if (response) {
    //         console.log(response.data)
    //         toast.error(response.data.EM);
    //     }
    // }
    return error && error.response && error.response.data
        ? error.response.data : Promise.reject(error);

});

export default instance;
