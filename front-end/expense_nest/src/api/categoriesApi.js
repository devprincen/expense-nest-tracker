import api from "./axiosConfig";

// GET /api/category
export async function fetchCategories() {
  const response = await api.get("/api/category");
  return response.data;
}

// POST /api/category
// Backend expects: { customerId, categoryName, categoryDescription, categoryType }
// categoryType must be exactly "INCOME" or "EXPENSE" (backend enum values).
export async function createCategory(payload) {
  const response = await api.post("/api/category", payload);
  return response.data;
}

// PUT /api/category/{id}
export async function updateCategory(id, payload) {
  const response = await api.put(`/api/category/${id}`, payload);
  return response.data;
}

// DELETE /api/category/{id}
export async function deleteCategory(id) {
  await api.delete(`/api/category/${id}`);
}
