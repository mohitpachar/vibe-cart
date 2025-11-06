# 🛒 Mock E-Com Cart — Auth + Cart + Orders + Responsive UI

This project is a mini full-stack e-commerce cart application built with **React (frontend)** and **Node.js + Express + SQLite (backend)**.  
It includes **user authentication**, **user-specific cart**, **order history**, **theme switch**, and **responsive UI**.

---

## ✨ Features
- 🔐 **JWT Authentication** (Register/Login/Logout)
- 👤 User-specific cart stored in SQLite
- 🛍️ Add to Cart (only after login)
- ✏️ Update quantity / remove items in cart
- ✅ Checkout → Saves order → Clears cart
- 📦 Orders Page (View past orders)
- 🌗 Light / Dark mode toggle
- 🎨 Responsive UI (Mobile + Desktop)
- 🔔 Toast popup on add-to-cart
- 🔍 Product detail modal preview

---

## 🧱 Tech Stack
**Frontend:** React + Vite, CSS  
**Backend:** Node.js, Express  
**Database:** SQLite  
**Auth:** JWT + bcrypt

---

## 🏁 Run the Project

### 1️⃣ Start Backend
```bash
cd backend
npm install
npm run dev
