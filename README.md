# 🧠 Quantacus — Product Intelligence Dashboard

> A full-stack product intelligence system built for Flipkart catalogue teams to ingest, validate, enhance, and monitor product listings — with real-time competitor price tracking and AI-powered title optimization.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [How to Run Locally](#how-to-run-locally)
3. [How to Use the Deployed App](#how-to-use-the-deployed-app)
4. [API Documentation](#api-documentation)
5. [Data Models / Schema](#data-models--schema)
6. [Deployment Links](#deployment-links)
7. [Assumptions Made](#assumptions-made)
8. [What is Real vs Mocked](#what-is-real-vs-mocked)
9. [Trade-offs and Limitations](#trade-offs-and-limitations)
10. [What I Would Improve with More Time](#what-i-would-improve-with-more-time)

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | **Node.js v22** (ESModules) |
| Framework | **Express.js** |
| ORM | **Sequelize v6** (PostgreSQL) |
| Database | **PostgreSQL 15** |
| Queue / Worker | **BullMQ** (Redis-backed) |
| Cache / Broker | **Redis 7** |
| AI Integration | **OpenAI SDK** (`gpt-4o`) with rule-based fallback |
| File Uploads | **Multer** |
| CSV Parsing | **csv-parse** |
| Auth | **JWT** (`jsonwebtoken`) + **bcryptjs** |
| Validation | Custom severity-based rule engine |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 15** (App Router) |
| Language | **JavaScript (ESModules)** |
| Styling | **Vanilla CSS** (custom design system) |
| Icons | **Lucide React** |
| Font | **Google Fonts — Outfit** |
| Auth | JWT stored in `localStorage` + secure cookie |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Containerisation (local) | **Docker + Docker Compose** |
| Deployment | **Railway / Render** |

---

## How to Run Locally

### Prerequisites
- Node.js v20+
- Docker Desktop (for PostgreSQL + Redis)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/Mayank-kumarSDE/Product-Intelligence-Dashboard-.git
cd Product-Intelligence-Dashboard-
```

### 2. Start Docker containers (PostgreSQL + Redis)

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port **5433**
- Redis on port **6379**

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3001   # or 3000 if free

DATABASE_URL=postgres://postgres:postgres@localhost:5433/quantacus
REDIS_URL=redis://localhost:6379

OPENAI_API_KEY=             # leave blank → uses fallback rule engine
OPENAI_MODEL=gpt-4o

JWT_SECRET=local-dev-secret-change-before-deploy
JWT_EXPIRES_IN=7d
```

### 4. Sync the database schema

```bash
npm run db:sync
```

### 5. Start all three services (3 separate terminals)

**Terminal 1 — Backend API**
```bash
cd backend
npm run dev
# → http://localhost:8080
```

**Terminal 2 — Background Worker**
```bash
cd backend
npm run worker
# → BullMQ worker starts processing CSV jobs
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
# → http://localhost:3000 (or 3001)
```

### 6. Open the app

Navigate to `http://localhost:3000` → Register an account → Start uploading CSVs.

---

## How to Use the Deployed App

> **Deployment links are listed below in the [Deployment Links](#deployment-links) section.**

### Step-by-step flow

1. **Register / Login** at the home page.
2. **Upload CSV** on the Upload page:
   - **Product CSV** (Appendix A format): columns like `sku_id`, `product_title`, `price`, `mrp`, `inventory`, `image_url`, etc.
   - **Competitor Price CSV** (Appendix B format): columns like `sku_id`, `platform`, `competitor_price`, `currency`, etc.
3. **Monitor Jobs** on the `/jobs` page — real-time progress bars, status badges, and expandable row-level failure logs.
4. **Dashboard** — see the Catalogue Quality Score, severity breakdown (HIGH / MEDIUM / LOW issues), and diagnostic cards (Invalid Prices, Missing Images, Weak Descriptions).
5. **Products List** — browse all uploaded products with their validation status.
6. **Product Detail** — deep dive into a single listing:
   - Competitor price gap analysis with automated recommendations
   - Validation issue breakdown by severity
   - AI-Enhanced Title with extracted attributes and suggested SEO keywords
   - Raw source data preview
7. **Enhance Title** — click the "Enhance Title" button to trigger the AI enhancement pipeline (OpenAI or fallback).
8. **Alerts** — view auto-generated alerts for price gaps, listing quality failures, and competitor price drops.

---

## API Documentation

All endpoints are prefixed with `/api`. Authentication is required (JWT Bearer token) for all routes except `/api/auth/*`.

**Base URL (local):** `http://localhost:8080`

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Register a new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login, returns JWT token |
| `GET` | `/api/auth/me` | — | Get current authenticated user |

### Uploads

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/uploads/csv` | `multipart: { file, enhanceTitles }` | Upload a product CSV file, creates a background job |
| `POST` | `/api/uploads/video` | `multipart: { file }` | Upload a video file (mock extraction) |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products with validation status |
| `GET` | `/api/products/:id` | Get full product detail (incl. competitor prices & validation errors) |
| `GET` | `/api/products/:id/issues` | Get validation issues for a specific product |
| `GET` | `/api/products/:id/competitor-prices` | Get all competitor prices for a product |
| `PATCH` | `/api/products/:id` | Update product details (title, description, price, etc.) |
| `POST` | `/api/products/:id/enhance-title` | Trigger AI title enhancement (OpenAI or fallback) |
| `POST` | `/api/products/:id/refresh-prices` | Refresh competitor prices for a product |

### Competitor Prices

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/competitor-prices` | `multipart: { file }` | Upload competitor price CSV (Appendix B format) |
| `POST` | `/api/competitor-prices/refresh` | — | Trigger system-wide competitor price refresh |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all ingestion jobs with status, progress, and failed rows |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts` | List all alerts (price gaps, validation failures, competitor drops) |
| `PATCH` | `/api/alerts/:id/read` | Mark a specific alert as read |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/summary` | Returns quality score, severity counts, issue counts, alert count |

### Sample API Response

```json
// GET /api/dashboard/summary
{
  "success": true,
  "data": {
    "totalProducts": 120,
    "invalidProducts": 14,
    "warningProducts": 31,
    "healthyProducts": 75,
    "qualityScore": 63,
    "unreadAlerts": 8,
    "highSeverityIssues": 22,
    "mediumSeverityIssues": 47,
    "lowSeverityIssues": 38,
    "weakListings": 19,
    "missingImages": 7,
    "invalidPrices": 3
  }
}
```

---

## Data Models / Schema

### `products` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `sku` | STRING | Product SKU (mapped from `sku_id`, `sku`, `product_id`) |
| `duplicate_sku` | BOOLEAN | True if the same SKU was already in the database |
| `brand` | STRING | Brand name |
| `title` | STRING | Original product title from CSV |
| `enhanced_title` | STRING | AI-optimized SEO title |
| `extracted_attributes` | JSONB | Key-value attributes extracted by AI (Brand, Color, Material, Size) |
| `suggested_keywords` | JSONB | Array of SEO keywords suggested by AI |
| `enhancement_reason` | TEXT | Explanation of AI title changes |
| `description` | TEXT | Product description |
| `category` | STRING | Product category |
| `price` | DECIMAL(10,2) | Flipkart selling price |
| `mrp` | DECIMAL(10,2) | Maximum Retail Price |
| `inventory` | INTEGER | Stock quantity |
| `availability` | STRING | `in_stock` or `out_of_stock` |
| `color` | STRING | Product color |
| `size` | STRING | Product size |
| `material` | STRING | Product material |
| `image_url` | TEXT | Product image URL |
| `validation_status` | ENUM | `valid`, `warning`, `invalid` |
| `validation_errors` | JSONB | Array of `{ severity, type, message }` objects |
| `raw_data` | JSONB | Original parsed CSV row |
| `job_id` | UUID (FK) | Job that created this product |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### `competitor_prices` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `product_id` | UUID (FK) | Linked product |
| `competitor_name` | STRING | Platform name (e.g. "Amazon", "Meesho") |
| `competitor_price` | DECIMAL(10,2) | Competitor's listed price |
| `url` | TEXT | Link to the competitor listing |
| `currency` | STRING | Currency code (default: `INR`) |
| `captured_at` | TIMESTAMP | When the price was recorded |

### `jobs` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `type` | ENUM | `csv` or `video` |
| `status` | ENUM | `queued`, `processing`, `completed`, `failed` |
| `progress` | INTEGER | Completion % (0–100) |
| `total_products` | INTEGER | Number of rows in the uploaded file |
| `error_message` | TEXT | Top-level error summary |
| `failed_rows` | JSONB | Array of `{ rowNum, sku, reason }` for row-level failures |
| `user_id` | UUID (FK) | Owning user |
| `created_at` | TIMESTAMP | Job creation time |

### `alerts` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `product_id` | UUID (FK) | Related product |
| `type` | STRING | `price_high`, `validation_critical`, `competitor_price_drop`, `validation_warning`, `validation_info` |
| `severity` | ENUM | `critical`, `warning`, `info` |
| `message` | TEXT | Human-readable alert description |
| `is_read` | BOOLEAN | Whether the alert has been dismissed |

### `users` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `name` | STRING | Display name |
| `email` | STRING (unique) | Login email |
| `password_hash` | STRING | bcrypt-hashed password |

---

## Deployment Links

> ⚠️ Links will be added after deployment is complete.

| Service | URL |
|---------|-----|
| **Frontend** |https://product-intelligence-dashboard-seven.vercel.app/login|
| **Backend API** |https://product-intelligence-dashboard-dcll.onrender.com/health|

---

## Assumptions Made

1. **Single Flipkart platform** — the system treats the product's `price` field as the Flipkart selling price and compares it exclusively against competitor prices. Multi-platform seller support was not in scope.

2. **CSV column flexibility** — because Flipkart catalogues are exported in varying formats, the parser accepts multiple column name aliases for the same field (e.g. `sku_id`, `sku`, `product_id` all map to SKU). This was done to avoid brittle parsing.

3. **Competitor prices come from a separate CSV upload** (Appendix B) rather than being scraped live. Scraping would require browser automation, proxies, and anti-bot handling — well beyond the scope of this assignment.

4. **AI title enhancement is opt-in** at upload time (`enhanceTitles` flag) or triggered manually per product. It is not applied automatically on every save to avoid unnecessary API costs.

5. **A missing OpenAI API key is acceptable** — the system falls back to a deterministic, rule-based title formatter that still extracts brand, color, material, and size, and produces a structured SEO-friendly title.


6. **Users are trusted** — there is no role-based access control (RBAC). Any registered user can upload, edit, or delete any product. For a production system, team-level permissions would be needed.

7. **SKU uniqueness is flagged but not enforced** — duplicate SKUs are detected and flagged as a HIGH-severity validation error, but the product is still created to allow the user to review and decide.

---

## What is Real vs Mocked

### ✅ Real (fully implemented)

| Feature | Details |
|---------|---------|
| **CSV ingestion pipeline** | Parses Appendix A (product) and Appendix B (competitor price) CSVs with multi-alias column mapping |
| **BullMQ job queue** | Redis-backed async processing with real progress tracking and row-level failure logging |
| **Severity-based validation engine** | 10+ validation rules across HIGH / MEDIUM / LOW tiers |
| **Competitor price gap analysis** | Calculates gap %, lowest / average / highest competitor prices, and generates automated recommendations |
| **Alert engine** | 5 distinct alert rules (price gap >10%, critical validation, weak listing, competitor price drop >15%, out-of-stock) |
| **AI title enhancement** | OpenAI `gpt-4o` call with structured JSON response; extracts attributes and suggests keywords |
| **Rule-based title fallback** | Deterministic formatter that runs when no OpenAI key is provided |
| **JWT authentication** | Full register / login / protected-route flow |
| **Dashboard quality score** | Computed from live database counts — not hardcoded |
| **Jobs tracking page** | Real-time polling, accordion failure logs, progress bars |
| **Product detail page** | Competitor price table, validation severity groups, AI suggestion panel, price gap recommendation card |

### 🟡 Mocked / Simulated

| Feature | Details |
|---------|---------|
| **Video ingestion** (`/api/uploads/video`) | Accepts a file upload but runs a mock extractor (`mock-video-extractor.js`) that returns hardcoded sample products. Real video parsing (frame extraction + OCR / vision API) would require significant additional infrastructure. |
| **Competitor price "refresh"** (`POST /api/competitor-prices/refresh`) | Currently re-runs the alert-sync logic against existing data. Does not actually re-scrape competitor websites — that would require a dedicated scraping service. |

---

## Trade-offs and Limitations

| Trade-off | Decision Made | Why |
|-----------|--------------|-----|
| **Sequelize `sync()` instead of migrations** | Used `sequelize.sync({ alter: true })` for schema management | Faster to iterate during development; migrations would be required for a production system to avoid destructive changes |
| **No real-time WebSocket for job progress** | Frontend polls `/api/jobs` every 5 seconds | WebSocket setup (Socket.io) would add complexity; polling is sufficient for infrequent CSV uploads |
| **No pagination on product list** | All products fetched in a single query | Acceptable for demo data volumes; would need cursor-based pagination at scale |
| **In-process OpenAI calls** | AI enhancement runs synchronously inside the BullMQ worker | Avoids a second queue layer; acceptable latency for batch processing |
| **JSONB for validation errors** | Stored as a JSONB column rather than a separate `validation_issues` table | Simpler schema; querying individual issues requires application-level filtering rather than SQL |
| **No soft deletes** | Products are hard-deleted when removed | Simpler implementation; audit trails would need soft deletes in production |
| **No rate limiting** | No API throttling implemented | Would be essential before any public exposure |
| **Single-region deployment** | No CDN or multi-region setup | Appropriate for an assignment; global deployments need edge distribution |

---

## What I Would Improve with More Time

1. **Real competitor price scraping** — Integrate Playwright or Puppeteer with rotating proxies to actually fetch live competitor prices from Amazon, Meesho, Snapdeal, etc. on a scheduled cron.

2. **Database migrations** — Replace `sequelize.sync()` with Sequelize CLI migrations or Flyway so schema changes are versioned and safe in production.

3. **Cursor-based pagination** — Add `limit`/`cursor` to `/api/products` for scalable browsing of large catalogues.

4. **WebSocket job progress** — Replace polling with Socket.io to give the user a live progress feed without repeated HTTP calls.

5. **Role-based access control** — Add `admin` / `analyst` / `viewer` roles so different team members have appropriate permissions.

6. **Bulk title enhancement** — Allow enhancing all un-enhanced products in a single batch job (currently enhancement is per-product).

7. **Richer AI prompting** — Pass more context to OpenAI (competitor prices, category benchmarks, keyword trends) to generate titles that are not just SEO-friendly but also conversion-optimized.

8. **Unit and integration tests** — Add Jest tests for the validation engine, CSV parser, and alert service, plus integration tests for the upload → job → product pipeline.

9. **Monitoring & observability** — Integrate Sentry for error tracking, Prometheus/Grafana for queue metrics, and structured JSON logging.

10. **Audit trail** — Log every product edit, status change, and AI enhancement with the user who triggered it and a timestamp.

---

## Project Structure

```
quantacus/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment, DB, Redis, Queue configs
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── db/
│   │   │   └── models/      # Sequelize models (Product, Job, Alert, CompetitorPrice, User)
│   │   ├── middlewares/     # Auth guard, error handler, file upload
│   │   ├── queues/          # BullMQ queue definitions
│   │   ├── repositories/    # Data access layer (thin wrappers over Sequelize)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic (validation, AI, alerts, competitor)
│   │   ├── utils/           # CSV parser, async handler, API response helpers
│   │   ├── workers/         # BullMQ background workers
│   │   ├── app.js           # Express app setup (CORS, middleware, routes)
│   │   └── server.js        # Entry point — DB auth + app.listen()
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/       # Quality score + severity charts
│   │   ├── jobs/            # Job history + progress + failure logs
│   │   ├── products/
│   │   │   └── [id]/        # Product detail with price gap & AI suggestions
│   │   ├── upload/          # CSV upload UI
│   │   ├── globals.css      # Design system (Outfit font, indigo palette, animations)
│   │   └── layout.js        # Root layout + font injection
│   ├── components/
│   │   ├── AppShell.js      # Top nav + layout wrapper
│   │   ├── AuthForm.js      # Register / Login form
│   │   └── ProductActions.js # Enhance Title / Refresh Prices / Edit buttons
│   ├── lib/
│   │   └── api.js           # Centralised fetch wrapper with JWT injection
│   └── package.json
│
├── docker-compose.yml       # Local PostgreSQL + Redis
├── render.yaml              # Render deployment manifest
└── README.md
```

---


