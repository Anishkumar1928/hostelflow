# HostelFlow — Team Assignment

## Member 1: Backend (API + Database)
**Location:** `services/api/`

### Responsibilities
- Prisma schema (all 25+ models)
- Express server setup with all middleware
- Authentication module (JWT, OTP, RBAC)
- All 23 API modules (routes, controllers, services)
- Database seed script
- Swagger documentation
- Email/SMS/Push notification integrations
- File upload (Cloudinary)
- Payments (Razorpay)
- Socket.IO realtime events
- Jest integration tests

### Files to create
```
services/api/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── routes.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── swagger.ts
│   │   └── socket.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validate.ts
│   │   ├── upload.ts
│   │   └── audit.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── logger.ts
│   │   ├── email.ts
│   │   └── helpers.ts
│   └── modules/
│       ├── auth/          (register, login, refresh, OTP, forgot/reset password)
│       ├── users/         (CRUD, roles, permissions)
│       ├── students/      (CRUD, search, filter)
│       ├── hostels/       (CRUD, assign warden)
│       ├── buildings/     (CRUD)
│       ├── floors/        (CRUD)
│       ├── rooms/         (CRUD)
│       ├── beds/          (CRUD)
│       ├── applications/  (apply, approve, reject)
│       ├── allocations/   (allocate, transfer, check-out)
│       ├── payments/      (create, refund, Razorpay webhook)
│       ├── attendance/    (mark, bulk, reports)
│       ├── leaves/        (apply, approve, reject)
│       ├── visitors/      (request, approve)
│       ├── complaints/    (create, assign, resolve)
│       ├── mess/          (menu CRUD, meal attendance)
│       ├── inventory/     (items CRUD)
│       ├── announcements/ (CRUD)
│       ├── notifications/ (list, mark read)
│       ├── dashboard/     (stats for admin/warden/student)
│       ├── reports/       (revenue, occupancy, attendance)
│       ├── documents/     (upload, list)
│       ├── settings/      (system settings)
│       └── maintenance/   (requests CRUD)
└── tests/
    └── *.test.ts
```

---

## Member 2: Admin Web
**Location:** `apps/admin-web/`

### Responsibilities
- React 19 + Vite + TypeScript setup
- TailwindCSS + Shadcn UI component library
- All 25+ pages (Dashboard, Students, Hostels, etc.)
- TanStack Query for API calls
- TanStack Table for data tables
- Zustand for state management
- React Router + React Hook Form + Zod
- Framer Motion animations
- Recharts for analytics
- Dark/Light mode
- Responsive layout with Sidebar + Top Navbar
- Global search

### Pages to build
```
admin-web/src/pages/
├── Dashboard/
│   ├── index.tsx
│   ├── Widgets.tsx
│   ├── Charts.tsx
│   └── RecentActivity.tsx
├── Students/
│   ├── StudentList.tsx
│   ├── StudentDetail.tsx
│   └── StudentForm.tsx
├── Hostels/
│   ├── HostelList.tsx
│   ├── HostelDetail.tsx
│   └── HostelForm.tsx
├── Buildings/
│   ├── BuildingList.tsx
│   └── BuildingForm.tsx
├── Floors/
│   ├── FloorList.tsx
│   └── FloorForm.tsx
├── Rooms/
│   ├── RoomList.tsx
│   ├── RoomDetail.tsx
│   └── RoomForm.tsx
├── Beds/
│   ├── BedList.tsx
│   └── BedForm.tsx
├── Applications/
│   ├── ApplicationList.tsx
│   └── ApplicationDetail.tsx
├── Allocations/
│   ├── AllocationList.tsx
│   └── AllocationForm.tsx
├── Payments/
│   ├── PaymentList.tsx
│   ├── PaymentDetail.tsx
│   └── InvoiceList.tsx
├── Attendance/
│   ├── AttendanceList.tsx
│   └── MarkAttendance.tsx
├── Visitors/
│   └── VisitorList.tsx
├── Complaints/
│   ├── ComplaintList.tsx
│   └── ComplaintDetail.tsx
├── Inventory/
│   └── InventoryList.tsx
├── Mess/
│   ├── MessMenu.tsx
│   └── MealAttendance.tsx
├── Reports/
│   ├── RevenueReport.tsx
│   ├── OccupancyReport.tsx
│   └── AttendanceReport.tsx
├── Settings/
│   ├── GeneralSettings.tsx
│   ├── FeeSettings.tsx
│   └── NotificationSettings.tsx
├── Users/
│   ├── UserList.tsx
│   └── UserForm.tsx
├── Roles/
│   ├── RoleList.tsx
│   └── RoleForm.tsx
├── AuditLogs/
│   └── AuditLogList.tsx
├── Profile/
│   └── ProfilePage.tsx
├── Auth/
│   ├── Login.tsx
│   └── ForgotPassword.tsx
└── NotFound.tsx
```

