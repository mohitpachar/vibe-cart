# Vibe Cart

A simple full-stack mini e-commerce application with authentication, user-specific cart, checkout, and order history.

---

## Features
- User Registration & Login (JWT + bcrypt)
- Product listing with images (served from backend `/public/images`)
- Add to Cart / Update Quantity / Remove Item
- Checkout → Creates order history
- View Past Orders
- SQLite persistent database
- Clean responsive UI (React + Vite)

---

## Project Structure
vibe-cart-auth/
│
├── backend/
│ ├── server.js
│ ├── vibe.db
│ └── public/images/ ← product images stored here
│
└── frontend/
└── src/

## 🧠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite, CSS |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Auth | JWT + bcrypt hashing |
| UI | Responsive, Mobile-friendly |

## Setup Instructions

### 1) Backend Setup
```bash
cd backend
npm install
npm run dev
Backend runs at: http://localhost:4000

2) Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

🔐 Login System Overview
Passwords are hashed using bcryptjs
JWT token is stored in localStorage
User session remains active even after refresh
Logging out removes token & user info

API Endpoints
Method	Endpoint	          Description
GET    	/api/products	      Get all products
POST	  /api/auth/register	Register new user
POST	  /api/auth/login	    Login user and receive JWT
GET	    /api/cart	          Get logged-in user's cart
POST	  /api/cart	          Add product to cart
PATCH	  /api/cart/:id	      Update product quantity
DELETE	/api/cart/:id	      Remove item from cart
POST	  /api/checkout	      Create an order from cart
GET	    /api/orders	        View user order history

Database (SQLite)
users → stores registered users
products → static seeded product list
cart → temporary user shopping cart
orders & order_items → final checkout data

Bonus Implementations
Persistent database using SQLite
Clean folder structure
Error handling for API calls
Fully modern UI animations and toast notifications



Page	    Preview
Home	    ![Login](frontend/public/screens/home.png)
Login	    ![Login](frontend/public/screens/login.png)
Cart	    ![Cart](frontend/public/screens/cart.png)
Orders	  ![Orders](frontend/public/screens/orders.png)
payment   ![Orders](frontend/public/screens/payment.png)



## 👤 Author
**Mohit Pachar**  
B.Tech CSE  
GitHub: https://github.com/mohitpachar  
LinkedIn: https://linkedin.com/in/mohit_pachar
