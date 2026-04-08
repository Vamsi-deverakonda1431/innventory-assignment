const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Import static data (Part A)
const inventoryData = require("./data");

app.use(cors());
app.use(express.json());

/* ==============================
   HOME ROUTE
============================== */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* ==============================
   🔍 PART A: SEARCH API
============================== */
app.get("/search", (req, res) => {
  let { q, category, minPrice, maxPrice } = req.query;

  let results = inventoryData;

  // Case-insensitive search
  if (q) {
    results = results.filter(item =>
      item.product_name.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Category filter
  if (category) {
    results = results.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Price filters
  if (minPrice) {
    results = results.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(item => item.price <= Number(maxPrice));
  }

  // Invalid range
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ error: "Invalid price range" });
  }

  res.json(results);
});

/* ==============================
   🗄️ PART B: DATABASE APIs
============================== */

// ➤ POST /supplier
app.post("/supplier", async (req, res) => {
  try {
    const { name, city } = req.body;

    const result = await pool.query(
      "INSERT INTO suppliers(name, city) VALUES($1, $2) RETURNING *",
      [name, city]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ➤ POST /inventory
app.post("/inventory", async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, price } = req.body;

    // Validate supplier exists
    const supplier = await pool.query(
      "SELECT * FROM suppliers WHERE id=$1",
      [supplier_id]
    );

    if (supplier.rows.length === 0) {
      return res.status(400).json({ error: "Invalid supplier" });
    }

    // Validate rules
    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity must be >= 0" });
    }

    if (price <= 0) {
      return res.status(400).json({ error: "Price must be > 0" });
    }

    const result = await pool.query(
      `INSERT INTO inventory(supplier_id, product_name, quantity, price)
       VALUES($1, $2, $3, $4) RETURNING *`,
      [supplier_id, product_name, quantity, price]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ➤ GET /inventory
app.get("/inventory", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ➤ ⭐ GET /inventory-summary (IMPORTANT)
app.get("/inventory-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.name, SUM(i.quantity * i.price) AS total_value
      FROM suppliers s
      JOIN inventory i ON s.id = i.supplier_id
      GROUP BY s.name
      ORDER BY total_value DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* ==============================
   START SERVER
============================== */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});