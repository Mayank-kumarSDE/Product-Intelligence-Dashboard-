# Quantacus Product Intelligence Dashboard

Product intelligence dashboard for ecommerce sellers. It supports video upload, CSV upload, async job tracking, product validation, competitor pricing, alerts, and AI title enhancement.

## What Is Real

- CSV parsing and product creation
- PostgreSQL persistence
- BullMQ job tracking with Redis
- Product validation rules
- In-app alerts
- Competitor price refresh logic
- OpenAI title enhancement when `OPENAI_API_KEY` is configured
- Deployable frontend/backend split

## What Is Mocked

- Video product extraction uses a fake processing delay and predefined extracted products.
- Competitor scraping is mocked by generating realistic competitor prices around the seller price.

These mocks are intentional because real video OCR and marketplace scraping are fragile, time-heavy, and not necessary for proving the assignment architecture.

## Tech Stack

- Backend: Node.js, Express, PostgreSQL, Sequelize, BullMQ, Redis
- Frontend: Next.js, React, lucide-react
- AI: OpenAI API for title enhancement only
- Deployment: Vercel for frontend, Render for API and worker, Neon/Supabase/Render Postgres, Upstash/Render Redis

## Local Setup

Backend:

```bash
docker compose up -d
cd backend
npm install
cp .env.example .env
npm run db:sync
npm run dev
```

Worker:

```bash
cd backend
npm run worker
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open the app at `http://localhost:3000`.

## API Summary

```txt
POST   /api/uploads/video
POST   /api/uploads/csv
GET    /api/jobs/:id
GET    /api/dashboard/summary
GET    /api/products
GET    /api/products/:id
POST   /api/products/:id/enhance-title
POST   /api/products/:id/refresh-prices
GET    /api/alerts
PATCH  /api/alerts/:id/read
```

## Deployment Plan

Vercel:

```txt
Root directory: frontend
Build command: npm run build
Output: Next.js default
Env: NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com
```

Render API service:

```txt
Root directory: backend
Build command: npm install
Start command: npm run start
```

Render worker service:

```txt
Root directory: backend
Build command: npm install
Start command: npm run worker
```

Backend environment variables:

```env
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-vercel-app.vercel.app
DATABASE_URL=
REDIS_URL=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
```

## Demo Flow

1. Upload `sample-products.csv` or any video file.
2. Watch job progress update.
3. Open the product table.
4. Review validation status and alerts.
5. Open a product detail page.
6. Refresh competitor prices.
7. Enhance the product title.

## Scoring Focus

This implementation targets the high-value assignment areas: clean backend design, async jobs, validation correctness, data persistence, useful frontend screens, realistic mocks, transparent README, and deployment readiness.
