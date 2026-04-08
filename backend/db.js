const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventory_db",
  password: "postgres123", // change if different
  port: 5432,
});

module.exports = pool;