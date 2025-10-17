const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Simple In-memory database simulation
let medicineStock = [
  { id: 1, name: "Paracetamol", qty: 100, price: 1.5 },
  { id: 2, name: "Amoxicillin", qty: 50, price: 2.5 },
  { id: 3, name: "Ibuprofen", qty: 75, price: 1.2 },
];
let salesHistory = [];
let nextMedicineId = 4;
let nextSaleId = 1;

// --- Medicine CRUD Endpoints ---

// GET /medicines
app.get("/medicines", (req, res) => {
  res.json(medicineStock);
});

// POST /medicines (Add)
app.post("/medicines", (req, res) => {
  const { name, qty, price } = req.body;
  const newMedicine = { id: nextMedicineId++, name, qty, price };
  medicineStock.push(newMedicine);
  res.status(201).json(newMedicine);
});

// PUT /medicines/:id (Update)
app.put("/medicines/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = medicineStock.findIndex((m) => m.id === id);
  if (index !== -1) {
    medicineStock[index] = { ...medicineStock[index], ...req.body, id };
    res.json(medicineStock[index]);
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
});

// DELETE /medicines/:id
app.delete("/medicines/:id", (req, res) => {
  const id = parseInt(req.params.id);
  medicineStock = medicineStock.filter((m) => m.id !== id);
  res.status(204).send();
});

// --- Sales Endpoints ---

// GET /sales
app.get("/sales", (req, res) => {
  res.json(salesHistory);
});

// POST /sales/process-order
app.post("/sales/process-order", (req, res) => {
  const { customerName, prescriptionFile, cart } = req.body;

  if (cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  let orderTotal = 0;
  const soldItems = [];

  // 1. Process cart and update stock
  for (const item of cart) {
    const medIndex = medicineStock.findIndex((m) => m.id === item.medicineId);

    if (medIndex === -1 || medicineStock[medIndex].qty < item.qty) {
      return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
    }

    // Update stock
    medicineStock[medIndex].qty -= item.qty;

    // Calculate total
    const itemTotal = item.qty * item.price;
    orderTotal += itemTotal;
    
    // Record sold item details
    soldItems.push({
      medicineId: item.medicineId,
      name: item.name,
      qty: item.qty,
      price: item.price,
      total: itemTotal
    });
  }

  // 2. Record sale
  const newOrder = {
    id: nextSaleId++,
    customerName,
    prescriptionFile,
    items: soldItems,
    orderTotal,
    date: new Date().toISOString(),
  };

  salesHistory.push(newOrder);

  // 3. Respond
  res.status(201).json({ 
    message: "Order processed successfully", 
    order: newOrder 
  });
});

/**
 * DELETE /sales/:id
 * Removes a sale record and restores the sold items back to medicine stock.
 */
app.delete("/sales/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const saleIndex = salesHistory.findIndex((s) => s.id === id);

  if (saleIndex === -1) {
    return res.status(404).json({ message: "Sale record not found" });
  }

  const deletedSale = salesHistory[saleIndex];

  // 1. Restore Stock
  for (const item of deletedSale.items) {
    const medIndex = medicineStock.findIndex((m) => m.id === item.medicineId);
    if (medIndex !== -1) {
      medicineStock[medIndex].qty += item.qty;
    }
  }

  // 2. Remove Sale from History
  salesHistory.splice(saleIndex, 1);

  res.status(204).send();
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
