# Team Task Manager

A modern full-stack project management prototype.

## Features
- **Auth:** JWT-based signup and login.
- **Dashboard:** Overview of projects and task statistics.
- **Kanban Board:** Real-time task status updates using Socket.io.
- **RBAC:** Role-based access (Admin/Member).

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Shadcn UI, Zustand, React Query.
- **Backend:** Node.js, Express, Prisma, Socket.io.
- **Database:** PostgreSQL (via Prisma).

## Submission Details
- **Live URL:** [Insert Railway Live URL here]
- **GitHub Repo:** [Insert GitHub Repository URL here]
- **Demo Video:** [Insert Demo Video Link (2–5 min) here]

## Getting Started
...
### Deployment (Railway)
1. Link your GitHub repository to Railway.
2. Set the root directory to `team-task-manager` (if using a monorepo setup) or follow Railway's multi-service deployment.
3. Add the environment variables listed above to the Railway project settings.
4. Ensure you have a PostgreSQL database provisioned in Railway and linked via `DATABASE_URL`.
5. Use the `npm run build` command for the build step.

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database

### 2. Setup
Run from the root directory:
```bash
npm install
```

### 3. Environment Variables
Create `.env` files in `backend/` and `frontend/`.

**backend/.env:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET="your_secret"
PORT=5000
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 4. Database Migration
```bash
cd backend
npx prisma migrate dev
```

### 5. Run the application
```bash
npm run dev
```
The frontend will be at `http://localhost:3000` and backend at `http://localhost:5000`.
