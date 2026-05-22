# TaskFlow — Full-Stack Task Management App

A production-ready task management application built with React, Node.js, Express, and MongoDB Atlas. Features a premium dark-mode UI with glassmorphism design, full JWT authentication, and complete CRUD functionality.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Dates | date-fns |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   └── taskController.js   # CRUD + toggle
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt)
│   │   └── Task.js             # Task schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   └── taskRoutes.js       # /api/tasks/*
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmptyState.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PriorityBadge.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatsCard.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskModal.jsx
    │   │   └── TaskSkeleton.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── hooks/
    │   │   └── useTasks.js      # Task operations hook
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Main app view
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── utils/
    │   │   └── api.js           # Axios instance
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

---

### 1. MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **Cluster** (free M0 tier)
3. Under **Database Access**, create a user with read/write access
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs) for development
5. Click **Connect** → **Drivers** and copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### 2. Backend Setup

```bash
cd taskflow/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Important:** Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials.
> Use a strong random string for `JWT_SECRET`.

```bash
# Start the backend server
npm run dev
```

The API will be live at `http://localhost:5000`

Test it: `curl http://localhost:5000/health`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd taskflow/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start the frontend dev server
npm run dev
```

The app will be at `http://localhost:5173`

---

## API Reference

### Auth Endpoints

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` | Register new user |
| POST | `/api/auth/login` | `{email, password}` | Login user |
| GET | `/api/auth/me` | — (requires token) | Get current user |

### Task Endpoints (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Body / Query | Description |
|---|---|---|---|
| GET | `/api/tasks` | `?status=&priority=&search=&sort=` | Get user's tasks |
| POST | `/api/tasks` | `{title, description, priority, status, dueDate}` | Create task |
| PUT | `/api/tasks/:id` | `{title, description, priority, status, dueDate}` | Update task |
| DELETE | `/api/tasks/:id` | — | Delete task |
| PATCH | `/api/tasks/:id/toggle` | — | Toggle complete/pending |

---

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=<your atlas URI>
   JWT_SECRET=<your secret>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   ```

### Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) → New Site from Git
2. Connect your repo, set base directory to `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Add a `netlify.toml` in `frontend/` for SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Features

- ✅ **JWT Authentication** — register, login, logout with persistent sessions
- ✅ **Full CRUD** — create, read, update, delete tasks
- ✅ **Toggle Completion** — one-click complete/uncomplete
- ✅ **Filters** — by status (all/pending/in-progress/completed), priority, free-text search
- ✅ **Sorting** — by date, due date, priority, title
- ✅ **Stats Dashboard** — total, pending, in-progress, completed counts
- ✅ **Overdue Detection** — highlights overdue and due-today tasks
- ✅ **Loading Skeletons** — smooth loading states
- ✅ **Toast Notifications** — feedback for every action
- ✅ **Empty States** — styled empty and no-results states
- ✅ **Responsive** — mobile-first, works on all screen sizes
- ✅ **Input Validation** — both client and server side
- ✅ **Error Handling** — graceful error messages throughout
- ✅ **Protected Routes** — redirects unauthenticated users
- ✅ **Password Strength Indicator** — real-time feedback on register

---

## Environment Variables Reference

### Backend `.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: 5000) | Server port |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRE` | No (default: 7d) | Token expiry duration |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS |

### Frontend `.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes** | Backend API base URL |
