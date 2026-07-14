import api from "./axiosConfig";

// POST /api/auth/register
// Backend expects: { firstName, lastName, email, password }
// Backend returns: a plain string message (e.g. "Customer Registered Successfully: ")
// NOTE: register does NOT return a token. The user must log in afterwards.
export async function registerRequest(payload) {
    const response = await api.post("/api/auth/register", (payload));
    return response.data;
}

// POST /api/auth/login
// Backend expects: { email, password }
// Backend returns: { token, customer } where customer has
// { id, firstName, lastName, email, password, budget, income, status }
export async function loginRequest(email, password) {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
}