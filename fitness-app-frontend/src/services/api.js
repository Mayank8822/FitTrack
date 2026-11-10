import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    // If token is missing in localStorage, check sessionStorage (where react-oauth2-code-pkce keeps it)
    if (!token || token === 'undefined' || token === 'null') {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && (key.includes('token') || key.includes('ROCP'))) {
                let val = sessionStorage.getItem(key);
                if (val) {
                    val = val.trim();
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.slice(1, -1);
                    }
                    if (val.startsWith('ey')) {
                        token = val;
                        localStorage.setItem('token', token);
                        break;
                    }
                    try {
                        const parsed = JSON.parse(val);
                        const possibleToken = parsed?.access_token || parsed?.token || parsed?.id_token;
                        if (possibleToken && possibleToken.startsWith('ey')) {
                            token = possibleToken;
                            localStorage.setItem('token', token);
                            break;
                        }
                    } catch {}
                }
            }
        }
    }

    // If userId is missing or malformed, extract it from the JWT token
    if ((!userId || userId === 'undefined' || userId === 'null') && token && token.includes('.')) {
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                userId = payload.sub || payload.id;
                if (userId) {
                    localStorage.setItem('userId', userId);
                }
            }
        } catch (e) {
            console.warn('Failed to parse userId from token in interceptor:', e);
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
export const getActivity = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

export const getCommunityFeed = () => api.get('/community/feed');
export const likeCommunityActivity = (id) => api.post(`/community/activities/${id}/like`);
export const unlikeCommunityActivity = (id) => api.delete(`/community/activities/${id}/like`);
export const commentOnCommunityActivity = (id, content) => api.post(`/community/activities/${id}/comments`, { content });
export const updateFitnessProfile = (profile) => api.put('/users/me/fitness-profile', profile);
export const getFitnessProfile = () => api.get('/users/me');
export const getMlRecommendation = (payload) => api.post('/ml/recommend', payload);
