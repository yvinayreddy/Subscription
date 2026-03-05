---

# � Subscription Management System

A full-stack application for managing subscriptions, plans, and user posts built with **Node.js (Express)** backend and **Next.js** frontend. Features JWT authentication, image uploads, plan management, and subscription handling.

---

## 🚀 Tech Stack

### Backend
* **Node.js** & **Express.js**
* **MongoDB** + **Mongoose**
* **JWT** (Authentication)
* **bcrypt** (Password hashing)
* **ImageKit** (Image uploads via CDN)
* **Multer** (File handling)
* **Express Rate Limit** (API rate limiting)
* **Swagger** (API documentation)

### Frontend
* **Next.js** (React framework)
* **React** (UI components)
* **Tailwind CSS** (Styling)
* **shadcn/ui** (Component library)

---

## ✅ Current Features (Implemented)

### 🔐 Authentication
* User registration and login
* JWT-based authentication
* Protected routes with middleware
* Password hashing with bcrypt

### 🖼️ Posts
* Create posts with image uploads (ImageKit CDN)
* Fetch all posts with pagination and search
* Fetch single post by ID
* Delete own posts (authorization required)
* Image storage and URL management

### 💼 Plans Management
* Create, read, update, delete plans (Admin only)
* Plan pricing and duration management
* Active plan status tracking

### 📅 Subscriptions
* Create subscriptions for users
* View all subscriptions with filters
* Cancel active subscriptions
* Renew subscriptions
* Subscription status tracking (active, cancelled)

### 👨‍💼 Admin Panel
* Manage plans (CRUD operations)
* Manage subscriptions
* User authentication for admin access

### 🛡️ Security & Utilities
* Rate limiting (100 requests/15min per IP)
* Helmet for security headers
* CORS configuration
* Centralized error handling
* Input validation
* Async error handling wrapper

### 📚 Documentation
* Comprehensive JSDoc comments for all controllers and services
* Swagger API documentation
* Organized code structure (controllers, services, routes, middleware, models, utils)

---

## 🆕 Recently Added Features

* **Rate Limiting**: Moved rate limiter to `utils/saftyObj.js` for better organization
* **Complete Documentation**: Added JSDoc comments to all controller and service functions
* **Frontend Integration**: Next.js frontend with admin, user, and subscription management pages
* **Enhanced Security**: Improved middleware and validation

---

## ⚠️ Current Limitations

* No post editing functionality
* No user profile management beyond auth
* No advanced search or filtering beyond basic queries
* No email notifications for subscriptions
* No payment integration (Stripe/PayPal)
* No unit tests for all modules

---

## 🛣️ Roadmap (Coming Features)

### 🟢 Phase 1: Enhancements (High Priority)
* Post editing functionality (`PUT /api/posts/:postId`)
* User profile management (`GET/PUT /api/users/profile`)
* Advanced search and filtering for posts
* Email notifications for subscription events
* Payment gateway integration (Stripe)

### 🟡 Phase 2: Quality & Testing
* Comprehensive unit and integration tests (Jest)
* Input validation using Zod/Joi schemas
* API rate limiting per user
* Logging system (Winston)
* Environment-based configuration management

### 🔵 Phase 3: Advanced Features
* User roles and permissions (beyond admin/user)
* Subscription analytics and reporting
* Bulk operations for admin
* API versioning
* Real-time notifications (WebSockets)

### ⚙️ Phase 4: Production Readiness
* Docker containerization
* CI/CD pipeline setup
* Database indexing and optimization
* Monitoring and health checks
* Backup and recovery procedures

---

## 📌 Project Status

🛠️ **Active Development**
Core subscription and plan management is complete. Currently enhancing frontend features and adding testing.

---

## 🧠 Architecture

* **Backend**: MVC pattern with clear separation (routes → controllers → services → models)
* **Frontend**: Component-based architecture with Next.js App Router
* **Security**: JWT tokens, bcrypt hashing, rate limiting, input validation
* **Database**: MongoDB with Mongoose schemas and relationships

---

## 🧑‍💻 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB (local or Atlas)
* ImageKit account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd subscription-management
   ```

2. **Backend Setup**
   ```bash
   cd backend  # if separate, but currently in root
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   Create `.env` in backend root:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   PORT=3000
   ```

5. **Run the Application**
   ```bash
   # Backend
   npm start

   # Frontend (in separate terminal)
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   * Backend API: `http://localhost:3000`
   * API Docs: `http://localhost:3000/api/docs`
   * Frontend: `http://localhost:3001`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Posts
- `GET /api/posts` - Get all posts (with pagination/search)
- `GET /api/posts/:postId` - Get single post
- `POST /api/posts` - Create new post (authenticated)
- `DELETE /api/posts/:postId` - Delete post (owner only)

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans` - Create plan (admin)
- `PUT /api/plans/:id` - Update plan (admin)
- `DELETE /api/plans/:id` - Delete plan (admin)

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions (with filters)
- `GET /api/subscriptions/:subscriptionId` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:subscriptionId/cancel` - Cancel subscription
- `PUT /api/subscriptions/:subscriptionId/renew` - Renew subscription

---

## 📄 License

This project is for **learning and practice purposes**.

---

### ⭐ Key Achievements

* Complete CRUD operations for plans and subscriptions
* Secure authentication system
* Image upload functionality
* Admin panel for management
* Comprehensive API documentation
* Clean, documented codebase

---

If you'd like help with:
* Implementing coming features
* Setting up tests
* Improving the frontend
* Adding payment integration

Just let me know! 👍

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
