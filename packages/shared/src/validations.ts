import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  fullName: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().optional(),
  roleId: z.string().uuid().optional(),
});

export const createHostelSchema = z.object({
  hostelName: z.string().min(1).max(100),
  hostelType: z.string().optional(),
  gender: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  address: z.string().optional(),
  wardenId: z.string().uuid().optional(),
});

export const createRoomSchema = z.object({
  hostelId: z.string().uuid(),
  roomNumber: z.string().min(1).max(20),
  floor: z.number().int().min(0).optional(),
  roomType: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
});

export const createApplicationSchema = z.object({
  studentId: z.string().uuid(),
  hostelId: z.string().uuid(),
  preferredRoomType: z.string().optional(),
  reason: z.string().optional(),
});

export const createAllocationSchema = z.object({
  studentId: z.string().uuid(),
  roomId: z.string().uuid(),
  allocatedDate: z.string().optional(),
  checkIn: z.string().optional(),
});

export const createPaymentSchema = z.object({
  studentId: z.string().uuid(),
  feeHeadId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  dueDate: z.string().optional(),
});

export const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  attendanceDate: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.string().optional(),
});

export const createLeaveSchema = z.object({
  studentId: z.string().uuid(),
  fromDate: z.string(),
  toDate: z.string(),
  reason: z.string().optional(),
});

export const createVisitorSchema = z.object({
  studentId: z.string().uuid(),
  visitorName: z.string().min(1).max(100),
  relation: z.string().optional(),
  phone: z.string().optional(),
});

export const createComplaintSchema = z.object({
  studentId: z.string().uuid(),
  category: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.string().optional(),
});

export const addComplaintCommentSchema = z.object({
  complaintId: z.string().uuid(),
  comment: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.string().optional(),
  hostelId: z.string().uuid().optional(),
});
