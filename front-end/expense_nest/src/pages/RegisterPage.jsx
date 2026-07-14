import React, { useState } from "react";
import { registerRequest } from "../api/authApi";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
};

export default function RegisterPage({ onSwitchToLogin, onRegisterSuccess }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
        if (serverError) setServerError("");
    }

    function validate() {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
        if (!form.password.trim()) newErrors.password = "Password is required";
        else if (form.password.length < 6) newErrors.password = "At least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleClear() {
        setForm(emptyForm);
        setErrors({});
        setServerError("");
    }

    // POST /api/auth/register
    // Backend returns a plain string message, not a token. The user logs in
    // separately afterwards.
    async function handleAddCustomer(e) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError("");
        try {
            await registerRequest({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            handleClear();
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Registration failed. Please try again.";
            setServerError(typeof msg === "string" ? msg : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page-shell">
            <div className="auth-ref-strip">
                <div className="auth-ref-strip-text">
                    <strong>Already registered?</strong>
                    If you already have an account, go straight to the login page.
                </div>
                <button className="btn-ref-strip" onClick={onSwitchToLogin}>
                    Go to Login
                    <i className="ti ti-arrow-right" aria-hidden="true"></i>
                </button>
            </div>

            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-icon">
                        <i className="ti ti-leaf" aria-hidden="true"></i>
                    </div>
                    <div className="brand-name">Expense Nest</div>
                </div>

                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Start tracking your daily expenses today</p>

                {serverError && (
                    <div className="error-banner">
                        <i className="ti ti-alert-circle" aria-hidden="true"></i>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleAddCustomer}>
                    <div className="form-grid">
                        <div className={`field ${errors.firstName ? "field-error" : ""}`}>
                            <label>First name</label>
                            <input
                                type="text"
                                placeholder="Prince"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                autoFocus
                            />
                            {errors.firstName && <span className="field-error-msg">{errors.firstName}</span>}
                        </div>
                        <div className={`field ${errors.lastName ? "field-error" : ""}`}>
                            <label>Last name</label>
                            <input
                                type="text"
                                placeholder="Sharma"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                            />
                            {errors.lastName && <span className="field-error-msg">{errors.lastName}</span>}
                        </div>
                        <div className={`field ${errors.email ? "field-error" : ""}`} style={{ gridColumn: "1 / -1" }}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="name@email.com"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                            {errors.email && <span className="field-error-msg">{errors.email}</span>}
                        </div>
                        <div className={`field ${errors.password ? "field-error" : ""}`} style={{ gridColumn: "1 / -1" }}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />
                            {errors.password && <span className="field-error-msg">{errors.password}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>
                            <i className="ti ti-eraser" aria-hidden="true"></i>
                            Clear
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <i className="ti ti-user-plus" aria-hidden="true"></i>
                                    Add Customer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
