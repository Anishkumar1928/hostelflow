import { z } from 'zod';

export const createSchema = z.object({
  studentId: z.string().uuid('Invalid student'),
  leaveType: z.enum(['Medical', 'Personal', 'Family', 'Emergency', 'Other']).optional().default('Personal'),
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
  reason: z.string().min(1, 'Reason is required'),
  remarks: z.string().optional(),
});

export const updateSchema = z.object({
  leaveType: z.enum(['Medical', 'Personal', 'Family', 'Emergency', 'Other']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  reason: z.string().optional(),
  status: z.string().optional(),
  remarks: z.string().optional(),
  approvedBy: z.string().uuid().optional(),
});

export const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  leaveType: z.string().optional(),
  studentId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});
