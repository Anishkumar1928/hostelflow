export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export const ALLOCATION_STATUS = {
  ACTIVE: 'ACTIVE',
  CHECKED_OUT: 'CHECKED_OUT',
  TRANSFERRED: 'TRANSFERRED',
} as const;

export const COMPLAINT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const COMPLAINT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  PARTIALLY: 'PARTIALLY',
  FULL: 'FULL',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  LEAVE: 'LEAVE',
} as const;

export const PAYMENT_METHODS = [
  'CASH',
  'ONLINE',
  'BANK_TRANSFER',
  'CHEQUE',
] as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  REFUNDED: 'REFUNDED',
} as const;

export const ROOM_TYPES = [
  'SINGLE',
  'DOUBLE',
  'TRIPLE',
  'FOUR_SEATER',
  'DORMITORY',
] as const;

export const HOSTEL_TYPES = [
  'BOYS',
  'GIRLS',
  'CO_ED',
] as const;

export const COMPLAINT_CATEGORIES = [
  'ELECTRICAL',
  'PLUMBING',
  'FURNITURE',
  'CLEANING',
  'INTERNET',
  'WATER',
  'SECURITY',
  'MESS',
  'OTHER',
] as const;

export const NOTIFICATION_TYPES = [
  'APPLICATION',
  'ALLOCATION',
  'PAYMENT',
  'ATTENDANCE',
  'LEAVE',
  'VISITOR',
  'COMPLAINT',
  'ANNOUNCEMENT',
  'EMERGENCY',
  'GENERAL',
] as const;

export const MODULES = [
  'DASHBOARD',
  'STUDENTS',
  'HOSTELS',
  'ROOMS',
  'APPLICATIONS',
  'ALLOCATIONS',
  'PAYMENTS',
  'ATTENDANCE',
  'LEAVES',
  'VISITORS',
  'COMPLAINTS',
  'MESS',
  'INVENTORY',
  'DOCUMENTS',
  'NOTIFICATIONS',
  'USERS',
  'ROLES',
  'REPORTS',
  'SETTINGS',
] as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
  ACTIVE: 'green',
  CHECKED_OUT: 'gray',
  OPEN: 'blue',
  IN_PROGRESS: 'yellow',
  RESOLVED: 'green',
  CLOSED: 'gray',
  PAID: 'green',
  OVERDUE: 'red',
  AVAILABLE: 'green',
  PARTIALLY: 'orange',
  FULL: 'red',
  MAINTENANCE: 'gray',
  PRESENT: 'green',
  ABSENT: 'red',
  LATE: 'orange',
  LEAVE: 'blue',
  CANCELLED: 'gray',
  DRAFT: 'gray',
};
