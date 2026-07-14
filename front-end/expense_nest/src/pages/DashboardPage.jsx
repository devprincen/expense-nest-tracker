import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

export default function DashboardPage({ onNavigate }) {
  const { customer, updateCustomerProfile } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [budgetInput, setBudgetInput] = useState(customer?.budget ?? "");
  const [incomeInput, setIncomeInput] = useState(customer?.income ?? "");
  const [saving, setSaving] = useState(false);

  if (!customer) {
    return (
      <div className="empty-state">
        <i className="ti ti-user-off" aria-hidden="true"></i>
        <p>No profile data found. Please log in again.</p>
      </div>
    );
  }

  function startEditingProfile() {
    setBudgetInput(customer.budget ?? "");
    setIncomeInput(customer.income ?? "");
    setEditingProfile(true);
  }

  async function handleSaveProfile() {
    if (budgetInput === "" || incomeInput === "") return;
    setSaving(true);
    try {
      await updateCustomerProfile({
        budget: Number(budgetInput),
        income: Number(incomeInput),
      });
      setEditingProfile(false);
    } finally {
      setSaving(false);
    }
  }

  const isActive = customer.status !== "DEACTIVATE";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Your personal overview</p>
        </div>
      </div>

      <div className="dash-profile-card">
        <div className="dash-profile-left">
          <div className="dash-avatar-circle">{getInitials(customer.firstName, customer.lastName)}</div>
          <div>
            <div className="dash-profile-name">{customer.firstName} {customer.lastName}</div>
            <div className="dash-profile-email">{customer.email}</div>
          </div>
        </div>
        <div>
          <span className={`status-chip ${isActive ? "status-active" : "status-inactive"}`}>
            <i className={`ti ${isActive ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true"></i>
            {isActive ? "Active" : "Deactivated"}
          </span>
        </div>
      </div>

      <div className="dash-finance-card">
        <div className="dash-finance-header">
          <h2>Budget &amp; income</h2>
          {!editingProfile && (
            <button className="btn-icon-ghost" onClick={startEditingProfile} title="Edit budget and income">
              <i className="ti ti-pencil" aria-hidden="true"></i>
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="form-grid" style={{ marginTop: 6 }}>
            <div className="field">
              <label>Monthly budget (₹)</label>
              <input
                type="number"
                placeholder="25000"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label>Monthly income (₹)</label>
              <input
                type="number"
                placeholder="45000"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
              />
            </div>
            <div className="field" style={{ alignSelf: "flex-end", flexDirection: "row", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setEditingProfile(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveProfile}
                disabled={saving || budgetInput === "" || incomeInput === ""}
              >
                {saving ? (
                  <>
                    <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ti ti-check" aria-hidden="true"></i>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="dash-finance-values">
            <div className="dash-finance-stat">
              <span className="stat-label">Monthly budget</span>
              <span className="stat-value">
                {customer.budget ? `₹${Number(customer.budget).toLocaleString("en-IN")}` : "Not set"}
              </span>
            </div>
            <div className="dash-finance-stat">
              <span className="stat-label">Monthly income</span>
              <span className="stat-value">
                {customer.income ? `₹${Number(customer.income).toLocaleString("en-IN")}` : "Not set"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="dash-add-category-card" onClick={() => onNavigate && onNavigate("categories")} style={{ marginBottom: 14 }}>
        <div className="dash-add-category-left">
          <div className="dash-add-category-icon">
            <i className="ti ti-category-plus" aria-hidden="true"></i>
          </div>
          <div>
            <div className="dash-add-category-title">Add Category</div>
            <div className="dash-add-category-sub">Create a new income or expense category</div>
          </div>
        </div>
        <i className="ti ti-arrow-right" aria-hidden="true"></i>
      </div>

      <div className="dash-add-category-card" onClick={() => onNavigate && onNavigate("transactions")}>
        <div className="dash-add-category-left">
          <div className="dash-add-category-icon" style={{ background: "var(--blue-500)" }}>
            <i className="ti ti-receipt-2" aria-hidden="true"></i>
          </div>
          <div>
            <div className="dash-add-category-title">Add Transaction</div>
            <div className="dash-add-category-sub">Log a new debit or credit entry</div>
          </div>
        </div>
        <i className="ti ti-arrow-right" aria-hidden="true"></i>
      </div>
    </div>
  );
}