import axios from "axios";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


//  Attach JWT token automatically to every request, if present.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("expensenest_token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.starus === 401) {
            localStorage.removeItem("expensenest_token");
            localStorage.removeItem("expensenest_customer");
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;
