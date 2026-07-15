export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  roleId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: boolean;
  createdAt: string;
  role?: Role;
}

export interface Student {
  id: string;
  userId: string;
  enrollmentNo?: string;
  course?: string;
  department?: string;
  year?: number;
  gender?: string;
  dob?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  bloodGroup?: string;
  user?: User;
}

export interface Hostel {
  id: string;
  hostelName: string;
  hostelType?: string;
  gender?: string;
  capacity?: number;
  address?: string;
  wardenId?: string;
  warden?: User;
  roomCount?: number;
  applicationCount?: number;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor?: number;
  roomType?: string;
  capacity?: number;
  occupied: number;
  price?: number;
  status: string;
  hostel?: Hostel;
}

export interface Application {
  id: string;
  studentId: string;
  hostelId: string;
  preferredRoomType?: string;
  reason?: string;
  status: string;
  createdAt: string;
  student?: Student;
  hostel?: Hostel;
}

export interface Allocation {
  id: string;
  studentId: string;
  roomId: string;
  allocatedDate?: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  student?: Student;
  room?: Room;
}

export interface FeeHead {
  id: string;
  feeName: string;
  amount: number;
  description?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  feeHeadId: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  status?: string;
  dueDate?: string;
  paidAt?: string;
  student?: Student;
  feeHead?: FeeHead;
}

export interface Attendance {
  id: string;
  studentId: string;
  attendanceDate?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  markedBy?: string;
  student?: Student;
}

export interface Leave {
  id: string;
  studentId: string;
  fromDate?: string;
  toDate?: string;
  reason?: string;
  approvedBy?: string;
  status: string;
  student?: Student;
}

export interface Visitor {
  id: string;
  studentId: string;
  visitorName: string;
  relation?: string;
  phone?: string;
  entryTime?: string;
  exitTime?: string;
  status?: string;
  student?: Student;
}

export interface Complaint {
  id: string;
  studentId: string;
  category?: string;
  title?: string;
  description?: string;
  priority?: string;
  assignedTo?: string;
  status: string;
  createdAt: string;
  student?: Student;
  comments?: ComplaintComment[];
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  userId: string;
  comment?: string;
  createdAt: string;
  user?: User;
}

export interface MessMenu {
  id: string;
  mealDate?: string;
  mealType?: string;
  menu?: string;
  notes?: string;
}

export interface MealAttendance {
  id: string;
  studentId: string;
  menuId: string;
  status?: string;
}

export interface Inventory {
  id: string;
  itemName: string;
  quantity?: number;
  availableQuantity?: number;
  itemCondition?: string;
  lastUpdated: string;
}

export interface Document {
  id: string;
  studentId: string;
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title?: string;
  message?: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: PaginatedResponse<unknown>['meta'];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface DashboardStats {
  totalStudents: number;
  totalHostels: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingApplications: number;
  monthlyRevenue: number;
  totalRevenue: number;
  activeAllocations: number;
  openComplaints: number;
  pendingLeaves: number;
  presentToday: number;
  totalCapacity: number;
}
