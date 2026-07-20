import prisma from '../../config/database';
import { getPagination } from '../../utils/pagination';
import { ApiError } from '../../utils/apiResponse';
import { Prisma } from '@prisma/client';

const include = {
  hostel: { select: { id: true, hostelName: true } },
  warden: { select: { id: true, fullName: true, email: true } },
  _count: { select: { rooms: true } },
};

export const list = async (params: any) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);
  const search = (params.search || '').trim();
  const sortBy = params.sortBy || 'name';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
  const where: Prisma.BuildingWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (params.hostelId) where.hostelId = params.hostelId;
  if (params.gender) where.gender = params.gender;
  if (params.status) where.status = params.status;

  const orderBy: any = {};
  const sortMap: Record<string, string> = { name: 'name', capacity: 'capacity', createdAt: 'createdAt' };
  if (sortMap[sortBy]) {
    orderBy[sortMap[sortBy]] = sortOrder;
  } else {
    orderBy.name = 'asc';
  }

  const [data, total] = await Promise.all([
    prisma.building.findMany({ where, skip, take: limit, include, orderBy }),
    prisma.building.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id: string) => {
  const data = await prisma.building.findUnique({ where: { id }, include: { ...include, rooms: { include: { _count: { select: { allocations: true } } }, orderBy: { roomNumber: 'asc' } } } });
  if (!data) throw new ApiError(404, 'Building not found');
  return data;
};

export const create = async (data: any) => {
  return prisma.building.create({ data, include });
};

export const update = async (id: string, data: any) => {
  await getById(id);
  return prisma.building.update({ where: { id }, data, include });
};

export const remove = async (id: string) => {
  await getById(id);
  await prisma.building.delete({ where: { id } });
  return { id };
};
