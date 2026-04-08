# Inventory Search & Management System

## 📌 Overview
This project is a full-stack inventory system that allows users to:
- Search products (Part A)
- Manage suppliers and inventory using a database (Part B)

---

## 🚀 Features

### 🔍 Part A: Search API
- Search by product name (case-insensitive)
- Filter by category
- Filter by price range (min/max)
- Handles invalid inputs and empty results

---

### 🗄️ Part B: Database APIs

#### Tables:
**Suppliers**
- id
- name
- city

**Inventory**
- id
- supplier_id (FK)
- product_name
- quantity
- price

#### APIs:
- `POST /supplier` → Add supplier
- `POST /inventory` → Add inventory item
- `GET /inventory` → Get all inventory
- `GET /inventory-summary` → Inventory grouped by supplier

---

## 🧠 Search Logic
- Uses in-memory array filtering
- Applies multiple filters sequentially
- Case-insensitive string matching using `.toLowerCase()`

---

## ⚡ Performance Improvement
For large datasets:
- Use database indexing on `product_name`, `category`, and `price`
- Move search logic to SQL queries instead of in-memory filtering

---

## 🗃️ Database Choice
Used **PostgreSQL (SQL)** because:
- Strong relational support
- Enforces data integrity (foreign keys, constraints)
- Efficient for structured data and joins

---

## 📈 Optimization Suggestion
- Add index on:
  ```sql
  CREATE INDEX idx_supplier_id ON inventory(supplier_id);