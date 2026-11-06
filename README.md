# ELVOVE — Photography Website

ELVOVE is a full-stack photography website for presenting photographic work, publishing services and packages, receiving booking inquiries, and managing site content through a secure admin dashboard.

**Live demo:** _add your deployed URL here once live_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · Vite 8 · Tailwind CSS v4 · React Router 7 · Axios |
| Backend | Spring Boot 3.3.4 · Java 17 · Spring Security · Spring Data JPA (Hibernate) |
| Database | PostgreSQL |
| Auth | JWT (jjwt 0.12.6) + BCrypt password hashing |
| Fonts | Fraunces (display serif) + Inter (body), self-hosted via Fontsource |
| Icons | lucide-react |

No Docker, no microservices, no Redis, no Kafka, no WebSockets, no external CMS — deliberately kept simple and easy for one developer to maintain. (One `Dockerfile` exists solely to make cloud deployment on Render straightforward — it isn't part of the local dev workflow.)

---

## Design

Editorial, film-photography aesthetic rather than a generic template:

- **Palette:** ink black `#0e0d0c` · warm ivory `#f3efe7` · brass/gold accent `#b08d57` · deep burgundy `#5c2333`
- **Signature motif:** a film contact-sheet / sprocket-hole divider (`.sprocket-rule`) and frame-numbered section labels (`FRAME 001`, `FRAME 002`...) used throughout instead of generic numbering
- Full-bleed imagery, generous negative space, minimal chrome

---

## Features

### Public site (13 pages)
Home · About · Portfolio (category filter + lightbox) · Galleries (curated photo sets) · Services · Packages · Films (video gallery) · Testimonials · Latest Gallery · Booking (validated inquiry form) · FAQ (accordion) · Contact (WhatsApp button + embeddable map) · Privacy / Terms

### Admin dashboard (JWT-protected, `/admin`)
- Dashboard with live stats (total photos, bookings, services, packages, testimonials)
- Full CRUD: Photos (with category + image upload), Categories, Galleries (photo picker), Services, Packages (dynamic feature lists), Testimonials, Videos, FAQs
- Bookings inbox with status workflow (Pending → Contacted → Completed)
- Single-record editors: About page content, Contact info, Social links
- Ordering via a `displayOrder` field on every content type

### Backend safeguards
- JWT authentication, BCrypt-hashed passwords, protected `/api/admin/**` routes
- Auto-creates a default admin account on first run if none exists (`DataInitializer`)
- Per-IP rate limiting on the public booking form (5 submissions / 10 minutes) to block spam
- Centralized validation with field-level error messages (`GlobalExceptionHandler`)
- Image upload validation (type + 10MB size limit) with path-traversal protection

---

## Project Structure
elvove-photography/
├── backend/
│   ├── Dockerfile                  # for cloud deployment (e.g. Render)
│   └── src/main/java/com/portfolio/photographer/
│       ├── entity/                 # 13 JPA entities
│       ├── repository/             # Spring Data JPA repositories
│       ├── dto/                    # Request/response records
│       ├── service/                # Business logic
│       ├── controller/             # REST endpoints (public + admin)
│       ├── security/                # JWT filter, JwtService, rate limiter
│       ├── config/                  # Security, CORS, static file serving, admin bootstrap
│       └── exception/               # Global exception handling
└── frontend/
└── src/
├── pages/                   # Public pages
├── pages/admin/              # Admin dashboard screens
├── components/               # Navbar, Footer, AdminResourceManager (generic CRUD UI), ...
├── services/                 # api.js (axios + JWT interceptor), publicApi.js, adminApi.js
├── context/                  # AuthContext
└── utils/imageUrl.js         # Resolves uploaded-image URLs against the backend origin

---

## Database Schema

13 tables: `admins`, `categories`, `photos`, `galleries` (+ `gallery_photos` join table), `services`, `packages` (+ `package_features`), `testimonials`, `videos`, `bookings`, `contact_info`, `about_info`, `faqs`, `social_links`.

Managed via Hibernate (`ddl-auto: update`) — no manual migrations needed for local development.

---

## API Overview

| Prefix | Access | Examples |
|---|---|---|
| `/api/auth/**` | Public | `POST /api/auth/login` |
| `/api/public/**` | Public, read-only | `GET /api/public/photos`, `GET /api/public/services` |
| `POST /api/bookings` | Public, rate-limited | Submit a booking inquiry |
| `/api/admin/**` | JWT required (`ROLE_ADMIN`) | Full CRUD for every resource + `/api/admin/upload`, `/api/admin/dashboard/summary` |

---

## Local Setup

### Prerequisites
Java 17 · Maven · Node.js · PostgreSQL running locally

### 1. Backend
```bash
cd backend
# Create the database:
#   CREATE DATABASE photographer_portfolio;

# PowerShell:
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="a-long-random-string-at-least-32-characters"

mvn spring-boot:run
```
Runs on **http://localhost:8080**. A default admin account (`admin` / `ChangeMe123!` unless overridden via `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_EMAIL`) is created automatically on first run — check the startup logs.

### 2. Frontend
```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
Runs on **http://localhost:5173**.

> `--legacy-peer-deps` is required because `lucide-react` is pinned to `0.383.0` (for its social-media brand icons, dropped in later major versions) which lists React 18 as a peer while this project uses React 19 — a safe combination in practice.

---

## Deployment

Recommended free stack:
- **Database:** [Neon](https://neon.tech) — permanent free Postgres tier
- **Backend:** [Render](https://render.com) — free web service, deployed via the included `Dockerfile`
- **Frontend:** [Vercel](https://vercel.com) — free static hosting for the Vite build

Key environment variables to set on the backend host: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`. On the frontend host: `VITE_API_BASE_URL` pointing at the live backend URL.

**Known limitation:** uploaded images are stored on local disk (`uploads/`). On platforms with an ephemeral filesystem (most free tiers), uploaded images are lost on redeploy/restart. Fine for a portfolio demo; for real production use, swap `FileStorageService` for S3/Cloudinary.

---

## Security Checklist Before Going Live
- [ ] Log in and change the default admin password immediately
- [ ] Set a strong, random `JWT_SECRET` (32+ characters) via environment variable — never hardcode it in `application.yml`
- [ ] Set `FRONTEND_URL` to your real deployed frontend domain (controls CORS)
- [ ] Set `VITE_API_BASE_URL` to your real deployed backend domain

---

## License
Personal/portfolio project — no license specified.
