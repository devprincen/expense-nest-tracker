import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("expensenest_token"));
    const [customer, setCustomer] = useState(() => {
        const store = localStorage.getItem("expensenest_token");
        return store ? JSON.parse(store) : null;
    });

    function login(newToken, customerData) {
        setToken(newToken);
        setCustomer(customerData);
        localStorage.setItem("expensenest_token", newToken);
        localStorage.setItem("expensenest_customer", JSON.stringify(customerData));
    }

    function logout() {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem("expensenest_token");
        localStorage.removeItem("expensenest_customer");
    }

    // Updates the logged-in customer's budget/income/status locally and
    // tries to persist it via PUT /api/customer/updateCustomer/{id}.
    // NOTE: as of now, that backend endpoint doesn't actually save anything
    // yet (it just returns a string) — see customersApi.js for details.
    async function updateCustomerProfile(update) {

    }

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{ token, customer, isAuthenticated, login, logout, updateCustomerProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}