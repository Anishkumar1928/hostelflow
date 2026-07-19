import { api } from '../api/client';
import type { ApiResponse, Bed } from '../types';

function toBed(d: any): Bed {
  return {
    id: d.id,
    roomId: d.roomId || '',
    bedNo: d.bedNumber || d.bedNo || '',
    status: d.status === 'AVAILABLE' ? 'Available' : d.status === 'OCCUPIED' ? 'Occupied' : d.status || 'Available',
    studentId: d.studentId || undefined,
  };
}

function extractList(res: any): Bed[] {
  if (!res.success) return [];
  const raw = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
  return Array.isArray(raw) ? raw.map(toBed) : [];
}

class BedService {
  /** Get ALL beds for a room (any status) */
  async getByRoom(roomId: string): Promise<ApiResponse<Bed[]>> {
    if (!roomId) return { success: true, data: [] };
    try {
      const res = await api.get<any>(`/beds?roomId=${roomId}`);
      return { success: true, data: extractList(res) };
    } catch {
      return { success: true, data: [] };
    }
  }

  /** Get only AVAILABLE beds for a room */
  async getAvailableByRoom(roomId: string): Promise<ApiResponse<Bed[]>> {
    if (!roomId) return { success: true, data: [] };
    try {
      const res = await api.get<any>(`/beds?roomId=${roomId}&status=AVAILABLE`);
      const beds = extractList(res);
      if (beds.length > 0) return { success: true, data: beds };
    } catch {}

    try {
      const res = await api.get<any>(`/beds?roomId=${roomId}`);
      const all = extractList(res);
      return { success: true, data: all.filter(b => b.status === 'Available') };
    } catch {
      return { success: true, data: [] };
    }
  }

  /** Generate beds for a room via API */
  async bulkGenerate(roomId: string, count: number, prefix?: string): Promise<ApiResponse<Bed[]>> {
    try {
      const res = await api.post<any>(`/beds/bulk`, { roomId, count, prefix });
      if (res.success) {
        return { success: true, data: extractList(res) };
      }
    } catch {}
    return { success: false, error: 'Failed to generate beds' };
  }

  async getById(id: string): Promise<ApiResponse<Bed>> {
    try {
      const res = await api.get<any>(`/beds/${id}`);
      if (res.success) {
        const d = res.data?.data ?? res.data;
        return { success: true, data: toBed(d) };
      }
    } catch {}
    return { success: false, error: 'Bed not found' };
  }
}

export const bedService = new BedService();
