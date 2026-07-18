import { api, mockApiCall, mockPaginatedApiCall } from '../api/client';
import { generateId } from '../utils';
import type { ApiResponse, PaginatedResponse } from '../types';

export class BaseService<T extends { id: string }> {
  protected storageKey: string;
  protected data: T[];
  protected resource: string;

  constructor(storageKey: string, initialData: T[], resource?: string) {
    this.storageKey = storageKey;
    this.data = initialData;
    this.resource = resource || storageKey;
  }

  protected getApiResource(): string {
    return this.resource;
  }

  getAllFromStorage(): T[] {
    return this.data;
  }

  saveToStorage(data: T[]): void {
    this.data = data;
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const res = await api.get<T[]>(`/${this.resource}`);
      if (res.success && res.data) {
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
        return { success: true, data };
      }
    } catch {}
    return mockApiCall(this.getAllFromStorage());
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const res = await api.get<T>(`/${this.resource}/${id}`);
      if (res.success && res.data) {
        return { success: true, data: res.data as T };
      }
    } catch {}
    const item = this.getAllFromStorage().find(i => i.id === id);
    if (!item) return { success: false, error: 'Not found' };
    return mockApiCall(item);
  }

  async getByField(field: keyof T, value: unknown): Promise<ApiResponse<T[]>> {
    try {
      const all = await this.getAll();
      if (all.success) {
        return { success: true, data: (all.data || []).filter(i => i[field] === value) };
      }
    } catch {}
    const results = this.getAllFromStorage().filter(i => i[field] === value);
    return mockApiCall(results);
  }

  async exists(field: keyof T, value: unknown): Promise<ApiResponse<boolean>> {
    const all = await this.getAll();
    const items = all.data || [];
    const exists = items.some(i => i[field] === value);
    return { success: true, data: exists };
  }

  async create(item: Omit<T, 'id'>): Promise<ApiResponse<T>> {
    try {
      const res = await api.post<T>(`/${this.resource}`, item);
      if (res.success && res.data) {
        return { success: true, data: res.data as T };
      }
    } catch {}
    const newItem = { id: generateId(), ...item } as T;
    const all = this.getAllFromStorage();
    all.push(newItem);
    this.saveToStorage(all);
    return mockApiCall(newItem);
  }

  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const res = await api.patch<T>(`/${this.resource}/${id}`, updates);
      if (res.success && res.data) {
        return { success: true, data: res.data as T };
      }
    } catch {}
    const all = this.getAllFromStorage();
    const idx = all.findIndex(i => i.id === id);
    if (idx === -1) return { success: false, error: 'Not found' };
    all[idx] = { ...all[idx], ...updates };
    this.saveToStorage(all);
    return mockApiCall(all[idx]);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const res = await api.delete<void>(`/${this.resource}/${id}`);
      if (res.success) return { success: true };
    } catch {}
    const all = this.getAllFromStorage();
    const idx = all.findIndex(i => i.id === id);
    if (idx === -1) return { success: false, error: 'Not found' };
    all.splice(idx, 1);
    this.saveToStorage(all);
    return mockApiCall(undefined as void);
  }

  async getPaginated(
    page = 1, limit = 10, search?: string,
    filters?: Record<string, string>, sortBy?: string, sortOrder?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
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
      const res = await api.get<{ data: T[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
        `/${this.resource}?${searchParams.toString()}`
      );
      if (res.success && res.data) {
        const d = res.data as any;
        const items = d.data || d || [];
        const pagination = d.pagination || { total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
        return {
          success: true,
          data: { data: items, total: pagination.total, page: pagination.page, limit: pagination.limit, totalPages: pagination.totalPages },
        };
      }
    } catch {}
    return mockPaginatedApiCall(this.getAllFromStorage(), page, limit, search, filters, sortBy, sortOrder);
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    let all = this.getAllFromStorage();
    all = all.filter(i => !ids.includes(i.id));
    this.saveToStorage(all);
    return mockApiCall(undefined as void);
  }
}
