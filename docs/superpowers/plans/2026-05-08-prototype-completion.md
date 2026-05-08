# Team Task Manager Completion Plan

## Objective
Complete the basic prototype of the Team Task Manager by initializing the frontend, finishing the backend, and integrating both layers to fulfill the original design specifications.

## Key Files & Context
- **Root:** `package.json` (monorepo setup)
- **Backend:** `server.ts` (Socket.io), `controllers/dashboard.controller.ts` (Stats)
- **Frontend:** New Next.js 15 application.

## Implementation Steps

1. **Monorepo Setup:** 
   - [x] Create root `package.json` with `concurrently` to easily run both frontend and backend.
2. **Backend Completion:**
   - [x] Integrate `socket.io` in `server.ts` to emit events when tasks are updated.
   - [x] Implement a new `/api/dashboard/stats` endpoint to aggregate user project/task statistics.
3. **Frontend Initialization:**
   - [x] Scaffold a Next.js app in the `frontend/` directory.
   - [x] Initialize Shadcn UI and install required components (buttons, cards, forms, dialogs).
   - [x] Configure global state management (Zustand) and data fetching (React Query).
4. **Frontend Implementation:**
   - [x] **Authentication:** Build Login/Signup pages and an AuthGuard component to protect routes.
   - [x] **Dashboard:** Create a summary view displaying project lists and aggregated statistics.
   - [x] **Kanban Board:** Implement the task board with drag-and-drop functionality (using buttons for now) with columns for TODO, IN_PROGRESS, and COMPLETED.
   - [x] **Real-time Sync:** Integrate the Socket.io client to listen for task updates and instantly reflect changes on the board.

## Verification & Testing
- [x] Ensure the application starts seamlessly using a single `npm run dev` command from the root.
- [x] Validate the complete user journey: Signup -> Create Project -> Create Task -> Move Task.
- [x] Test real-time synchronization by opening the Kanban board in two separate browser tabs and verifying that moving a task in one tab updates the other instantly.

## Submission Checklist
- [ ] Deploy to Railway (Mandatory)
- [ ] Push to GitHub
- [ ] Update README with Live URL and Repo URL
- [ ] Record 2–5 min demo video (Include link in README)