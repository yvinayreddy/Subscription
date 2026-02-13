# Frontend API Integration Guide

This guide explains how to use all the frontend services and components for your Subscription app.

## 📁 Project Structure

```
src/
├── api.js                    # Base API client and endpoint definitions
├── services/                 # Business logic services
│   ├── authService.js       # Authentication
│   ├── userService.js       # User profile operations
│   ├── planService.js       # Plan management
│   ├── subscriptionService.js # Subscription management
│   ├── postService.js       # Post management
│   ├── storageService.js    # localStorage operations
│   └── index.js             # Services export
├── components/              # React components
│   ├── AuthForm.jsx         # Login/Register form
│   ├── PlanList.jsx         # Display and subscribe to plans
│   ├── SubscriptionManager.jsx # Manage user subscriptions
│   ├── PostFeed.jsx         # Display posts with pagination
│   ├── CreatePost.jsx       # Create new posts
│   └── index.js             # Components export
```

## 🚀 Quick Start

### 1. Authentication

```javascript
import { authService } from './services';

// Login
await authService.login('email@example.com', 'password');

// Register
await authService.register('John', 'john@example.com', 'password123');

// Logout
authService.logout();

// Check if authenticated
if (authService.isAuthenticated()) {
  const user = authService.getUser();
  console.log(user); // { id, name, email, role }
}
```

### 2. Plan Management

```javascript
import { planService } from './services';

// Get all plans
const plans = await planService.getAll();

// Get specific plan
const plan = await planService.getById('planId');

// Create plan (Admin only)
const newPlan = await planService.create('Premium', 99.99, 30);

// Update plan (Admin only)
const updated = await planService.update('planId', { name: 'Pro', price: 129.99 });

// Delete plan (Admin only)
await planService.delete('planId');
```

### 3. Subscriptions

```javascript
import { subscriptionService } from './services';

// Create subscription
const subscription = await subscriptionService.create('userId', 'planId');

// Get all subscriptions (Admin)
const all = await subscriptionService.getAll();

// Get user's subscriptions
const userSubs = await subscriptionService.getUserSubscriptions('userId');

// Get specific subscription
const sub = await subscriptionService.getById('subscriptionId');

// Cancel subscription
await subscriptionService.cancel('subscriptionId');

// Get active subscriptions
const active = await subscriptionService.getActive('userId');
```

### 4. Posts

```javascript
import { postService } from './services';

// Get all posts with pagination
const { data, pagination } = await postService.getAll(page, limit);

// Get specific post
const post = await postService.getById('postId');

// Create post (with image file)
const file = document.getElementById('imageInput').files[0];
const newPost = await postService.create('My caption', file);

// Delete post
await postService.delete('postId');
```

### 5. User Profile

```javascript
import { userService } from './services';

// Get user profile
const profile = await userService.getProfile('userId');

// Update profile
const updated = await userService.updateProfile('userId', {
  name: 'New Name',
  email: 'new@example.com'
});

// Get current user from storage
const currentUser = userService.getCurrentUser();
```

### 6. Storage

```javascript
import { storageService } from './services';

// Set item
storageService.setItem('key', { data: 'value' });

// Get item
const data = storageService.getItem('key', true); // true = parse JSON

// Remove item
storageService.removeItem('key');

// Check if exists
if (storageService.hasItem('key')) {
  console.log('Key exists');
}

// Clear all
storageService.clear();
```

## 🎨 Using Components

### AuthForm
```jsx
import { AuthForm } from './components';

<AuthForm 
  onSuccess={() => {
    console.log('Auth successful');
    // Redirect or load data
  }} 
/>
```

### PlanList
```jsx
import { PlanList } from './components';

<PlanList />
```

### SubscriptionManager
```jsx
import { SubscriptionManager } from './components';

<SubscriptionManager />
```

### PostFeed
```jsx
import { PostFeed } from './components';

<PostFeed />
```

### CreatePost
```jsx
import { CreatePost } from './components';

<CreatePost 
  onPostCreated={() => {
    console.log('Post created');
    // Refresh feed
  }} 
/>
```

## 📋 API Endpoints Covered

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/:userId` - Get user profile (Protected)
- `PUT /users/:userId` - Update profile (Protected)

### Plans
- `GET /plans` - Get all plans
- `GET /plans/:id` - Get plan by ID
- `POST /plans` - Create plan (Admin)
- `PUT /plans/:id` - Update plan (Admin)
- `DELETE /plans/:id` - Delete plan (Admin)

### Subscriptions
- `POST /subscriptions` - Create subscription (Protected)
- `GET /subscriptions` - Get subscriptions with filters (Protected, Admin)
- `GET /subscriptions/:id` - Get subscription details (Protected)
- `PUT /subscriptions/:id/cancel` - Cancel subscription (Protected)

### Posts
- `GET /posts` - Get all posts with pagination
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create post with image (Protected)
- `DELETE /posts/:id` - Delete post (Protected)

## 🔐 Authentication

All protected endpoints automatically include the JWT token from localStorage. The token is:
1. Set when user logs in successfully
2. Automatically attached to all requests
3. Cleared when user logs out

## ⚠️ Error Handling

All services throw errors with descriptive messages:

```javascript
try {
  await planService.getAll();
} catch (error) {
  console.error(error.message); // "Invalid Plan ID format"
}
```

## 🔄 Example App Structure

```jsx
import { useState, useEffect } from 'react';
import { authService } from './services';
import { AuthForm, PlanList, SubscriptionManager, PostFeed, CreatePost } from './components';

export function App() {
  const [user, setUser] = useState(authService.getUser());

  const handleAuthSuccess = () => {
    setUser(authService.getUser());
  };

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={() => {
        authService.logout();
        setUser(null);
      }}>Logout</button>

      <CreatePost onPostCreated={() => window.location.reload()} />
      <PostFeed />
      <PlanList />
      <SubscriptionManager />
    </div>
  );
}
```

## 📝 Notes

- All services are self-contained and can be used independently
- Components handle loading and error states
- Image uploads use FormData (multipart/form-data)
- Pagination data includes: `currentPage`, `totalPages`, `limit`, `totalPosts`, `hasNextPage`, `hasPrevPage`
- User data is persisted in localStorage for session management

## 🚨 Common Issues

1. **Token not being sent**: Ensure user is logged in and token exists in localStorage
2. **CORS errors**: Make sure backend is running and configured correctly
3. **Image upload fails**: Check file size and format are valid
4. **Pagination not working**: Verify page and limit parameters are numbers

Happy coding! 🎉
