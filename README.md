# MERN Authentication & User Profile System

A streamlined, production-ready full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js). Features JWT token rotation with secure HttpOnly cookies, Nodemailer email verification, ImageKit avatar uploads, and Tailwind CSS.

---

## Tech Stack

- **Backend:** Node.js, Express 4, MongoDB (Mongoose 8), JWT, Bcrypt, Multer, ImageKit SDK, Nodemailer
- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Axios, React Hot Toast
- **Security:** HttpOnly + SameSite cookies, Bcrypt password hashing, Reverse proxy trust

---

## Project Structure

```text
new project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── imagekit.js        # ImageKit SDK client
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Register, login, refresh, verify, reset
│   │   │   └── user.controller.js # Profile get/update & avatar upload
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js       # Bearer JWT validator
│   │   │   ├── upload.middleware.js     # Multer memory storage
│   │   │   └── validation.middleware.js # Request payload validation
│   │   ├── model/
│   │   │   └── user.model.js      # User schema & bcrypt hook
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # /api/auth routes
│   │   │   └── user.routes.js     # /api/user routes (protected)
│   │   ├── services/
│   │   │   └── email.service.js   # Nodemailer email dispatcher
│   │   └── server.js              # Express app, CORS, error & 404 handlers
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── _redirects             # SPA redirect for Netlify/Render
│   ├── src/
│   │   ├── components/            # Navbar, ProtectedRoute, UI components
│   │   ├── context/               # AuthContext state provider
│   │   ├── pages/                 # Login, Register, Dashboard, Profile, etc.
│   │   ├── services/              # Axios instance & API clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json                # SPA rewrite for Vercel
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md
```

---

## Features

- **Authentication:**
  - Registration with input validation and password hashing (bcrypt).
  - Email verification with timed tokens.
  - Login issuing short-lived Access Tokens in memory and HttpOnly Refresh Tokens in cookies.
  - Automatic token refresh on 401 using Axios interceptors.
  - Logout with database token revocation and cookie cleanup.
  - Forgot password & password reset flows.
- **User Profile:**
  - View profile details and account status.
  - Update username and email.
  - Avatar image upload directly to ImageKit cloud storage.
- **Production-Ready Architecture:**
  - Reverse proxy support (`trust proxy`) for Render / Railway / Heroku.
  - Cross-site cookie configuration (`sameSite: "none"`, `secure: true`) for separated frontend/backend deployments.
  - Health check endpoint at `/api/health`.
  - Frontend SPA routing configuration (`vercel.json` and `_redirects`).

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_google_app_password
CLIENT_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

> **Note on Gmail:** For `EMAIL_PASS`, you must generate a 16-character **Google App Password** from your [Google Account Security](https://myaccount.google.com/security) settings. Regular Gmail passwords are not accepted.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started Locally

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend client runs on `http://localhost:5173`.

---

## API Reference

### Health Check
- `GET /api/health` - Service health status

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate user & issue tokens
- `POST /api/auth/logout` - Clear refresh cookie & revoke session
- `POST /api/auth/refresh` - Refresh access token using cookie
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset link
- `POST /api/auth/reset-password/:token` - Set new password
- `PUT /api/auth/change-password` - Change password *(Protected)*

### User Profile (`/api/user`)
- `GET /api/user/profile` - Get user profile *(Protected)*
- `PUT /api/user/profile` - Update username/email *(Protected)*
- `POST /api/user/avatar` - Upload profile picture *(Protected)*

---

## Deployment Guide

### Deploy Backend (Render)
1. In MongoDB Atlas, go to **Network Access** and add `0.0.0.0/0` (Allow access from anywhere).
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your GitHub repository.
4. Set configuration:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from `backend/.env.example`.
6. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.vercel.app`.

### Deploy Frontend (Vercel / Netlify)
1. Import the repository into [Vercel](https://vercel.com) or Netlify.
2. Set **Root Directory** to `frontend`.
3. Set Environment Variable:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy. SPA rewrites are pre-configured via `vercel.json` and `public/_redirects`.
