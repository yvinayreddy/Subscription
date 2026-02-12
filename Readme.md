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
- Fetch all posts with pagination
- Fetch single post by ID
- Delete post by ID
- Post model with timestamps

Pagination supports:
- page
- limit
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

---

### 🛡️ Security

- Passwords never stored in plain text
- JWT verification middleware
- Protected routes require authentication
- Sensitive fields excluded from API responses

---

## ❌ Missing / Incomplete Features

### 🔴 High Priority

- Subscription controller not implemented
- Subscription routes not implemented
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
- Swagger documentation
- Unit tests
- Rate limiting
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

- Swagger API documentation
- Unit & integration testing
- Rate limiting
- CORS configuration
- Logging system
- Environment-based configuration

---

## 📌 Project Status

Active development.

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
