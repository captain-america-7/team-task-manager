# Team Task Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern full-stack Team Task Manager with authentication, RBAC, real-time Kanban board, and a dashboard.

**Architecture:** Monorepo with `frontend` (Next.js) and `backend` (Express) subdirectories. Prisma ORM with PostgreSQL for data persistence. Socket.io for real-time task status updates.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand, Node.js, Express, Prisma, PostgreSQL, Socket.io, JWT.

---

### Task 1: Initialize Monorepo & Backend Structure

**Files:**
- Create: `package.json` (root)
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`

- [ ] **Step 1: Initialize root package.json**
```json
{
  "name": "team-task-manager",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

- [ ] **Step 2: Initialize backend directory**
Run: `mkdir -p backend/src && cd backend && npm init -y`

- [ ] **Step 3: Install backend dependencies**
Run: `npm install express cors dotenv jsonwebtoken bcrypt zod @prisma/client socket.io`
Run: `npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt ts-node-dev prisma`

- [ ] **Step 4: Configure backend tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 5: Create basic server structure**
In `backend/src/app.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
```

- [ ] **Step 6: Run health check**
Run: `npm run dev` and verify `http://localhost:5000/health` (adjust port as needed).

- [ ] **Step 7: Commit**
```bash
git add .
git commit -m "chore: initialize monorepo and backend structure"
```

---

### Task 2: Setup Database Schema & Prisma

**Files:**
- Create: `backend/prisma/schema.prisma`
- Modify: `backend/.env`

- [ ] **Step 1: Initialize Prisma**
Run: `npx prisma init` in `backend/` folder.

- [ ] **Step 2: Define Schema**
In `backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  TODO
  IN_PROGRESS
  COMPLETED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(MEMBER)
  projects  ProjectMember[]
  tasks     Task[]
  comments  Comment[]
  activityLogs ActivityLog[]
  createdAt DateTime @default(now())
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  status      String   @default("active")
  deadline    DateTime?
  progress    Int      @default(0)
  creatorId   String
  members     ProjectMember[]
  tasks       Task[]
  activityLogs ActivityLog[]
  createdAt   DateTime @default(now())
}

model ProjectMember {
  id        String   @id @default(uuid())
  projectId String
  userId    String
  project   Project @relation(fields: [projectId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  @@unique([projectId, userId])
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  priority    Priority @default(MEDIUM)
  status      Status   @default(TODO)
  dueDate     DateTime?
  assignedUserId String?
  projectId   String
  user        User?    @relation(fields: [assignedUserId], references: [id])
  project     Project  @relation(fields: [projectId], references: [id])
  comments    Comment[]
  activityLogs ActivityLog[]
  createdAt   DateTime @default(now())
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  userId    String
  taskId    String
  user      User     @relation(fields: [userId], references: [id])
  task      Task     @relation(fields: [taskId], references: [id])
  createdAt DateTime @default(now())
}

model ActivityLog {
  id        String   @id @default(uuid())
  action    String
  userId    String
  projectId String?
  taskId    String?
  user      User     @relation(fields: [userId], references: [id])
  project   Project? @relation(fields: [projectId], references: [id])
  task      Task?    @relation(fields: [taskId], references: [id])
  timestamp DateTime @default(now())
}
```

- [ ] **Step 3: Run Migration**
Run: `npx prisma migrate dev --name init`

- [ ] **Step 4: Commit**
```bash
git add backend/prisma backend/.env
git commit -m "feat: setup prisma schema and initial migration"
```

---

### Task 3: Implement Authentication (Backend)

**Files:**
- Create: `backend/src/controllers/auth.controller.ts`
- Create: `backend/src/routes/auth.routes.ts`
- Create: `backend/src/middleware/auth.middleware.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Write Auth Controller**
Implement `signup`, `login`, and `getMe` using `bcrypt` for hashing and `jsonwebtoken` for signing tokens.

- [ ] **Step 2: Write Auth Middleware**
Implement `authenticateJWT` and `authorizeRole(['ADMIN'])`.

- [ ] **Step 3: Register Routes**
Mount `/api/auth` in `app.ts`.

- [ ] **Step 4: Test with Postman/Insomnia**
Verify JWT issuance and protected routes.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: implement backend authentication and RBAC middleware"
```

---

### Task 4: Initialize Frontend & Shadcn UI

**Files:**
- Create: `frontend/` (via create-next-app)
- Modify: `frontend/tailwind.config.ts`

- [ ] **Step 1: Create Next.js App**
Run: `npx create-next-app@latest frontend --ts --tailwind --eslint --app`

- [ ] **Step 2: Initialize Shadcn UI**
Run: `npx shadcn-ui@latest init` in `frontend/`

- [ ] **Step 3: Install UI Components**
Run: `npx shadcn-ui@latest add button card input label tabs toast skeleton`

- [ ] **Step 4: Install State Mgmt Libraries**
Run: `npm install zustand @tanstack/react-query axios framer-motion lucide-react`

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: initialize frontend with nextjs and shadcn"
```

---

### Task 5: Implement Authentication (Frontend)

**Files:**
- Create: `frontend/src/store/useAuthStore.ts`
- Create: `frontend/src/app/(auth)/login/page.tsx`
- Create: `frontend/src/app/(auth)/signup/page.tsx`
- Create: `frontend/src/components/auth/AuthGuard.tsx`

- [ ] **Step 1: Setup Zustand Store**
Manage `user`, `token`, and `isAuthenticated` state.

- [ ] **Step 2: Build Login/Signup Pages**
Use Shadcn forms and `react-hook-form` + `zod`.

- [ ] **Step 3: Implement Auth Guard**
Create a HOC or wrapper to protect dashboard routes.

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: implement frontend authentication pages and logic"
```

---

### Task 6: Project & Task Management (Full Stack)

- [ ] **Step 1: Implement Project CRUD on Backend**
Routes for list, create, update, delete. Add RBAC check for delete.

- [ ] **Step 2: Implement Task CRUD on Backend**
Routes for project-specific tasks.

- [ ] **Step 3: Build Project Dashboard UI**
List projects, show progress bars, create project modal.

- [ ] **Step 4: Build Kanban Board UI**
Columns for TODO, IN_PROGRESS, COMPLETED. Use `@dnd-kit/core` for drag-and-drop.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: implement project and task management core functionality"
```

---

### Task 7: Real-time Updates with Socket.io

- [ ] **Step 1: Setup Socket.io on Backend**
In `server.ts`, wrap the express app with `http.createServer`.

- [ ] **Step 2: Emit Status Changes**
When a task status is updated via REST, emit a `task:updated` event to the project room.

- [ ] **Step 3: Setup Socket.io Client on Frontend**
Create a `useSocket` hook to listen for updates and invalidate React Query queries.

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add real-time task status updates using socket.io"
```

---

### Task 8: Dashboard & Final Polish

- [ ] **Step 1: Implement Dashboard Stats API**
Backend aggregation query for user-specific stats.

- [ ] **Step 2: Build Dashboard Widgets**
Charts and summary cards using `recharts` (optional) or simple CSS.

- [ ] **Step 3: Add Dark/Light Mode**
Use `next-themes`.

- [ ] **Step 4: Add Framer Motion Animations**
Smooth transitions for page loads and modal opens.

- [ ] **Step 5: Final Commit**
```bash
git add .
git commit -m "feat: complete dashboard and apply final UI/UX polish"
```
