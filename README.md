# 📚 BookStore — MERN Stack Application

A full-featured online bookstore built with **MongoDB, Express.js, React, and Node.js**.
Browse books, search & filter, read/write reviews, add to cart, checkout, track orders,
and manage inventory through an admin dashboard.

## Features

- 🔐 JWT authentication (register/login) with role-based access (user/admin)
- 📖 Browse, search, filter (genre/price), and sort books
- ⭐ Book reviews & ratings
- 🛒 Shopping cart (persisted in localStorage) & checkout
- 📦 Order placement, status tracking, and history
- 🛠️ Admin dashboard: add/delete books, manage order statuses
- 📱 Fully responsive design

## Tech Stack

**Frontend:** React 18, React Router v6, Axios, Vite
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```
book-store/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # authController, bookController, orderController
│   ├── middleware/        # auth (JWT protect/admin), errorHandler
│   ├── models/             # User, Book, Order
│   ├── routes/             # authRoutes, bookRoutes, orderRoutes
│   ├── seed.js             # populates sample books + admin user
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/        # AuthContext, CartContext
    │   ├── components/     # Navbar, Footer, BookCard, ProtectedRoute
    │   ├── pages/           # Home, Books, BookDetail, Login, Register,
    │   │                     Cart, Orders, AdminDashboard, AddBook
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI, JWT_SECRET, etc.
npm run dev
```

The API will run at `http://localhost:5000`.

Optional — seed the database with sample books and an admin account
(`admin@bookstore.com` / `admin123`):

```bash
node seed.js
```

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` and proxies `/api` requests to the backend.

### 3. Build for Production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, which you can serve with any static host
or wire up to be served by the Express backend.

## API Overview

| Method | Endpoint                  | Description                    | Auth        |
|--------|----------------------------|---------------------------------|-------------|
| POST   | /api/auth/register          | Register new user               | Public      |
| POST   | /api/auth/login              | Login                           | Public      |
| GET    | /api/auth/me                  | Get current user profile        | Private     |
| GET    | /api/books                     | List/search/filter books        | Public      |
| GET    | /api/books/:id                 | Get single book                 | Public      |
| POST   | /api/books                      | Create book                     | Admin       |
| PUT    | /api/books/:id                  | Update book                     | Admin       |
| DELETE | /api/books/:id                   | Delete book                     | Admin       |
| POST   | /api/books/:id/reviews             | Add review                      | Private     |
| POST   | /api/orders                          | Place order                     | Private     |
| GET    | /api/orders/my                        | Get my orders                   | Private     |
| GET    | /api/orders/:id                        | Get order by id                 | Private     |
| GET    | /api/orders                             | Get all orders                  | Admin       |
| PUT    | /api/orders/:id/status                    | Update order status             | Admin       |

## Notes for Deployment / Submission

- Update `CLIENT_URL` in `backend/.env` to your deployed frontend URL for CORS.
- Update the frontend's API base URL (or Vite proxy) if hosting frontend and backend separately.
- Remember to update your project's **Demo** and **GitHub** links so your mentor can review it.

## License

Built for educational purposes.
