import { BaseService } from './base.service';
import { api, mockApiCall, mockPaginatedApiCall } from '../api/client';
import type { ApiResponse, PaginatedResponse, Student } from '../types';
import { INITIAL_STUDENTS } from '../data';
import { generateId } from '../utils';

function extractYear(y: string | number | undefined | null): number | null {
  if (!y) return null;
  if (typeof y === 'number') return y;
  const m = String(y).match(/\d+/);
  return m ? parseInt(m[0]) : null;
}

function toStudent(d: any): Student {
  const ey = extractYear(d.year);
  const ySuffix = ey ? (['th', 'st', 'nd', 'rd'][ey % 10 > 3 ? 0 : ey % 10] || 'th') : '';
  return {
    id: d.id,
    userId: d.userId || d.user?.id || '',
    name: d.fullName || d.user?.fullName || d.name || '',
    email: d.user?.email || d.email || '',
    phone: d.user?.phone || d.phone || '',
    gender: d.gender || 'Male',
    dob: d.dob ? new Date(d.dob).toISOString().split('T')[0] : '',
    bloodGroup: d.bloodGroup || '',
    address: d.address || '',
    enrollmentNo: d.enrollmentNo || '',
    registrationNo: d.registrationNo || '',
    department: d.department || '',
    course: d.course || '',
    year: ey ? `${ey}${ySuffix} Year` : '',
    semester: d.semester || '',
    parentName: d.guardianName || d.parentName || '',
    parentContact: d.guardianPhone || d.parentContact || '',
    emergencyContactName: d.emergencyContactName || '',
    emergencyContactPhone: d.emergencyContactPhone || '',
    emergencyContactRelation: d.emergencyContactRelation || '',
    hostelId: d.hostelId || '',
    roomId: d.roomId || '',
    roomNo: d.roomNo || '',
    status: d.status || (d.user?.status === false ? 'Inactive' : 'Active'),
    feeStatus: d.feeStatus || 'PENDING',
    admissionDate: d.admissionDate ? new Date(d.admissionDate).toISOString().split('T')[0] : (d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : ''),
    createdAt: d.createdAt || '',
    updatedAt: d.updatedAt || '',
    isDeleted: d.isDeleted || false,
  };
}

function toBackend(item: any): any {
  return {
    name: item.name,
    email: item.email,
    phone: item.phone,
    registrationNo: item.registrationNo,
    enrollmentNo: item.enrollmentNo,
    course: item.course,
    department: item.department,
    year: item.year,
    semester: item.semester,
    gender: item.gender,
    dob: item.dob,
    parentName: item.parentName,
    parentContact: item.parentContact,
    emergencyContactName: item.emergencyContactName,
    emergencyContactPhone: item.emergencyContactPhone,
    emergencyContactRelation: item.emergencyContactRelation,
    address: item.address,
    bloodGroup: item.bloodGroup,
    status: item.status,
    feeStatus: item.feeStatus,
    admissionDate: item.admissionDate,
  };
}

class StudentService extends BaseService<Student> {
  constructor() {
    super('students', INITIAL_STUDENTS as Student[]);
  }

  protected async getAllLocally() {
    return this.getAllFromStorage().filter((s: any) => !s.isDeleted);
  }

  async getAll(): Promise<ApiResponse<Student[]>> {
    try {
      const res = await api.get<any[]>(`/students`);
      if (res.success && res.data) {
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
        if (data.length > 0 && ('user' in data[0] || 'fullName' in data[0])) {
          return { success: true, data: data.map(d => toStudent(d)) };
        }
        return { success: true, data: data as Student[] };
      }
    } catch {}
    return mockApiCall(this.getAllFromStorage());
  }

  async getById(id: string): Promise<ApiResponse<Student>> {
    try {
      const res = await api.get<any>(`/students/${id}`);
      if (res.success && res.data && ('user' in res.data || 'fullName' in res.data)) {
        return { success: true, data: toStudent(res.data) };
      }
      if (res.success && res.data) return { success: true, data: res.data as Student };
    } catch {}
    const item = this.getAllFromStorage().find(i => i.id === id);
    if (!item) return { success: false, error: 'Not found' };
    return mockApiCall(item);
  }

