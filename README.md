# 📦 InvenTrack — Inventory Management System

A full-stack Inventory Management System built with **Angular 17**, **Node.js + Express + TypeScript**, and **Supabase (PostgreSQL)**. Submitted as final project for **ITAS4** (Client-Side) and **ITAS5** (Server-Side) Web Programming.

---

## 🔗 Live Links

| Service | URL |
|---|---|
| 🌐 Frontend (Vercel) | `https://inventory-management-yourname.vercel.app` |
| 🚀 Backend API (Render) | `https://inventory-api-yourname.onrender.com` |
| 📄 API Docs (Swagger) | `https://inventory-api-yourname.onrender.com/api/docs` |

> **Replace** the URLs above with your actual deployed URLs after deployment.

---

## 🛠 Tech Stack

### Frontend
- **Angular 17** (Standalone Components, Signals)
- **Tailwind CSS** (responsive UI)
- **RxJS** (Observables, debounceTime, operators)
- **Angular Router** with Route Guards
- **Reactive Forms** with validation
- **Deployed on:** Vercel

### Backend
- **Node.js + Express** with **TypeScript**
- **JWT Authentication** (jsonwebtoken)
- **bcryptjs** (password hashing)
- **Multer** (file upload, memory storage)
- **express-validator** (input validation)
- **morgan** (HTTP logging)
- **Swagger / OpenAPI** (API documentation)
- **Deployed on:** Render

