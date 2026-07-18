import prisma from '../../config/database';
export const list = async (params: any) => ({ data: [], total: 0 });
export const getById = async (id: string) => null;
export const create = async (data: any) => data;
export const update = async (id: string, data: any) => data;
export const remove = async (id: string) => ({ id });
