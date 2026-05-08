# Assignment: Team Task Manager (Full-Stack)

## Project Overview
Build a web app where users can create projects, assign tasks, and track progress with role-based access (Admin/Member).

### 🚀 Key Features
- **Authentication:** Secure Signup/Login using JWT and Bcrypt.
- **Project & Team Management:** Create projects and invite team members via email.
- **Task Management:** Create, assign, and track tasks using a real-time Kanban board.
- **Dashboard:** Comprehensive overview with stats for projects, tasks (Todo, In Progress, Completed), and overdue tracking.

### ⚙️ Requirements
- **Tech Stack:** Next.js 15, Node.js, Express, Prisma ORM, Socket.io, PostgreSQL.
- **REST APIs:** Fully implemented for Auth, Projects, Tasks, and Dashboard stats.
- **Validations & Relationships:** Robust data integrity using Prisma and Zod/manual checks.
- **RBAC:** Admin/Member role-based access control.

---

## 🛠 Process & Progress

### 1. Research & Planning
- [x] Analyze assignment requirements.
- [x] Design database schema (User, Project, Task, Member).
- [x] Map out API architecture and real-time event flow.

### 2. Backend Implementation
- [x] Initialize Express with TypeScript.
- [x] Set up Prisma and PostgreSQL schema.
- [x] Implement JWT Authentication and RBAC middleware.
- [x] Build Project and Task CRUD with Socket.io integration.
- [x] Implement Dashboard Stats with overdue task logic.
- [x] Add Team Management (Member invitations).

### 3. Frontend Implementation
- [x] Scaffold Next.js 15 with Shadcn UI and Tailwind.
- [x] Implement state management with Zustand and React Query.
- [x] Build Login/Signup and AuthGuard protection.
- [x] Create Dashboard with summary widgets.
- [x] Build Real-time Kanban Board with task movement logic.
- [x] Integrate Socket.io client for live updates.

### 4. Final Refinements
- [x] Unified monorepo build scripts.
- [x] Updated README with submission details.
- [x] Overdue task tracking logic.

---

## 📦 Submission Checklist
- [ ] **Live URL:** [Insert Railway Live URL here]
- [ ] **GitHub Repo:** [Insert GitHub Repository URL here]
- [ ] **README:** Updated with setup and deployment instructions.
- [ ] **Demo Video:** 2–5 min video (Include link in README).

---

## 🌐 Deployment (Mandatory)
- **Target:** Railway
- **Status:** Ready for deployment.
- **Action:** Ensure environment variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`) are configured in Railway dashboard.
