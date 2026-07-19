import prisma from '../../config/database';

const leaveSelect = {
  id: true,
  studentId: true,
  leaveType: true,
  fromDate: true,
  toDate: true,
  reason: true,
  status: true,
  remarks: true,
  createdAt: true,
  updatedAt: true,
  student: { select: { id: true, enrollmentNo: true, course: true, department: true, year: true, user: { select: { fullName: true, email: true, phone: true } } } },
  approvedByUser: { select: { id: true, fullName: true } },
};

export const list = async (params: any) => {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 10));
  const skip = (page - 1) * limit;
  const search = params.search || '';
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

  const where: any = {};
  if (search) {
    where.OR = [
      { reason: { contains: search, mode: 'insensitive' } },
      { student: { user: { fullName: { contains: search, mode: 'insensitive' } } } },
    ];
  }
  if (params.status) {
    where.status = params.status.toUpperCase();
  }
  if (params.leaveType) {
    where.leaveType = params.leaveType;
  }
  if (params.studentId) {
    where.studentId = params.studentId;
  }

  const orderBy: any = {};
  const sortMap: Record<string, string> = { createdAt: 'createdAt', fromDate: 'fromDate', status: 'status' };
  orderBy[sortMap[sortBy] || 'createdAt'] = sortOrder;

  const [data, total] = await Promise.all([
    prisma.leave.findMany({ where, skip, take: limit, orderBy, select: leaveSelect }),
    prisma.leave.count({ where }),
  ]);

  return { data, total };
};

export const getById = async (id: string) => {
  return prisma.leave.findUnique({ where: { id }, select: leaveSelect });
};

export const create = async (data: any) => {
  return prisma.leave.create({
    data: {
      studentId: data.studentId,
      leaveType: data.leaveType || 'Personal',
      fromDate: data.fromDate ? new Date(data.fromDate) : null,
      toDate: data.toDate ? new Date(data.toDate) : null,
      reason: data.reason || '',
      status: 'PENDING',
      remarks: data.remarks || null,
    },
    select: leaveSelect,
  });
};

export const update = async (id: string, data: any) => {
  const updateData: any = {};
  if (data.leaveType) updateData.leaveType = data.leaveType;
  if (data.fromDate) updateData.fromDate = new Date(data.fromDate);
  if (data.toDate) updateData.toDate = new Date(data.toDate);
  if (data.reason !== undefined) updateData.reason = data.reason;
  if (data.status) updateData.status = data.status;
  if (data.remarks !== undefined) updateData.remarks = data.remarks;
  if (data.approvedBy) {
    updateData.approvedBy = data.approvedBy;
    updateData.status = data.status || 'APPROVED';
  }

  return prisma.leave.update({ where: { id }, data: updateData, select: leaveSelect });
};

export const remove = async (id: string) => {
  await prisma.leave.delete({ where: { id } });
  return { id };
};