---

## Member 3: Student Mobile App
**Location:** `apps/student-mobile/`

### Responsibilities
- React Native + Expo + TypeScript setup
- Expo Router for navigation
- React Query for API calls
- NativeWind (TailwindCSS for RN)
- Zustand for state
- All student-facing screens

### Screens to build
```
student-mobile/src/app/
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
│   ├── verify-otp.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx          (Dashboard)
│   ├── attendance.tsx
│   ├── payments.tsx
│   └── profile.tsx
├── hostel-application.tsx
├── room-details.tsx
├── leave-request.tsx
├── leave-status.tsx
├── complaint.tsx
├── complaint-status.tsx
├── visitor-request.tsx
├── invoices.tsx
├── invoice-detail.tsx
├── mess-menu.tsx
├── notifications.tsx
├── emergency-sos.tsx
├── documents.tsx
├── edit-profile.tsx
└── settings.tsx
```

---

## Member 4: Warden Mobile App
**Location:** `apps/warden-mobile/`

### Responsibilities
- React Native + Expo + TypeScript setup
- Expo Router for navigation
- React Query for API calls
- NativeWind (TailwindCSS for RN)
- Zustand for state
- QR scanner integration
- All warden-facing screens

### Screens to build
```
warden-mobile/src/app/
├── (auth)/
│   ├── login.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx          (Dashboard)
│   ├── attendance.tsx
│   ├── complaints.tsx
│   └── profile.tsx
├── qr-scanner.tsx
├── visitor-approvals.tsx
├── visitor-detail.tsx
├── leave-requests.tsx
├── leave-detail.tsx
├── complaint-detail.tsx
├── room-allocation.tsx
├── student-search.tsx
├── student-detail.tsx
├── announcements.tsx
├── announcement-create.tsx
├── emergency-alerts.tsx
├── reports.tsx
├── report-detail.tsx
├── edit-profile.tsx
└── settings.tsx
```

---

## Convention Guide for All Members

### API Client (Admin Web & Mobile Apps)
Use Axios with base URL from env:
```
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
});
```
Attach JWT: `api.defaults.headers.common['Authorization'] = Bearer ${token}`

### Shared Packages (created first, available to all)
- `@hostelflow/types` — All TypeScript interfaces, enums, types
- `@hostelflow/shared` — Zod validation schemas, constants, utilities
- `@hostelflow/config` — Environment config loader
- `@hostelflow/ui` — Reusable React UI components (Button, Card, Input, Badge, Spinner)

### Git Workflow
```bash
git checkout -b feat/module-name   # feature branch
git commit -m "feat: description"   # conventional commits
git push origin feat/module-name
```

### File Naming
- `*.ts` for plain TypeScript
- `*.tsx` for React components
- kebab-case for directories, PascalCase for components
- One component per file

### Code Style
- Strict TypeScript (no `any` where possible)
- Named exports preferred
- Arrow functions for components
- TailwindCSS classes (no separate CSS files)
- All text in English
