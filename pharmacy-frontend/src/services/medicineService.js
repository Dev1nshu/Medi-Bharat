const API_URL = "http://localhost:5000/medicines";
const SALES_URL = "http://localhost:5000/sales";

export async function getMedicines() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function addMedicine(med) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
  return await res.json();
}

export async function updateMedicine(id, med) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
  return await res.json();
}

export async function deleteMedicine(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// --- REMOVED: old sellMedicine function --- 
// The backend no longer supports the single-item sell endpoint

// NEW: Process a multi-item order (the basket/cart)
export async function processOrder(orderData) {
  const res = await fetch("http://localhost:5000/sales/process-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Failed to process order');
  }
  
  return await res.json();
}

export async function getSales() {
  const res = await fetch(SALES_URL);
  return await res.json();
}
