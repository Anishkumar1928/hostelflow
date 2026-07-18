import { API_BASE_URL } from '../constants';
import type { ApiResponse, PaginatedResponse } from '../types';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, error: json.message || json.error || 'Request failed' };
    }

    if (json.data && json.pagination) {
      return {
        success: true,
        data: {
          data: json.data,
          total: json.pagination.total,
          page: json.pagination.page,
          limit: json.pagination.limit,
          totalPages: json.pagination.totalPages,
        } as PaginatedResponse<T>,
      };
    }

    return { success: true, data: json.data as T };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
