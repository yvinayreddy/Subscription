---

# 📸 Instagram-Like Backend API

A backend API for an Instagram-like application built with **Node.js, Express, MongoDB**, and **JWT authentication**.
This project focuses on clean backend architecture, secure authentication, and scalable API design.

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT** (Authentication)
* **bcrypt** (Password hashing)
* **ImageKit** (Image uploads via CDN)
* **Multer** (In-memory file handling)

---

## ✅ Current Features (Implemented)

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes using middleware
* Password hashing with bcrypt

### 🖼️ Posts

* Create posts with image uploads (ImageKit CDN)
* Store image URLs in MongoDB
* Fetch all posts (with pagination)
* Fetch a single post
* Fetch posts created by a user

### 🗄️ Database Models

* User model
* Post model

### 🛡️ Security

* Passwords are never stored in plain text
* JWT verification middleware
* Sensitive fields excluded from responses

---

## ⚠️ Current Limitations

The project currently supports **CREATE operations only**.
There is **no way to retrieve or manage data yet**.

---

## ❌ Missing Core Features

### 📥 Data Retrieval (READ)

* No endpoint to fetch all posts
* No endpoint to fetch a single post
* No endpoint to fetch user profile
* No endpoint to fetch posts created by a user

### ✏️ Post Management

* No edit post endpoint
* No delete post endpoint

### 🧪 Validation

* No schema validation (Zod / Joi)
* Vulnerable to invalid or malformed input

### ⚠️ Error Handling

* No centralized error handling
* Inconsistent error response format

### 🔗 Database Relationships

* `Post.user` is stored as a `String`
* Should reference `User` via `ObjectId`

---

## 🛣️ Roadmap (Planned Features)

### 🟢 Phase 1: Essential (High Priority)

These endpoints will make the application **usable**:


* `GET /api/users/:userId/profile`
  → Fetch user profile

* `DELETE /api/posts/:postId`
  → Delete own post (authorization required)

---

### 🟡 Phase 2: Quality Improvements

* Input validation using **Zod** or **Joi**
* Centralized error handling middleware
* Consistent API error response structure
* Update post caption
  → `PUT /api/posts/:postId`
* Update user profile
  → `PUT /api/users/:userId`

---

### 🔵 Phase 3: Social Features

* Like / Unlike posts
* Comment system
* Follow / Unfollow users
* Feed endpoint (posts from followed users)

---

### ⚙️ Phase 4: Production Readiness

* Unit & integration tests
* API documentation (Swagger / OpenAPI)
* Rate limiting
* CORS configuration
* Logging system
* Environment-based configuration

---

## 📌 Project Status

🛠️ **Active Development**
Currently focused on implementing **Phase 1 (Essential APIs)** before moving to social features.

---

## 🧠 Design Philosophy

* Clear separation of concerns (controllers, services, routes, middleware)
* Security-first approach
* Scalable API structure
* Industry-aligned backend practices

---

## 🧑‍💻 Getting Started (Basic)

```bash
git clone <repo-url>
cd project
npm install
npm run dev
```

Ensure `.env` contains:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
IMAGEKIT_URL_ENDPOINT=xxx
```

---

## 📄 License

This project is for **learning and practice purposes**.

---

### ⭐ Recommendation

> Start with **Phase 1 endpoints** to complete CRUD functionality
> before adding social features or optimizations.

---

If you want, next I can:

* ✨ Refine this README for **resume/GitHub impact**
* 🧱 Add **API examples** for Phase 1
* 🧪 Create **Postman collection**
* 📚 Add **Swagger docs**
* 🏗️ Help you implement Phase 1 step-by-step

Just tell me 👍
