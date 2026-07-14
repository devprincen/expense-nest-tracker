import React, { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import CollapsibleFormCard from "../components/CollapsibleFormCard";
import { useAuth } from "../context/AuthContext";
import { fetchCategories } from "../api/categoriesApi";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionsApi";

// Current datetime in "YYYY-MM-DDTHH:mm" format for datetime-local input
const nowStr = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

function buildEmptyForm(defaultCategoryId) {
  return {
    categoryId: defaultCategoryId || "",
    amount: "",
    comment: "",
    date: nowStr(),
    type: "DEBIT",
  };
}

// Format LocalDateTime string from backend for display
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export default function TransactionsPage({ focusedCategory, onClearFocus }) {
  const { customer } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(buildEmptyForm(focusedCategory?.id));
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setLoadError("");
      try {
        const [txnData, categoriesData] = await Promise.all([
          // Pass customerId so backend returns only this customer's transactions
          fetchTransactions(customer?.id),
          fetchCategories(),
        ]);
        if (isMounted) {
          setTransactions(txnData);
          setCategories(categoriesData);
        }
      } catch (err) {
        if (isMounted) setLoadError("Could not load transactions from the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [customer?.id]);

  const myCategories = useMemo(() => {
    if (!customer) return [];
    return categories.filter(
      (c) => String(c.customerId).toLowerCase() === String(customer.id).toLowerCase()
    );
  }, [categories, customer]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.categoryId) newErrors.categoryId = "Select a category";
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = "Enter a valid amount";
    if (!form.date) newErrors.date = "Pick a date and time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleStartAdd() {
    setEditingId(null);
    setForm(buildEmptyForm(focusedCategory?.id));
    setErrors({});
    setFormOpen(true);
  }

  function handleStartEdit(txn) {
    setEditingId(txn.id);
    // Convert backend datetime to datetime-local input format
    const dateVal = txn.date ? txn.date.slice(0, 16) : nowStr();
    setForm({
      categoryId: String(txn.categoryId),
      amount: String(txn.amount),
      comment: txn.comment || "",
      date: dateVal,
      type: txn.type,
    });
    setErrors({});
    setFormOpen(true);
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        customerId: customer?.id,
        categoryId: form.categoryId,
        amount: Number(form.amount),
        comment: form.comment.trim(),
        // Send as ISO datetime string — backend LocalDateTime will parse it
        date: form.date + ":00",
        type: form.type,
      };
      if (editingId) {
        const updated = await updateTransaction(editingId, payload);
        setTransactions((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await createTransaction(payload);
        setTransactions((prev) => [created, ...prev]);
      }
      setForm(buildEmptyForm(focusedCategory?.id));
      setErrors({});
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      setErrors({ form: "Could not save transaction. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(buildEmptyForm(focusedCategory?.id));
    setErrors({});
    setFormOpen(false);
    setEditingId(null);
  }

  async function handleDelete(id) {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  }

  function getCategoryName(categoryId) {
    const cat = categories.find(
      (c) => String(c.id).toLowerCase() === String(categoryId).toLowerCase()
    );
    return cat ? cat.categoryName : "Unknown";
  }

  const baseList = useMemo(() => {
    if (!focusedCategory) return transactions;
    return transactions.filter(
      (t) => String(t.categoryId).toLowerCase() === String(focusedCategory.id).toLowerCase()
    );
  }, [transactions, focusedCategory]);

  const filtered = useMemo(() => {
    return baseList
      .filter((t) => {
        const catName = getCategoryName(t.categoryId).toLowerCase();
        const matchesSearch =
          catName.includes(search.toLowerCase()) ||
          (t.comment || "").toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "All" || t.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [baseList, search, typeFilter, categories]);

  const totalCredit = baseList.filter((t) => t.type === "CREDIT").reduce((s, t) => s + Number(t.amount), 0);
  const totalDebit = baseList.filter((t) => t.type === "DEBIT").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            {focusedCategory
              ? <><strong>{focusedCategory.categoryName}</strong> ke transactions</>
              : "Every credit and debit, logged in one place"}
          </p>
        </div>
        <div className="page-stats">
          <div className="stat-pill">
            <span className="stat-label">Credit</span>
            <span className="stat-value" style={{ color: "var(--green-600)" }}>
              ₹{totalCredit.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Debit</span>
            <span className="stat-value" style={{ color: "var(--coral-600)" }}>
              ₹{totalDebit.toLocaleString("en-IN")}
            </span>
          </div>
          <button className="btn btn-primary" onClick={handleStartAdd} style={{ alignSelf: "center" }}>
            <i className="ti ti-plus" aria-hidden="true"></i>
            Add transaction
          </button>
        </div>
      </div>

      {focusedCategory && (
        <div className="error-banner" style={{ background: "var(--blue-50)", color: "var(--blue-700)", marginBottom: 16 }}>
          <i className="ti ti-filter" aria-hidden="true"></i>
          Filtered: <strong>{focusedCategory.categoryName}</strong>
          <button className="btn-icon-ghost" style={{ marginLeft: "auto" }} onClick={() => onClearFocus && onClearFocus()}>
            Clear filter <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>
      )}

      <CollapsibleFormCard
        title={editingId ? "Edit transaction" : "Add new transaction"}
        icon={editingId ? "ti-pencil" : "ti-receipt-2"}
        isOpen={formOpen}
        onToggle={() => (formOpen ? handleCancel() : setFormOpen(true))}
      >
        {errors.form && (
          <div className="error-banner">
            <i className="ti ti-alert-circle" aria-hidden="true"></i>
            {errors.form}
          </div>
        )}
        <div className="form-grid">
          <div className="field">
            <label>Customer ID</label>
            <input type="text" value={customer?.id || ""} disabled />
          </div>

          {focusedCategory ? (
            <div className="field">
              <label>Category</label>
              <input type="text" value={focusedCategory.categoryName} disabled />
            </div>
          ) : (
            <div className={`field ${errors.categoryId ? "field-error" : ""}`}>
              <label>Category</label>
              <select value={form.categoryId} onChange={(e) => handleChange("categoryId", e.target.value)}>
                <option value="">Select category</option>
                {myCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="field-error-msg">{errors.categoryId}</span>}
            </div>
          )}

          <div className={`field ${errors.amount ? "field-error" : ""}`}>
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="500"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              autoFocus
            />
            {errors.amount && <span className="field-error-msg">{errors.amount}</span>}
          </div>

          <div className={`field ${errors.date ? "field-error" : ""}`}>
            <label>Date &amp; time</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && <span className="field-error-msg">{errors.date}</span>}
          </div>

          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Comment</label>
            <input
              type="text"
              placeholder="Weekly grocery run at BigBasket"
              value={form.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <><i className="ti ti-loader-2 spin" aria-hidden="true"></i> Saving...</>
            ) : (
              <><i className="ti ti-device-floppy" aria-hidden="true"></i> {editingId ? "Update transaction" : "Save transaction"}</>
            )}
          </button>
        </div>
      </CollapsibleFormCard>

      {loadError && (
        <div className="error-banner">
          <i className="ti ti-alert-circle" aria-hidden="true"></i>
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
          <p>Loading transactions...</p>
        </div>
      ) : (
        <DataTable
          columns={["Transaction ID", "Category", "Amount", "Type", "Comment", "Date & Time", "Actions"]}
          rows={filtered}
          searchTerm={search}
          onSearchChange={setSearch}
          emptyIcon="ti-receipt-off"
          emptyText="No transactions yet — add your first one above"
          filterSlot={
            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All types</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
            </select>
          }
          renderRow={(t) => (
            <tr key={t.id}>
              <td>
                <span className="id-chip" style={{ fontSize: 11 }}>
                  {String(t.id).slice(0, 8).toUpperCase()}
                </span>
              </td>
              <td>{getCategoryName(t.categoryId)}</td>
              <td className={t.type === "CREDIT" ? "amount-credit" : "amount-debit"}>
                {t.type === "CREDIT" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
              </td>
              <td>
                <span className={`type-chip ${t.type === "CREDIT" ? "type-credit" : "type-debit"}`}>
                  <i className={`ti ${t.type === "CREDIT" ? "ti-arrow-down-left" : "ti-arrow-up-right"}`} aria-hidden="true"></i>
                  {t.type === "CREDIT" ? "Credit" : "Debit"}
                </span>
              </td>
              <td className="comment-cell">{t.comment || "—"}</td>
              <td style={{ whiteSpace: "nowrap", fontSize: 12.5 }}>{formatDateTime(t.date)}</td>
              <td>
                <div className="row-actions">
                  <button className="btn-icon-ghost" onClick={() => handleStartEdit(t)} title="Edit">
                    <i className="ti ti-pencil" aria-hidden="true"></i>
                  </button>
                  <button className="btn-danger-ghost" onClick={() => handleDelete(t.id)} title="Delete">
                    <i className="ti ti-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}