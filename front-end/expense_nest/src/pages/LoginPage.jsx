import React, { useState } from "react";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleExit() {
    setForm({ email: "", password: "" });
    setErrors({});
    setServerError("");
  }

  // POST /api/auth/login -> { token, customer }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const data = await loginRequest(form.email, form.password);
      login(data.token, data.customer);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Login failed. Check your email and password.";
      setServerError(typeof msg === "string" ? msg : "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-shell">
      <div className="auth-ref-strip">
        <div className="auth-ref-strip-text">
          <strong>Don't have an account?</strong>
          Create your Expense Nest profile in seconds.
        </div>
        <button className="btn-ref-strip" onClick={onSwitchToRegister}>
          Go to Register
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to track your daily expenses</p>

        {serverError && (
          <div className="error-banner">
            <i className="ti ti-alert-circle" aria-hidden="true"></i>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={`field ${errors.email ? "field-error" : ""}`} style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              autoFocus
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          <div className={`field ${errors.password ? "field-error" : ""}`} style={{ marginBottom: 20 }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && <span className="field-error-msg">{errors.password}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleExit}>
              <i className="ti ti-x" aria-hidden="true"></i>
              Exit
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="ti ti-login-2" aria-hidden="true"></i>
                  Login
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
