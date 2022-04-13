import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

// Sets default URL (just in case I put it for axios library)
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
const isDevelopment = process.env.NODE_ENV === 'production';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

api.interceptors.request.use(config => {
    if (!config.removeAuthToken) {
        if (isDevelopment) {
            console.log('Adding auth token.', config)
        }
        const token = store.state.auth.JWTToken;
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
    },
    error => {
        if (isDevelopment) {
            console.error('Interceptor Sending error', error)
        }
        return Promise.reject(error)
    });

api.interceptors.response.use(response => {
    if (isDevelopment) {
        console.log('Response succesful:', response)
    }
        return response
    },
    error => {
        if (isDevelopment) {
            console.error('Response Showing error:', error.response)
        }
        return Promise.reject(error)
    },
);

Vue.prototype.$axios = api;
Vue.prototype.$http = api;

export default api
