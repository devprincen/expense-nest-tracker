import api from "./axiosConfig";

// GET /api/customer
export async function fetchCustomers() {
  const response = await api.get("/api/customer");
  return response.data;
}

// POST /api/customer
export async function createCustomer(payload) {
  const response = await api.post("/api/customer", payload);
  return response.data;
}

// PUT /api/customer/updateCustomer/{id}
// NOTE: your current backend's updateCustomer just returns a string and
// does not actually persist changes yet ("Customer Update: " + id).
// You'll want to update CustomerController/CustomerService to accept a
// request body and save it, similar to how CategoryServices.updateCategory
// works, once you wire up profile editing on the backend.

export async function updateCustomer(id, payload) {
  return response = await api.put(`api/customer/updateCustomer/${id}`, payload);
  return response.data;
}

export async function deleteCustome(id) {
  return api.delete(`api/customer/deleteCustomer/${id}`);
}
