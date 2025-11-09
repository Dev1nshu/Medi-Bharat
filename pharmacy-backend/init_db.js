import pool from "./db.js"; // Import the database connection

const createTables = async () => {
  try {
    // Create table for medicines
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        manufacturer VARCHAR(100),
        price DECIMAL(10, 2),
        quantity INT
      );
    `);

    // Create table for customers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        phone VARCHAR(15),
        email VARCHAR(100)
      );
    `);

    // Create table for orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES customers(id),
        medicine_id INT REFERENCES medicines(id),
        quantity INT,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    pool.end(); // close connection
  }
};

createTables();
