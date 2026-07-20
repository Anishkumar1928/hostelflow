import { api } from '../api/client';
import type { ApiResponse, PaginatedResponse } from '../types';

export class ApiBaseService<T extends { id: string }> {
  protected resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  protected async getAllPaginated(params?: Record<string, string | number | undefined>): Promise<ApiResponse<T[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') searchParams.set(k, String(v));
      });
    }
    const qs = searchParams.toString();
    const endpoint = qs ? `/${this.resource}?${qs}` : `/${this.resource}`;
    const res = await api.get<T[]>(endpoint);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error || `Failed to fetch ${this.resource}` };
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    const res = await api.get<{ data: T[] }>(`/${this.resource}`);
    if (!res.success) return { success: false, error: res.error };
    const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
    return { success: true, data };
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const res = await api.get<T>(`/${this.resource}/${id}`);
    if (!res.success) return { success: false, error: res.error || 'Not found' };
    return { success: true, data: res.data as T };
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const res = await api.post<T>(`/${this.resource}`, data);
    if (!res.success) return { success: false, error: res.error || 'Failed to create' };
    return { success: true, data: res.data as T };
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const res = await api.patch<T>(`/${this.resource}/${id}`, data);
    if (!res.success) return { success: false, error: res.error || 'Failed to update' };
    return { success: true, data: res.data as T };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete<void>(`/${this.resource}/${id}`);
    if (!res.success) return { success: false, error: res.error || 'Failed to delete' };
    return { success: true };
  }

  async getPaginated(
    page = 1, limit = 10, search?: string,
    filters?: Record<string, string>, sortBy?: string, sortOrder?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;
    if (sortBy) { params.sortBy = sortBy; params.sortOrder = sortOrder || 'asc'; }
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'all') params[k] = v;
      });
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => searchParams.set(k, String(v)));
    const qs = searchParams.toString();
    const res = await api.get<{ data: T[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      `/${this.resource}?${qs}`
    );
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as any;
    const items = d.data || d || [];
    const pagination = d.pagination || { total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
    return {
      success: true,
      data: { data: items, total: pagination.total, page: pagination.page, limit: pagination.limit, totalPages: pagination.totalPages },
    };
  }
}
