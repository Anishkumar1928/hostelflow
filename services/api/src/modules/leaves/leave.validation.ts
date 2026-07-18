import { z } from 'zod';
export const createSchema = z.object({});
export const updateSchema = z.object({});
export const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
