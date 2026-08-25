import axios from 'axios';

const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // When running on remote server (e.g. Oracle Cloud VPS IP) via Nginx reverse proxy
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return `${window.location.origin}/api`;
    }
    return 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    // Fallback to sessionStorage if OAuth PKCE stored tokens there
    if (!token) {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.includes('token') && !key.includes('expire')) {
                const val = sessionStorage.getItem(key);
                if (val && val.startsWith('ey')) { // JWT format
                    token = val;
                    break;
                }
            }
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
export const registerUser = (userData) => api.post('/users/register', userData);