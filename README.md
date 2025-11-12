# Community Q&A Platform

A production-ready foundation for a community-driven Q&A platform inspired by Stack Overflow. The project is split into a Next.js 14 frontend and an Express/MongoDB backend, fully containerized with Docker and prepared for CI/CD via GitHub Actions.

## Tech Stack

- Frontend: Next.js 14 (App Router) + Tailwind CSS
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Containerization: Docker & Docker Compose
- CI/CD: GitHub Actions targeting Docker Hub + optional Render deploy hook

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/pratham-prog861/community-qa.git
cd community-qa

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

> **Node.js 18+** is required for both applications.

### 2. Configure Environment Variables

Copy `.env.example` to `.env` at the repository root (or create separate files inside `frontend` and `backend`) and update values as needed:

```bash
cp .env.example .env
```

Key variables:

- `NEXT_PUBLIC_API_URL` – Public API URL consumed by the frontend
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret used for signing JWT tokens
- `CLIENT_ORIGIN` – Allowed origin for CORS
- `LOG_LEVEL` – Logging verbosity for the backend

### 3. Run Locally with npm

In two terminals:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. Run with Docker Compose

#### Development Environment

```bash
# Quick start
make dev

# Or manually
docker compose -f docker-compose.dev.yml up --build
```

#### Production Environment

```bash
# Setup and deploy
make setup ENV=production
make deploy ENV=production

# Or manually
docker compose --env-file .env.production up --build -d
```

Services:

- `frontend`: Next.js app on port `3000`
- `backend`: Express API on port `5000`
- `mongo`: MongoDB instance on port `27017` with a persistent volume `mongo-data`

Stop and clean up:

```bash
make down ENV=production
# Or: docker compose down
```

For detailed operations guide, see [OPERATIONS.md](OPERATIONS.md)

### 5. Available Scripts

#### Frontend (`/frontend`)

- `npm run dev` – Start Next.js dev server
- `npm run build` – Create production build
- `npm run start` – Run production server
- `npm run lint` – Lint with ESLint
- `npm run type-check` – Validate TypeScript types

#### Backend (`/backend`)

- `npm run dev` – Start development server with nodemon
- `npm run start` – Start production server
- `npm run lint` – Lint using ESLint flat config
- `npm run test` – Placeholder test runner (extend with real tests)

### 6. CI/CD Pipeline

Workflow defined in `.github/workflows/ci-cd.yml`:

1. Install dependencies and run backend tests
2. Install dependencies and build the frontend
3. Build Docker images for frontend and backend
4. Push images to Docker Hub (`pratham-prog861/community-qa-frontend`, `pratham-prog861/community-qa-backend`)
5. Optionally trigger a Render deployment using `RENDER_DEPLOY_HOOK_URL` secret

Provide the following GitHub Secrets:

- `DOCKER_HUB_USERNAME`
- `DOCKER_HUB_PASSWORD`
- _(Optional)_ `RENDER_DEPLOY_HOOK_URL`

### 7. Admin & Moderation Features

The platform includes comprehensive admin and moderation capabilities:

#### Flagging System

- Users can flag inappropriate content (questions, answers, comments)
- Flag reasons: spam, offensive, low-quality, duplicate, off-topic, other
- Admins can review, resolve, or dismiss flags

#### User Management

- Ban/unban users with reason tracking
- View all users with search and filtering
- Banned users cannot access the platform

#### Content Moderation

- Delete flagged content (questions, answers, comments)
- All moderation actions are logged
- Comprehensive audit trail for accountability

#### API Endpoints

**Flags** (`/api/flags`):

- `POST /api/flags` — Create a flag (authenticated users)
- `GET /api/flags` — List flags with filtering (admin only)
- `PATCH /api/flags/:flagId/review` — Review a flag (admin only)

**Admin** (`/api/admin`):

- `POST /api/admin/users/:userId/ban` — Ban a user
- `POST /api/admin/users/:userId/unban` — Unban a user
- `DELETE /api/admin/content/:contentType/:contentId` — Delete content
- `GET /api/admin/moderation-logs` — View moderation history
- `GET /api/admin/users` — List and search users

All admin endpoints require authentication and admin role.

### 8. Next Steps

- Expand test coverage (unit, integration, and e2e)
- Add email notifications for moderation actions
- Implement appeal system for banned users
- Add bulk moderation actions
- Hook up monitoring/log aggregation for production

### 9. API Overview (Q&A)

The Express API now exposes question management endpoints under `/api/questions`:

- `GET /api/questions` — list questions with `search`, `tags`, `sort`, `page`, `limit`
- `POST /api/questions` — create a question (authenticated)
- `GET /api/questions/:questionId` — question detail including answers and comments
- `PATCH|DELETE /api/questions/:questionId` — modify or remove (owner/admin)
- `POST /api/questions/:questionId/answers` — add answers, plus CRUD on `/answers/:answerId`
- `POST /api/questions/:questionId/comments` — add comments; also available for answers via `/answers/:answerId/comments`

All create/update endpoints require a bearer access token (JWT) plus the refresh-token cookie for session longevity.

## Project Structure

```
community-qa/
├── frontend/            # Next.js application
├── backend/             # Express API
├── docker-compose.yml   # Multi-service orchestration
├── .github/workflows/   # CI/CD configuration
├── .env.example         # Sample environment variables
└── README.md
```

This scaffold is ready for iterative development—build features, extend API routes, and plug in your preferred deployment targets.
