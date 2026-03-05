# 📸 Subscription-Based Content Platform API

A backend API for a **subscription-based content platform** where users can create posts and access premium content through subscription plans.

Built using **Node.js, Express, MongoDB**, and **JWT authentication**, with a modular architecture designed for scalability and maintainability. :contentReference[oaicite:0]{index=0}

---

## 🚀 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- ImageKit (CDN for image uploads)
- Multer (File uploads)
- Express Rate Limit
- Swagger (API documentation)
- Jest + Supertest (Testing)

---

## 🏗️ Architecture

The backend follows a **Service Layer Architecture**:

Routes → Controllers → Services → Models → Database

### Layer Responsibilities

| Layer | Responsibility |
|------|------|
| Routes | Define API endpoints |
| Controllers | Handle request/response logic |
| Services | Contain business logic |
| Models | Define database schemas |
| Middleware | Authentication, authorization, error handling |
| Utils | Reusable helpers and configuration |

This separation improves **maintainability, testing, and scalability**.

---

## ✅ Current Features (Implemented)

### 🔐 Authentication

- User registration with validation
- User login with JWT token generation
- Password hashing using bcrypt
- Protected routes using authentication middleware
- Secure password exclusion from responses

---

### 📸 Post Management

- Create posts with image upload via **ImageKit CDN**
- Fetch all posts with **pagination and search**
- Fetch a single post by ID
- Delete posts (owner only)
- Image storage via CDN
- Post filtering and pagination support

Pagination response includes:

- `currentPage`
- `totalPages`
- `totalPosts`
- `hasNextPage`
- `hasPrevPage`

---

### 📦 Subscription Plans

Admin users can manage subscription plans.

Features:

- Create plan
- Get all plans
- Get plan by ID
- Update plan
- Delete plan

Each plan includes:

- name
- price
- duration (days)
- active status

---

### 📅 Subscription Management

- Create user subscriptions
- Get subscription by ID
- Get all subscriptions (with filters)
- Cancel subscriptions
- Renew subscriptions
- Track subscription status

Subscription status types:

- `active`
- `cancel`
- `expired`

---

### 🛡️ Security & Utilities

- JWT authentication middleware
- Role-based authorization middleware
- Helmet security headers
- Rate limiting (100 requests / 15 minutes per IP)
- CORS configuration
- Centralized error handling
- Async error handler wrapper

---

### 📚 API Documentation

Swagger documentation available at:


Swagger provides:

- endpoint documentation
- request format
- response format
- authentication requirements

---

### 🧪 Testing

The project includes automated tests using:

- Jest
- Supertest

Test coverage includes:

- service logic
- route behavior
- controller validation
- API response status checks

---

## 📁 Project Structure
src
├ config
│ ├ api.config.js
│ ├ db.config.js
│ └ imagekit.config.js
├ controllers
│ ├ user.controller.js
│ ├ post.controller.js
│ ├ plan.controller.js
│ └ subscription.controller.js
├ services
│ ├ user.service.js
│ ├ post.service.js
│ ├ plan.service.js
│ └ subscription.service.js
├ models
│ ├ user.model.js
│ ├ post.model.js
│ ├ plan.model.js
│ └ subscription.model.js
├ routes
│ ├ user.routes.js
│ ├ post.routes.js
│ ├ plan.routes.js
│ └ subscription.routes.js
├ middlewares
│ ├ auth.middleware.js
│ ├ role.middleware.js
│ └ error.middleware.js
├ utils
│ ├ asyncHandler.js
│ └ validation.js
---

## 📡 API Endpoints

### Authentication


POST /api/auth/register
POST /api/auth/login


---

### Posts


GET /api/posts
GET /api/posts/:postId
POST /api/posts
DELETE /api/posts/:postId


---

### Plans


GET /api/plans
GET /api/plans/:id
POST /api/plans
PUT /api/plans/:id
DELETE /api/plans/:id


---

### Subscriptions


GET /api/subscriptions
GET /api/subscriptions/:subscriptionId
POST /api/subscriptions
PUT /api/subscriptions/:subscriptionId/cancel
PUT /api/subscriptions/:subscriptionId/renew


---

## ⚠️ Current Limitations

- No post editing endpoint
- No user profile management
- No payment gateway integration
- No email notifications for subscriptions
- Limited filtering options for posts

---

## 🛣️ Roadmap

### Phase 1 – Core Enhancements

- Post editing endpoint
- User profile management
- Premium content access control
- Subscription expiry automation

---

### Phase 2 – Quality Improvements

- Input validation using Zod/Joi
- Improved logging system
- API rate limiting per user
- Environment-based configuration

---

### Phase 3 – Social Features

- Like / Unlike posts
- Comments system
- Follow system
- Personalized feed

---

### Phase 4 – Production Readiness

- Docker containerization
- CI/CD pipeline
- Monitoring & health checks
- Database indexing optimization

---

## 📌 Project Status

🛠 **Active Development**

Core backend functionality is implemented including:

- authentication
- post management
- plan management
- subscription lifecycle
- testing
- documentation

Currently improving **frontend integration and feature enhancements**.

---

## 🧠 Design Philosophy

- Clean architecture
- Separation of concerns
- RESTful API design
- Secure authentication flow
- Scalable subscription system
- Testable service layer

---

## 🧑‍💻 Getting Started

Clone repository:


git clone <repo-url>
cd project


Install dependencies:


npm install


Create `.env` file:


PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
IMAGEKIT_URL_ENDPOINT=xxx


Run server:


npm run dev


Access:


API: http://localhost:3000

Docs: http://localhost:3000/api/docs


---

## 📄 License

This project is for **learning and portfolio purposes**.