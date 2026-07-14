import api from "./axiosConfig";

// GET /api/transaction?customerId={id}
// Passing customerId as query param so backend returns only this
// customer's transactions, not everyone's.
export async function fetchTransactions(customerId) {
  const params = customerId ? { customerId } : {};
  const response = await api.get("/api/transaction", { params });
  return response.data;
}

// POST /api/transaction
// Backend expects: { customerId, categoryId, amount, comment, date, type }
// date should be sent as "YYYY-MM-DDTHH:mm:ss" (LocalDateTime format)
// type must be exactly "CREDIT" or "DEBIT"
export async function createTransaction(payload) {
  const response = await api.post("/api/transaction", payload);
  return response.data;
}

// PUT /api/transaction/{id}
export async function updateTransaction(id, payload) {
  const response = await api.put(`/api/transaction/${id}`, payload);
  return response.data;
}

// DELETE /api/transaction/{id}
export async function deleteTransaction(id) {
  await api.delete(`/api/transaction/${id}`);
}