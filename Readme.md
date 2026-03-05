# 📸 Subscription-Based Content Platform API

A backend API for a subscription-based content platform (Instagram-like with premium access) built using **Node.js, Express, MongoDB**, and **JWT authentication**.

This project demonstrates secure authentication, content management, and scalable subscription lifecycle design suitable for academic and internship evaluation.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- ImageKit (CDN for image uploads)
- Multer (Memory storage for uploads)

---

## 🏗️ Architecture

The project follows a layered architecture:

Routes → Controllers → Services → Models → Database

- Routes define API endpoints  
- Controllers handle request/response logic  
- Services contain business logic (ImageKit integration)  
- Models define database schemas  
- Middleware handles authentication and authorization  

---

## ✅ Implemented Features

### 🔐 Authentication

- User registration with validation
- Password hashing using bcrypt
- User login with JWT token (7-day expiry)
- JWT middleware (`protect`) for protected routes
- Secure password exclusion from responses

---

### 👤 User Management

- User model with name, email, password
- Basic user routes defined

---

### 📸 Post Management

- Create post with image upload (ImageKit CDN)
- Fetch all posts with pagination and optional user filter / search
- Fetch single post by ID with ID validation
- Delete post by ID with ID validation
- Basic input validation on controllers (required fields, caption length)
- Post model with timestamps

Pagination supports:
- page
- limit (capped at 100)
- totalPages
- totalPosts
- hasNextPage
- hasPrevPage

---

### 📦 Subscription Plans

- Plan model (name, price, duration in days)
- Full CRUD operations:
  - Create plan
  - Get all plans
  - Get plan by ID
  - Update plan
  - Delete plan

---

### 🗄️ Database

Mongoose models defined for:
- User
- Post
- Plan
- Subscription

MongoDB connection configured and working.

### ⚙️ CORS

When running frontend and backend on different ports (e.g. 3001 and 3000), you must allow cross‑origin requests. The server now uses `cors` middleware with

```
CORS_ORIGIN=http://localhost:3001
```

in `.env`. Customize as needed for other environments.

---

### 🛡️ Security

- Passwords never stored in plain text
- JWT verification middleware
- Protected routes require authentication
- Sensitive fields excluded from API responses
- Added helmet for security headers
- Rate limiting middleware (100 requests / 15 min per IP)

---

## ❌ Missing / Incomplete Features

### 🔴 High Priority

- Subscription controller not implemented
- Subscribe / Renew / Cancel endpoints missing
- Get current subscription endpoint missing

- User profile endpoint not implemented
- Fetch posts by user endpoint not implemented
- Update user profile endpoint missing

---

### 🟡 Medium Priority

- Post.user should reference ObjectId instead of String
- No update post endpoint
- No ownership check before deleting post
- No request validation middleware (Zod/Joi)
- No centralized error handling middleware

---

### 🟢 Lower Priority

- Like system
- Comments
- Follow system
- Feed endpoint
- Logging system

---

## 🛣️ Roadmap

### Phase 1 – Core Subscription Lifecycle

- Implement subscribe endpoint
- Implement renew endpoint
- Implement cancel endpoint
- Implement get current subscription endpoint
- Add subscription expiry logic
- Add middleware to restrict premium access

---

### Phase 2 – Quality Improvements

- Add request validation
- Add centralized error handling
- Fix database relationships (ObjectId reference)
- Add update post endpoint
- Add update user profile endpoint
- Add ownership check for post deletion

---

### Phase 3 – Enhancements

- Premium content access control
- Like / Unlike posts
- Comments system
- Follow system
- Feed endpoint

---

### Phase 4 – Production Readiness

- CORS configuration
- Logging system
- Environment-based configuration

---

## 📌 Project Status

Active development.

Several backend improvements have been completed:

- Input validation and error handling added to controllers
- Pagination with filtering/search in posts endpoint
- Swagger/OpenAPI docs available at `/api/docs`
- Helmet & rate limiting for security
- Comprehensive unit and route tests ensuring 100% coverage of current logic

Currently focused on completing Phase 1 (Subscription Lifecycle) before adding advanced social features.

---

## 🧠 Design Philosophy

- Separation of concerns
- Modular architecture
- RESTful API design
- Secure authentication flow
- Scalable subscription management
- Gateway-ready payment simulation

---

## 🧑‍💻 Getting Started

```bash
git clone <repo-url>
cd project
npm install
npm run dev
