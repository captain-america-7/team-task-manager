# Team Task Manager Design Specification

**Date:** 2026-05-07
**Status:** Approved

## 1. Overview
A modern full-stack SaaS prototype for team project management. It features role-based access control, a real-time Kanban board, and a comprehensive dashboard.

## 2. Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Socket.io.
- **Auth:** JWT, Bcrypt, Zod.
- **Deployment:** Railway (PostgreSQL, Frontend, Backend).

## 3. Architecture
- **Structure:** Monorepo with `frontend/` and `backend/` subdirectories.
- **Pattern:** MVC/Service-based backend, RESTful API.
- **Communication:** HTTP for REST API, WebSockets (Socket.io) for real-time task status updates.

## 4. Data Schema
- **User:** `id`, `email`, `password`, `name`, `role` (ADMIN, MEMBER).
- **Project:** `id`, `name`, `description`, `status`, `deadline`, `progress`, `creatorId`.
- **ProjectMember:** `id`, `projectId`, `userId`.
- **Task:** `id`, `title`, `description`, `priority` (LOW, MEDIUM, HIGH), `status` (TODO, IN_PROGRESS, COMPLETED), `dueDate`, `assignedUserId`, `projectId`.
- **Comment:** `id`, `content`, `userId`, `taskId`, `createdAt`.
- **ActivityLog:** `id`, `action`, `userId`, `projectId`, `taskId`, `timestamp`.

## 5. Core Features
- **Authentication:** Signup, Login, Logout, JWT middleware.
- **RBAC:** Admins can manage projects and members; Members can update their own tasks and comment.
- **Project Management:** Create/Edit/Delete projects, assign members.
- **Task Management:** Kanban board with drag-and-drop, real-time status syncing.
- **Dashboard:** Statistical widgets and activity feed.
- **Email Invites:** Mocked via console logging for the prototype.

## 6. API Endpoints (Partial)
- `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
- `GET /projects`, `POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`
- `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`
- `GET /dashboard/stats`

## 7. Success Criteria
- Functional prototype running locally.
- Real-time task updates visible across multiple tabs.
- Proper RBAC enforcement on both frontend and backend.
- Visual parity with modern SaaS designs.
