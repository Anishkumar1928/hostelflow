# HostelFlow — Team Assignment

## Database Schema (Simplified)

**Connection:** `postgresql://neondb_owner:npg_ijEzSd7hJ1ny@ep-wild-haze-az6z86fa-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

19 tables: `roles`, `users`, `students`, `hostels`, `rooms`, `applications`, `allocations`, `fee_heads`, `payments`, `attendance`, `leaves`, `visitors`, `complaints`, `complaint_comments`, `mess_menu`, `meal_attendance`, `inventory`, `documents`, `notifications`

---

## Member 1: Backend (API + Database)
**Location:** `services/api/`

### Tasks
1. Prisma schema (`prisma/schema.prisma`) — 19 models matching the SQL
2. Express server with middleware (CORS, Helmet, rate limit, error handler)
3. Auth module — register, login, JWT, refresh tokens
4. Users + Roles CRUD
5. Students CRUD
6. Hostels CRUD
7. Rooms CRUD (with occupied/slots tracking)
8. Applications module — create, approve, reject
9. Allocations module — allocate room, check-in, check-out
10. Payments module — fee heads, payments, Razorpay integration
11. Attendance module — mark, bulk, history
12. Leaves module — apply, approve, reject
13. Visitors module — log entry/exit
14. Complaints module — CRUD, assign, comment thread
15. Mess module — menu, meal attendance
16. Inventory module — items, quantities
17. Documents module — upload, list
18. Notifications module — list, mark read
19. Dashboard stats endpoint
20. Reports endpoint
21. Database seed script

**Files to create:**
```
prisma/schema.prisma, seed.ts
src/index.ts, app.ts, routes.ts
src/config/ (env, database, swagger, socket)
src/middleware/ (auth, errorHandler, validate, upload, audit)
src/utils/ (jwt, password, logger, email, helpers)
src/modules/*/ (routes, controller, service per module)
tests/*.test.ts
```

---

## Member 2: Admin Web (React 19 + Vite + TailwindCSS)
**Location:** `apps/admin-web/`

### Pages
- **Auth:** Login, Forgot Password
- **Dashboard:** Stats cards, charts, recent activity
- **Students:** List with search/filter, detail, create/edit form
- **Hostels:** List, detail, create/edit form
- **Rooms:** List per hostel, detail, create/edit
- **Applications:** List with status filter, approve/reject actions
- **Allocations:** List, create allocation wizard
- **Payments:** Fee heads, payments list, invoices
- **Attendance:** Calendar view, mark attendance form
- **Leaves:** List, approve/reject
- **Visitors:** List with log entry/exit
- **Complaints:** List, detail with comment thread
- **Mess:** Menu editor, meal attendance
- **Inventory:** Items list, CRUD
- **Reports:** Revenue, occupancy, attendance
- **Users:** User list, role management
- **Profile:** View/edit profile

**Tech:** React 19, Vite, TypeScript, TailwindCSS, Shadcn UI, TanStack Query/Table, Zustand, React Router, React Hook Form, Zod, Framer Motion, Recharts

---

## Member 3: Student Mobile (React Native + Expo)
**Location:** `apps/student-mobile/`

### Screens
- **Auth:** Login, Register
- **Dashboard:** Overview with room info, attendance %, dues
- **Hostel Application:** Apply for hostel, check status
- **Room Details:** View allocated room
- **Attendance:** History, monthly stats
- **Leave:** Apply, status tracking
- **Complaint:** Create, track status
- **Visitor:** Request visitor entry
- **Payments:** Pay fees, view invoices
- **Mess Menu:** Weekly menu
- **Notifications:** List
- **Profile:** Edit info, documents
- **Emergency SOS:** Alert warden

**Tech:** Expo, TypeScript, Expo Router, React Query, Axios, NativeWind, Zustand

---

## Member 4: Warden Mobile (React Native + Expo)
**Location:** `apps/warden-mobile/`

### Screens
- **Auth:** Login
- **Dashboard:** Today stats, pending approvals
- **Attendance:** List today, mark manually
- **Visitor Approvals:** Approve/reject entry
- **Leave Approvals:** Approve/reject requests
- **Complaints:** List, assign, resolve
- **Room Allocation:** Assign rooms to students
- **Student Search:** Search by name/room
- **Announcements:** Create, list
- **Emergency Alerts:** Send/view alerts
- **Reports:** Quick stats
- **Profile:** Edit info

**Tech:** Expo, TypeScript, Expo Router, React Query, Axios, NativeWind, Zustand

---

## Shared Packages (All Members)

### @hostelflow/types
TypeScript interfaces for all 19 models + API responses

### @hostelflow/shared
Zod validations, constants (status enums, categories), utility functions

### @hostelflow/config
Environment config loader

### @hostelflow/ui
Reusable components: Button, Card, Input, Badge, Spinner

---

## Git Workflow

```bash
git checkout -b feat/module-name   # branch per issue
git commit -m "feat: description"
git push origin feat/module-name
# Create PR on GitHub → merge to master
```
