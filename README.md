# Pharmacy Inventory Management API

A **Next.js-based API** for managing pharmacy and customer inventory, purchases, and sales.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### ✅ Prerequisites

* Node.js
* npm (or yarn)

### 📥 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment.git
   ```

2. Navigate to the project directory:

   ```bash
   cd TapZa-Backend-Assignment
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables. Create a `.env.local` file in the root of the project and add your MongoDB connection string:

   ```env
   MONGODB_URI="your_mongodb_connection_string"
   ```

### ▶️ Running the Development Server

Start the server with:

```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📌 API Endpoints

### Inventory

* **GET** `/api/inventory` → Fetches all items from the inventory.
* **POST** `/api/inventory/add` → Adds a new medicine to the inventory.
* **GET** `/api/inventory/[id]` → Retrieves a specific medicine by its ID.
* **PUT** `/api/inventory/[id]` → Updates a specific medicine by its ID.
* **DELETE** `/api/inventory/[id]` → Deletes a specific medicine by its ID.
* **POST** `/api/inventory/purchase` → Simulates a purchase from the inventory (used by the pharmacy).

### Pharmacy

* **GET** `/api/pharmacy` → Fetches all medicines available in the pharmacy.
* **POST** `/api/pharmacy/buy` → Allows the pharmacy to buy medicines from the main inventory.
* **POST** `/api/pharmacy/sell` → Allows the pharmacy to sell medicines to a customer.
* **GET** `/api/pharmacy/[id]` → Retrieves a specific medicine in the pharmacy by ID.

### Customer

* **GET** `/api/customer` → Fetches available medicines for a customer to view.
* **POST** `/api/customer/buy` → Allows a customer to purchase medicines.
* **POST** `/api/customer-log` → Logs a customer's purchase.

---

## 🛠 Tech Stack

* **Next.js** (API Routes)
* **MongoDB** (Database) LOCAL
* **Node.js** (Runtime)

---
