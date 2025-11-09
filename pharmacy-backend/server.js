const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db"); // PostgreSQL connection

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// =============================
// ✅ Test Database Connection
// =============================
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ msg: "DB connected", time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "DB error" });
  }
});


// =============================
// 💊 MEDICINES TABLE ROUTES
// =============================

// ➕ Add Medicine
app.post("/medicines", async (req, res) => {
  const { name, qty, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO medicines (name, qty, price) VALUES ($1, $2, $3) RETURNING *",
      [name, qty, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ message: "Error adding medicine" });
  }
});

// 📦 Get All Medicines
app.get("/medicines", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medicines ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Error fetching medicines" });
  }
});

// ✏️ Update Medicine
app.put("/medicines/:id", async (req, res) => {
  const { id } = req.params;
  const { name, qty, price } = req.body;
  try {
    const result = await pool.query(
      "UPDATE medicines SET name=$1, qty=$2, price=$3 WHERE id=$4 RETURNING *",
      [name, qty, price, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Medicine not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating medicine:", err);
    res.status(500).json({ message: "Error updating medicine" });
  }
});

// 🗑️ Delete Medicine
app.delete("/medicines/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM medicines WHERE id=$1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ message: "Error deleting medicine" });
  }
});


// =============================
// 💰 SALES TABLE ROUTES
// =============================

// ➕ Process Order (Add Sale)
app.post("/sales/process-order", async (req, res) => {
  const { customerName, prescriptionFile, cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  const client = await pool.connect(); // create a client for transaction

  try {
    let orderTotal = 0;
    await client.query("BEGIN");

    // 1️⃣ Create sale entry
    const saleResult = await client.query(
      "INSERT INTO sales (customer_name, prescription_file, order_total) VALUES ($1, $2, $3) RETURNING id",
      [customerName, prescriptionFile, 0]
    );
    const saleId = saleResult.rows[0].id;

    // 2️⃣ Process each item in cart
    for (const item of cart) {
      const { medicineId, qty, price, name } = item;

      const medResult = await client.query(
        "SELECT * FROM medicines WHERE id=$1",
        [medicineId]
      );
      const med = medResult.rows[0];

      if (!med || med.qty < qty) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Insufficient stock for ${name}` });
      }

      // Deduct stock
      await client.query("UPDATE medicines SET qty = qty - $1 WHERE id=$2", [
        qty,
        medicineId,
      ]);

      // Add item to sale_items
      const total = qty * price;
      await client.query(
        "INSERT INTO sale_items (sale_id, medicine_id, qty, price, total) VALUES ($1, $2, $3, $4, $5)",
        [saleId, medicineId, qty, price, total]
      );

      orderTotal += total;
    }

    // 3️⃣ Update total in sales
    await client.query("UPDATE sales SET order_total=$1 WHERE id=$2", [
      orderTotal,
      saleId,
    ]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Order processed successfully", saleId, orderTotal });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error processing order:", err);
    res.status(500).json({ message: "Error processing order" });
  } finally {
    client.release();
  }
});

// 📜 Get All Sales
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Error fetching sales" });
  }
});

// 🗑️ Delete Sale
app.delete("/sales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id=$1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).json({ message: "Error deleting sale" });
  }
});


// =============================
// 🚀 Start Server
// =============================
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
