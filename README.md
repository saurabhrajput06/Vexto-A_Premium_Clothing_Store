# Vexto – Premium Clothing Store

Vexto is a high-performance, full-stack premium clothing e-commerce platform built using the MERN stack. Designed with a decoupled architecture, it features a highly responsive React frontend and a production-ready, secure Node.js/Express backend. The application supports dual-user dashboards (Buyers and Sellers), dynamic cart and inventory management, and secure third-party payment integration.

## 🚀 Live Links & Repositories
- **Live Demo:** [vexto-frontend.onrender.com](https://vexto-frontend.onrender.com)
- **Backend API:** [vexto-backend.onrender.com](https://vexto-backend.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & HTTP-Only Cookies
- **Payment Gateway:** Razorpay API
- **Deployment:** Render (Frontend Static Site & Backend Web Service)

---

## ✨ Core Features

### 👤 Role-Based Access Control (RBAC)
- **Authentication Workflows:** Secure Login, Signup, and Google OAuth integrations using JWT.
- **Dual Dashboards:** Separate user experiences and state logic tailored specifically for **Buyers** and **Sellers**.

### 🛍️ Advanced Shopping Experience
- **Dynamic Cart Lifecycle:** Supports granular product variant adjustments (size, color selection) with synchronized wishlist actions.
- **Persistent Sessions:** State hydration managed smoothly using Axios interceptors and secure cross-domain credential tracking.

### 📊 Seller Inventory Control
- **Product Management:** Complete CRUD functionality for sellers to easily publish products, adjust multi-variant stock levels, and track inventory.
- **Dynamic Dashboard:** Real-time visibility into active listings and store metadata.

### 💳 Secure Transactions & Feedback
- **Razorpay Integration:** Client-side order creation paired with strict server-side signature verification to prevent fraudulent transactions.
- **Review Engine:** Structured user feedback loop allowing buyers to rate and review individual items, updating global product metrics instantly.

---

## 🔒 Security & Optimization Highlights

- **Cross-Domain Session Handling:** Configured strict production-grade CORS matrices and explicit cookie parameters (`sameSite: "none"`, `secure: true`) ensuring robust authentication between decoupled cloud servers.
- **Production Performance:** Fully resolved asynchronous memory leaks, optimized React render trees, and eliminated linter bottlenecks (`exhaustive-deps`) to secure a clean, error-free production build.

---

## ⚙️ Installation & Local Setup

To run this project locally, follow these steps:

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas Database URI

### 1. Clone the Repository
```bash
git clone [https://github.com/saurabhrajput06/Vexto-A_Premium_Clothing_Store.git](https://github.com/saurabhrajput06/Vexto-A_Premium_Clothing_Store.git)
cd Vexto-A_Premium_Clothing_Store



2. Backend Setup  
Navigate to the backend directory:  

Bash
cd Backend
Install dependencies:  

Bash
npm install
3. Frontend Setup  
Open a new terminal and navigate to the frontend directory:  

Bash
cd Frontend
Install dependencies:  

Bash
npm install
