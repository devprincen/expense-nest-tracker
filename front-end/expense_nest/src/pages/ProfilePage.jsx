import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { customer, updateCustomerProfile } = useAuth();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        email: customer?.email || "",
    });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    if (!customer) {
        return (
            <div className="empty-state">
                <i className="ti ti-user-off" aria-hidden="true"></i>
                <p>No profile data found. Please log in again.</p>
            </div>
        );
    }

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaveMsg("");
    }

    async function handleSave() {
        if (!form.firstName.trim() || !form.lastName.trim()) return;
        setSaving(true);
        setSaveMsg("");
        try {
            await updateCustomerProfile({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
            });
            setSaveMsg("Profile updated successfully.");
            setEditing(false);
        } catch (err) {
            setSaveMsg("Could not save — please try again.");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setForm({
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            email: customer.email || "",
        });
        setSaveMsg("");
        setEditing(false);
    }

    const isActive = customer.status !== "DEACTIVATE";

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Profile</h1>
                    <p>Your account details</p>
                </div>
            </div>

            <div className="profile-page-card">
                {/* Avatar + Name header */}
                <div className="profile-page-top">
                    <div className="profile-page-avatar">
                        {(customer.firstName?.[0] || "").toUpperCase()}
                        {(customer.lastName?.[0] || "").toUpperCase()}
                    </div>
                    <div>
                        <div className="profile-page-name">
                            {customer.firstName} {customer.lastName}
                        </div>
                        <div className="profile-page-email">{customer.email}</div>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                        <span className={`status-chip ${isActive ? "status-active" : "status-inactive"}`}>
                            <i className={`ti ${isActive ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true"></i>
                            {isActive ? "Active" : "Deactivated"}
                        </span>
                    </div>
                </div>

                <div className="profile-page-divider" />

                {/* Fields */}
                <div className="profile-page-fields">
                    <div className="profile-field-row">
                        <div className="profile-field-label">
                            <i className="ti ti-user" aria-hidden="true"></i>
                            First name
                        </div>
                        {editing ? (
                            <input
                                className="profile-field-input"
                                type="text"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <div className="profile-field-value">{customer.firstName}</div>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field-label">
                            <i className="ti ti-user" aria-hidden="true"></i>
                            Last name
                        </div>
                        {editing ? (
                            <input
                                className="profile-field-input"
                                type="text"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                            />
                        ) : (
                            <div className="profile-field-value">{customer.lastName}</div>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field-label">
                            <i className="ti ti-mail" aria-hidden="true"></i>
                            Email
                        </div>
                        {editing ? (
                            <input
                                className="profile-field-input"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        ) : (
                            <div className="profile-field-value">{customer.email}</div>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field-label">
                            <i className="ti ti-shield-check" aria-hidden="true"></i>
                            Status
                        </div>
                        <div className="profile-field-value">
                            <span className={`status-chip ${isActive ? "status-active" : "status-inactive"}`}>
                                <i className={`ti ${isActive ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true"></i>
                                {isActive ? "Active" : "Deactivated"}
                            </span>
                        </div>
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field-label">
                            <i className="ti ti-id-badge" aria-hidden="true"></i>
                            Customer ID
                        </div>
                        <div className="profile-field-value" style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-tertiary)" }}>
                            {customer.id}
                        </div>
                    </div>
                </div>

                {saveMsg && (
                    <div
                        className="error-banner"
                        style={{
                            background: saveMsg.includes("success") ? "var(--green-50)" : "var(--coral-50)",
                            color: saveMsg.includes("success") ? "var(--green-700)" : "var(--coral-700)",
                            marginTop: 16,
                        }}
                    >
                        <i className={`ti ${saveMsg.includes("success") ? "ti-circle-check" : "ti-alert-circle"}`} aria-hidden="true"></i>
                        {saveMsg}
                    </div>
                )}

                <div className="profile-page-actions">
                    {editing ? (
                        <>
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                <i className="ti ti-x" aria-hidden="true"></i>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <><i className="ti ti-loader-2 spin" aria-hidden="true"></i> Saving...</>
                                ) : (
                                    <><i className="ti ti-device-floppy" aria-hidden="true"></i> Save changes</>
                                )}
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setEditing(true)}>
                            <i className="ti ti-pencil" aria-hidden="true"></i>
                            Edit profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}