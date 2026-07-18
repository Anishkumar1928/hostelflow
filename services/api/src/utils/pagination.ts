export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (queryPage?: string, queryLimit?: string): PaginationParams => {
  const page = Math.max(1, parseInt(queryPage || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryLimit || '10', 10) || 10));
  return { page, limit, skip: (page - 1) * limit };
};
