import React, { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import CollapsibleFormCard from "../components/CollapsibleFormCard";
import { useAuth } from "../context/AuthContext";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../api/categoriesApi";

const emptyForm = {
  categoryName: "",
  categoryDescription: "",
  categoryType: "INCOME",
};

const TYPE_OPTIONS = ["INCOME", "EXPENSE"];

export default function CategoriesPage({ onOpenCategory }) {
  const { customer } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // GET /api/category
  // NOTE: your current backend returns ALL categories from every customer
  // (CategoryServices.getAllCategories has no filtering). Until you add
  // customer-based filtering server-side, this filters client-side to
  // show only the logged-in customer's own categories.
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await fetchCategories();
        console.log("Categories from backend:", data);
        console.log("Logged-in customer id:", customer?.id);
        if (isMounted) setCategories(data);
      } catch (err) {
        if (isMounted) setLoadError("Could not load categories from the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

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
    if (!form.categoryName.trim()) newErrors.categoryName = "Category name is required";
    if (!form.categoryDescription.trim()) newErrors.categoryDescription = "Add a short description";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleStartAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(true);
  }

  function handleStartEdit(category) {
    setEditingId(category.id);
    setForm({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      categoryType: category.categoryType,
    });
    setErrors({});
    setFormOpen(true);
  }

  // POST /api/category (includes customerId from the logged-in customer)
  // or PUT /api/category/{id}
  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        customerId: customer.id,
        categoryName: form.categoryName.trim(),
        categoryDescription: form.categoryDescription.trim(),
        categoryType: form.categoryType,
      };
      if (editingId) {
        const updated = await updateCategory(editingId, payload);
        setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await createCategory(payload);
        setCategories((prev) => [created, ...prev]);
      }
      setForm(emptyForm);
      setErrors({});
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      setErrors({ form: "Could not save category. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
    setEditingId(null);
  }

  // DELETE /api/category/{id}
  async function handleDelete(id, e) {
    e.stopPropagation();
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  }

  const filtered = useMemo(() => {
    return myCategories.filter((c) => {
      const matchesSearch = `${c.categoryName} ${c.categoryDescription}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || c.categoryType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [myCategories, search, typeFilter]);

  const typeBadgeClass = (type) => (type === "INCOME" ? "status-active" : "status-inactive");

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Group your transactions into income and expense categories</p>
        </div>
        <div className="page-stats">
          <div className="stat-pill">
            <span className="stat-label">Total</span>
            <span className="stat-value">{myCategories.length}</span>
          </div>
          <button className="btn btn-primary" onClick={handleStartAdd} style={{ alignSelf: "center" }}>
            <i className="ti ti-plus" aria-hidden="true"></i>
            Add category
          </button>
        </div>
      </div>

      <CollapsibleFormCard
        title={editingId ? "Edit category" : "Add new category"}
        icon={editingId ? "ti-pencil" : "ti-category-plus"}
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
            <input type="text" value={customer.id} disabled />
          </div>
          {editingId && (
            <div className="field">
              <label>Category ID</label>
              <input type="text" value={editingId} disabled />
            </div>
          )}
          <div className={`field ${errors.categoryName ? "field-error" : ""}`}>
            <label>Category name</label>
            <input
              type="text"
              placeholder="Groceries"
              value={form.categoryName}
              onChange={(e) => handleChange("categoryName", e.target.value)}
              autoFocus
            />
            {errors.categoryName && <span className="field-error-msg">{errors.categoryName}</span>}
          </div>
          <div className="field">
            <label>Category type</label>
            <select value={form.categoryType} onChange={(e) => handleChange("categoryType", e.target.value)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t === "INCOME" ? "Income" : "Expense"}</option>
              ))}
            </select>
          </div>
          <div className={`field ${errors.categoryDescription ? "field-error" : ""}`} style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <input
              type="text"
              placeholder="Daily and weekly grocery shopping"
              value={form.categoryDescription}
              onChange={(e) => handleChange("categoryDescription", e.target.value)}
            />
            {errors.categoryDescription && <span className="field-error-msg">{errors.categoryDescription}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="ti ti-device-floppy" aria-hidden="true"></i>
                {editingId ? "Update category" : "Save category"}
              </>
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
          <p>Loading categories...</p>
        </div>
      ) : (
        <DataTable
          columns={["Category ID", "Category Name", "Category Type", "Description", "Actions"]}
          rows={filtered}
          searchTerm={search}
          onSearchChange={setSearch}
          emptyIcon="ti-category"
          emptyText="No categories yet — add your first one above"
          filterSlot={
            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          }
          renderRow={(c) => (
            <tr
              key={c.id}
              className="clickable-row"
              onClick={() => onOpenCategory && onOpenCategory(c)}
              title="View transactions for this category"
            >
              <td><span className="id-chip">#{String(c.id).slice(0, 8)}</span></td>
              <td style={{ fontWeight: 600 }}>{c.categoryName}</td>
              <td>
                <span className={`status-chip ${typeBadgeClass(c.categoryType)}`}>
                  {c.categoryType === "INCOME" ? "Income" : "Expense"}
                </span>
              </td>
              <td className="comment-cell">{c.categoryDescription}</td>
              <td>
                <div className="row-actions">
                  <button className="btn-icon-ghost" onClick={(e) => { e.stopPropagation(); handleStartEdit(c); }} title="Edit">
                    <i className="ti ti-pencil" aria-hidden="true"></i>
                  </button>
                  <button className="btn-danger-ghost" onClick={(e) => handleDelete(c.id, e)} title="Delete">
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