  async getPaginated(
    page = 1, limit = 10, search?: string,
    filters?: Record<string, string>, sortBy?: string, sortOrder?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Student>>> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search) params.search = search;
      if (sortBy) { params.sortBy = sortBy; params.sortOrder = sortOrder || 'asc'; }
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'all') params[k] = v;
        });
      }
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)));
      const res = await api.get<any>(`/students?${sp.toString()}`);
      if (res.success && res.data) {
        const d = res.data as any;
        const items = d.data || d || [];
        const pagination = d.pagination || { total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
        const mapped = items.length > 0 && ('user' in items[0] || 'fullName' in items[0])
          ? items.map((i: any) => toStudent(i))
          : items;
        return {
          success: true,
          data: { data: mapped, total: pagination.total, page: pagination.page, limit: pagination.limit, totalPages: pagination.totalPages },
        };
      }
    } catch {}
    return mockPaginatedApiCall(this.getAllFromStorage(), page, limit, search, filters, sortBy, sortOrder);
  }

  async getByHostel(hostelId: string) {
    const data = await this.getAllLocally();
    return { success: true, data: data.filter(s => s.hostelId === hostelId) };
  }

  async getUnallocated() {
    const data = await this.getAllLocally();
    return { success: true, data: data.filter(s => !s.hostelId || !s.roomId) };
  }

  async getByUserId(userId: string) {
    try {
      const all = await this.getAll();
      if (all.success && all.data) {
        const student = all.data.find(s => s.userId === userId);
        if (student) return { success: true, data: student };
      }
    } catch {}
    const data = await this.getAllLocally();
    const student = data.find(s => s.userId === userId);
    return { success: true, data: student };
  }

  async checkEnrollmentUnique(enrollmentNo: string, excludeId?: string) {
    const data = await this.getAllLocally();
    const exists = data.some(
      s => s.enrollmentNo === enrollmentNo && s.id !== excludeId,
    );
    return { success: true, data: exists };
  }

  async checkEmailUnique(email: string, excludeId?: string) {
    const data = await this.getAllLocally();
    const exists = data.some(
      s => s.email === email && s.id !== excludeId,
    );
    return { success: true, data: exists };
  }

  async createStudent(data: Omit<Student, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>) {
    try {
      const res = await api.post<any>(`/students`, toBackend(data));
      if (res.success && res.data && ('user' in res.data || 'fullName' in res.data)) {
        return { success: true, data: toStudent(res.data) };
      }
    } catch {}

    const now = new Date().toISOString();
    const newStudent: Student = {
      ...data,
      id: generateId(),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    const { studentEventService } = await import('./student-event.service');
    await studentEventService.log(newStudent.id, 'Created', undefined, undefined, data.status);

    const all = this.getAllFromStorage();
    all.push(newStudent);
    this.saveToStorage(all);
    return { success: true, data: newStudent };
  }

  async updateStudent(id: string, data: Partial<Omit<Student, 'id' | 'isDeleted'>>) {
    try {
      const res = await api.patch<any>(`/students/${id}`, toBackend(data));
      if (res.success && res.data && ('user' in res.data || 'fullName' in res.data)) {
        return { success: true, data: toStudent(res.data) };
      }
    } catch {}

    const all = this.getAllFromStorage();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, error: 'Student not found' };

    const oldStatus = all[idx].status;
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    this.saveToStorage(all);

    if (data.status && data.status !== oldStatus) {
      const { studentEventService } = await import('./student-event.service');
      await studentEventService.log(id, 'StatusChanged', undefined, oldStatus, data.status);
    }

    const { studentEventService } = await import('./student-event.service');
    await studentEventService.log(id, 'Updated', undefined, undefined, undefined, 'Student details updated');

    return { success: true, data: all[idx] };
  }

  async softDelete(id: string) {
    try {
      await api.delete(`/students/${id}`);
    } catch {}

    const all = this.getAllFromStorage();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, error: 'Student not found' };

    all[idx] = { ...all[idx], isDeleted: true, updatedAt: new Date().toISOString() };
    this.saveToStorage(all);

    const { studentEventService } = await import('./student-event.service');
    await studentEventService.log(id, 'StatusChanged', undefined, all[idx].status, undefined, 'Student deleted');

    return { success: true, data: all[idx] };
  }

  async restore(id: string) {
    const all = this.getAllFromStorage();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, error: 'Student not found' };

    all[idx] = { ...all[idx], isDeleted: false, updatedAt: new Date().toISOString() };
    this.saveToStorage(all);

    const { studentEventService } = await import('./student-event.service');
    await studentEventService.log(id, 'StatusChanged', undefined, undefined, all[idx].status, 'Student restored');

    return { success: true, data: all[idx] };
  }

  async getHistory(studentId: string) {
    const { studentEventService } = await import('./student-event.service');
    return studentEventService.getByStudent(studentId);
  }
}

export const studentService = new StudentService();
