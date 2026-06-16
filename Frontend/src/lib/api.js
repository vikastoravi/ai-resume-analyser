import axios from "axios"

// Determine baseURL based on environment
const baseURL = import.meta.env.MODE === 'production' 
    ? "https://skillbridge-ai-ts16.onrender.com"
    : "http://localhost:5000"

const api = axios.create({
    baseURL,
    withCredentials: true
})

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
        delete api.defaults.headers.common.Authorization
    }
}

export default api
