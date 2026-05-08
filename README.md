# Maritime Ops Compliance — Backend

Express + TypeScript REST API for ships, crew, maintenance tasks, safety drills, and aggregated compliance. Uses **MongoDB** via **Mongoose** and **Zod** for request validation.

## Tech stack

- **Node.js**, **Express**
- **TypeScript** (compiled with `tsc`; dev uses `tsx`)
- **MongoDB** + **Mongoose**
- **Zod** (route body/query validation)
- **dotenv** (configuration)

## Prerequisites

- Node.js 18+
- npm
- A running MongoDB instance (local or Atlas)

## Environment

Copy `.env.example` to `.env` and adjust:

| Variable           | Description |
|--------------------|-------------|
| `PORT`             | HTTP listen port (default `4000`) |
| `MONGODB_URI`      | MongoDB connection string. Required in production; in local dev can be omitted to fall back per `src/config/database.ts`. |
| `LOCAL_MONGODB_URI`| Optional non-production override when `MONGODB_URI` is unset |
| `SEED_DATABASE`    | Set to `true` to run seed logic on startup (see `src/services/seed.service.ts`) |
| `NODE_ENV`         | Use `production` when deploying (stricter URI rules) |

## Scripts

From this directory:

```bash
npm install
npm run dev    # tsx watch on src/server.ts
npm run build
npm run start  # node dist/server.js (after build)
```

Ensure MongoDB is reachable before starting.

## API overview

- Base path: `/api`
- Health: `GET /api/health`
- Resources: `/api/ships`, `/api/crew`, `/api/maintenance`, `/api/drills`, `/api/compliance`

Admin-only **create** endpoints expect header: `x-user-role: admin`.

List endpoints support optional pagination via `page` and `limit` query parameters.

Full contract tables and examples live in [`../docs/03_API_Documentation.md`](../docs/03_API_Documentation.md).

## Project layout (high level)

| Path | Role |
|------|------|
| `src/server.ts` | Process entry: DB connect, optional seed, listen |
| `src/app.ts` | Express app: CORS, JSON, routes, error handler |
| `src/routes/` | HTTP handlers per domain |
| `src/models/` | Mongoose schemas |
| `src/compliance.ts` | Compliance percentages and risk status |
| `src/config/database.ts` | MongoDB URI resolution and connect |
| `src/middleware/require-role.ts` | Admin header guard |

## Related docs

- Root overview and Docker: [`../README.md`](../README.md)
- Schema and compliance: [`../docs/04_MongoDB_Database_Design.md`](../docs/04_MongoDB_Database_Design.md), [`../docs/06_Compliance_and_Risk_Tracking.md`](../docs/06_Compliance_and_Risk_Tracking.md)
