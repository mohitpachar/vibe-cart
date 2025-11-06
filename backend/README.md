# Vibe Cart Backend (JWT + SQLite)

## Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:4000

## Auth
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`

Use returned `token` as `Authorization: Bearer <token>` for all cart endpoints.

## Endpoints
- Public:
  - `GET /api/products`
  - `GET /api/health`
- Auth required:
  - `GET /api/cart`
  - `POST /api/cart` `{ productId, qty }`
  - `PATCH /api/cart/:id` `{ qty }`
  - `DELETE /api/cart/:id`
  - `POST /api/checkout`
