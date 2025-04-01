# 🧠 Blog App — Backend (NestJS)

This is the **backend** for the Blog App, built with **NestJS** and **MongoDB (Mongoose)**. It provides a RESTful API for user authentication, blog post management, and user profiles.

It is designed to work with the [Angular Frontend](https://github.com/Dmytro-Doronin/blog-frontend-Angular), but can be used with any frontend.

---

## 🔗 Related Projects

- 🌐 Frontend: [Blog Frontend Angular](https://github.com/Dmytro-Doronin/blog-frontend-Angular)

---

## 🚀 Technologies Used

- **NestJS** – Node.js framework
- **TypeScript**
- **MongoDB** – Database
- **Mongoose** – ODM
- **JWT** – Authentication
- **Passport.js** – Auth middleware
- **Class-validator** – Input validation

---

## 📦 Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Blog post CRUD
- ✅ Authenticated routes with guards
- ✅ User profile info
- ✅ RESTful API
- ✅ API docs via Swagger

---


Some example routes:

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| POST   | `/auth/register`       | Register new user      |
| POST   | `/auth/login`          | User login             |
| GET    | `/posts`               | Get all posts          |
| GET    | `/posts/:id`           | Get single post        |
| POST   | `/posts`               | Create post (auth)     |
| PATCH  | `/posts/:id`           | Update post (auth)     |
| DELETE | `/posts/:id`           | Delete post (auth)     |

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dmytro-Doronin/blog-backend-Nest.git
cd blog-backend-Nest

```

### 2. Clone the repository
```bash


npm install

```

### 3. Set up environment variables
```bash

Create a .env file in the root:

PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-db
JWT_SECRET=your_jwt_secret

```