### Database
- **Supabase** (PostgreSQL)
- **Supabase Storage** (product images)

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- A free [Supabase](https://supabase.com) account

---

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system
```

---

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** and paste the full contents of `schema.sql`
3. Click **Run** — this creates all tables, indexes, triggers, and the storage bucket
4. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon` public key
   - `service_role` secret key
5. Go to **Storage** → Confirm bucket `product-images` exists and is **Public**

---

### 3. Backend Setup

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

JWT_SECRET=your-random-secret-at-least-32-chars
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:4200
STORAGE_BUCKET=product-images
```

Install & run:
```bash
npm install
npm run dev
```

Server starts at: `http://localhost:5000`
Swagger docs at: `http://localhost:5000/api/docs`

---

### 4. Frontend Setup

```bash
cd client
npm install
npm start
```

App runs at: `http://localhost:4200`

> To point the frontend at your Render backend in production, edit:
> `client/src/environments/environment.prod.ts` → set `apiUrl`

---

## 🚀 Deployment

### Backend → Render

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** *(leave blank — uses render.yaml)*
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
5. Add all environment variables from `.env` in Render's dashboard
6. Deploy — Render auto-detects `render.yaml`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/inventory-client/browser`
3. Add environment variable:
   - `NG_APP_API_URL` = your Render backend URL
4. Deploy

> After deploying the backend, update `client/src/environments/environment.prod.ts` with your Render URL and redeploy frontend.

---

## 📡 API Overview

Base URL: `/api`

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login, returns JWT | Public |
| GET | `/auth/me` | Get current user | 🔒 JWT |

### Product Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List all (search, filter, paginate) | 🔒 JWT |
| GET | `/products/:id` | Get single product | 🔒 JWT |
| POST | `/products` | Create product + image upload | 🔒 Admin |
| PUT | `/products/:id` | Update product | 🔒 Admin |
| DELETE | `/products/:id` | Delete product | 🔒 Admin |
| GET | `/products/categories` | List all categories | 🔒 JWT |
| GET | `/products/dashboard` | Stats (total, value, low stock) | 🔒 JWT |
| POST | `/products/upload/image` | Upload image to Supabase Storage | 🔒 Admin |

### User Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | List all users | 🔒 Admin |
| GET | `/users/:id` | Get user by ID | 🔒 Admin |
| PATCH | `/users/:id/role` | Change user role | 🔒 Admin |
| DELETE | `/users/:id` | Delete user | 🔒 Admin |

---

## ✅ Features Implemented

### Authentication & Authorization
- [x] User registration with name, email, password
- [x] Login with JWT token
- [x] Password hashing with bcryptjs (12 rounds)
- [x] JWT-protected routes
- [x] Role-based access control (Admin / User)
- [x] Angular Route Guards (authGuard, adminGuard, guestGuard)
- [x] HTTP Interceptor for automatic token attachment

### Inventory Management
- [x] Add product (name, description, price, quantity, category, image)
- [x] Edit product
- [x] Delete product with confirmation dialog
- [x] View product list (card grid layout)
- [x] View single product detail

### Search / Filter / Pagination
- [x] Full-text search with 400ms debounce
- [x] Filter by category (dynamic dropdown)
- [x] Sort by newest/oldest
- [x] Paginated results with page controls

### File Upload
- [x] Product image upload via multipart/form-data
- [x] Stored in Supabase Storage (public bucket)
- [x] Image preview before upload
- [x] 5MB limit, images only (JPEG, PNG, WebP, GIF)

### Dashboard
- [x] Total product count
- [x] Total inventory value
- [x] Low stock alert (≤ 10 units)
- [x] Category count
- [x] Recent products table
- [x] Low stock banner warning

### UI/UX
- [x] Responsive layout (mobile + desktop)
- [x] Sidebar navigation with active states
- [x] Loading skeletons
- [x] Error messages on forms
- [x] Tailwind CSS throughout
- [x] Inter font

### Backend Quality
- [x] Modular architecture (controllers / routes / services / middleware)
- [x] CORS with allowed origins
- [x] Morgan HTTP logging
- [x] Global error handler middleware
- [x] Input validation on all write endpoints
- [x] Swagger / OpenAPI documentation at `/api/docs`
- [x] Health check endpoint at `/health`

---

## 📁 Repository Structure

```
inventory-management-system/
│
├── client/                          → Angular 17 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/          → auth, admin, guest guards
│   │   │   │   ├── interceptors/    → JWT interceptor
│   │   │   │   ├── models/          → TypeScript interfaces
│   │   │   │   └── services/        → auth, product, user services
│   │   │   ├── features/
│   │   │   │   ├── auth/            → login, register
│   │   │   │   ├── dashboard/       → dashboard stats
│   │   │   │   ├── products/        → list, form, detail
│   │   │   │   └── users/           → user management
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           └── layout/      → sidebar + topbar layout
│   │   └── environments/            → dev & prod configs
│   ├── tailwind.config.js
│   └── angular.json
│
├── server/                          → Node.js + Express Backend
│   └── src/
│       ├── config/                  → supabase.ts, swagger.ts
│       ├── controllers/             → auth, product, user
│       ├── middleware/              → auth, error, upload
│       ├── routes/                  → auth, product, user routes
│       ├── services/                → auth, product, user services
│       ├── types/                   → TypeScript interfaces
│       └── index.ts                 → Express app entry
│
├── screenshots/                     → UI & API testing screenshots
├── schema.sql                       → Supabase PostgreSQL schema
├── render.yaml                      → Render deployment config
├── vercel.json                      → Vercel deployment config
└── README.md
```

---

## 👥 Group Members

| Name | Role |
|---|---|
| Member 1 | Frontend Developer (Angular, Tailwind) |
| Member 2 | Backend Developer (Node.js, Express, Supabase) |
| Member 3 | UI/UX Designer + Auth Lead + Repo Manager |

---

## 📸 Screenshots

> Place screenshots in the `screenshots/` folder:
> - `screenshots/login.png`
> - `screenshots/dashboard.png`
> - `screenshots/products.png`
> - `screenshots/product-form.png`
> - `screenshots/users.png`
> - `screenshots/swagger-ui.png`
> - `screenshots/postman-auth.png`
> - `screenshots/postman-products.png`

---

## 🔐 Default Roles

| Role | Permissions |
|---|---|
| **Admin** | Full CRUD on products, manage users, view dashboard |
| **User** | View products, view dashboard (read-only) |

> The first admin must be created by running the seed SQL in `schema.sql` or by manually updating a user's role in the Supabase dashboard.

---

*Deadline: 2nd Week of May 2026*
