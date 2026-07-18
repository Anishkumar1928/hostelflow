import { mockApiCall } from '../api/client';
import { api } from '../api/client';
import type { ApiResponse } from '../types';

class ReportService {
  private async tryApi<T>(path: string, fallback: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
    try {
      const res = await api.get<T>(path);
      if (res.success && res.data) return res;
    } catch {}
    return fallback();
  }

  async getAttendanceReport(from: string, to: string) {
    return this.tryApi(`/reports/attendance?from=${from}&to=${to}`, async () => {
      const { attendanceService } = await import('./attendance.service');
      const res = await attendanceService.getAll();
      const records = (res.data || []).filter((a: any) => a.date >= from && a.date <= to);
      const present = records.filter((a: any) => a.status === 'Present').length;
      const absent = records.filter((a: any) => a.status === 'Absent').length;
      const late = records.filter((a: any) => a.status === 'Late').length;
      const leave = records.filter((a: any) => a.status === 'Leave').length;
      return mockApiCall({ total: records.length, present, absent, late, leave, records });
    });
  }

  async getFeesReport(from: string, to: string) {
    return this.tryApi(`/reports/fees?from=${from}&to=${to}`, async () => {
      const { feeService } = await import('./fee.service');
      const res = await feeService.getAll();
      const records = (res.data || []).filter((f: any) => (f.paidDate || f.dueDate) >= from && (f.paidDate || f.dueDate) <= to);
      const collected = records.filter((f: any) => f.status === 'Paid').reduce((a: number, f: any) => a + f.amount, 0);
      const pending = records.filter((f: any) => f.status === 'Pending').reduce((a: number, f: any) => a + f.amount, 0);
      const overdue = records.filter((f: any) => f.status === 'Overdue').reduce((a: number, f: any) => a + f.amount, 0);
      return mockApiCall({ totalRecords: records.length, collected, pending, overdue, records });
    });
  }

  async getOccupancyReport() {
    return this.tryApi('/reports/occupancy', async () => {
      const { hostelService } = await import('./hostel.service');
      const res = await hostelService.getAll();
      const hostels = (res.data || []).map((h: any) => ({
        name: h.name, capacity: h.capacity, occupied: h.occupied,
        percentage: Math.round((h.occupied / h.capacity) * 100),
      }));
      const totalCapacity = hostels.reduce((a: number, h: any) => a + h.capacity, 0);
      const totalOccupied = hostels.reduce((a: number, h: any) => a + h.occupied, 0);
      return mockApiCall({ hostels, totalCapacity, totalOccupied, overallPercentage: Math.round((totalOccupied / totalCapacity) * 100) });
    });
  }

  async getRevenueReport() {
    return this.tryApi('/reports/revenue', async () => {
      const [{ feeService }, { hostelService }] = await Promise.all([import('./fee.service'), import('./hostel.service')]);
      const [feeRes, hostelRes] = await Promise.all([feeService.getAll(), hostelService.getAll()]);
      const fees = feeRes.data || [];
      const allHostels = hostelRes.data || [];
      const total = fees.filter((f: any) => f.status === 'Paid').reduce((a: number, f: any) => a + f.amount, 0);
      const pending = fees.filter((f: any) => f.status === 'Pending').reduce((a: number, f: any) => a + f.amount, 0);
      const byType = allHostels.map((h: any) => ({
        hostel: h.name,
        revenue: fees.filter((f: any) => f.status === 'Paid').reduce((a: number, f: any) => a + f.amount, 0),
      }));
      return mockApiCall({ total, pending, byType });
    });
  }

  async getComplaintsReport() {
    return this.tryApi('/reports/complaints', async () => {
      const { complaintService } = await import('./complaint.service');
      const res = await complaintService.getAll();
      const complaints = res.data || [];
      const byCategory = complaints.reduce((acc: Record<string, number>, c: any) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byStatus = complaints.reduce((acc: Record<string, number>, c: any) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<string, number>);
      return mockApiCall({ total: complaints.length, byCategory, byStatus });
    });
  }

  async getVisitorsReport(from: string, to: string) {
    return this.tryApi(`/reports/visitors?from=${from}&to=${to}`, async () => {
      const { visitorService } = await import('./visitor.service');
      const res = await visitorService.getAll();
      const records = (res.data || []).filter((v: any) => v.date >= from && v.date <= to);
      return mockApiCall({ total: records.length, records });
    });
  }

  async getInventoryReport() {
    return this.tryApi('/reports/inventory', async () => {
      const { inventoryService } = await import('./inventory.service');
      const res = await inventoryService.getAll();
      const items = res.data || [];
      const lowStock = items.filter((i: any) => i.status === 'Low Stock');
      const byCondition = items.reduce((acc: Record<string, number>, i: any) => { acc[i.condition] = (acc[i.condition] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byCategory = items.reduce((acc: Record<string, number>, i: any) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {} as Record<string, number>);
      return mockApiCall({ total: items.length, lowStock: lowStock.length, available: items.filter((i: any) => i.status === 'Available').length, outOfStock: items.filter((i: any) => i.status === 'Out of Stock').length, byCondition, byCategory });
    });
  }

  async getStudentsReport() {
    return this.tryApi('/reports/students', async () => {
      const { studentService } = await import('./student.service');
      const res = await studentService.getAll();
      const students = res.data || [];
      const byGender = students.reduce((acc: Record<string, number>, s: any) => { acc[s.gender] = (acc[s.gender] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byStatus = students.reduce((acc: Record<string, number>, s: any) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byDepartment = students.reduce((acc: Record<string, number>, s: any) => { acc[s.department] = (acc[s.department] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byYear = students.reduce((acc: Record<string, number>, s: any) => { acc[s.year] = (acc[s.year] || 0) + 1; return acc; }, {} as Record<string, number>);
      const allocated = students.filter((s: any) => s.roomId).length;
      const unallocated = students.filter((s: any) => !s.roomId).length;
      return mockApiCall({ total: students.length, byGender, byStatus, byDepartment, byYear, allocated, unallocated, students });
    });
  }

  async getRoomsReport() {
    return this.tryApi('/reports/rooms', async () => {
      const [{ roomService }, { bedService }] = await Promise.all([import('./room.service'), import('./bed.service')]);
      const [roomRes, bedRes] = await Promise.all([roomService.getAll(), bedService.getAll()]);
      const rooms = roomRes.data || [];
      const beds = bedRes.data || [];
      const byType = rooms.reduce((acc: Record<string, number>, r: any) => { acc[r.roomType] = (acc[r.roomType] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byStatus = rooms.reduce((acc: Record<string, number>, r: any) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {} as Record<string, number>);
      const totalBeds = beds.length;
      const occupiedBeds = beds.filter((b: any) => b.studentId).length;
      return mockApiCall({ total: rooms.length, totalBeds, occupiedBeds, totalCapacity: totalBeds, byType, byStatus });
    });
  }

  async getBuildingOccupancyReport() {
    return this.tryApi('/reports/building-occupancy', async () => {
      const [{ buildingService }, { hostelService }] = await Promise.all([import('./building.service'), import('./hostel.service')]);
      const [buildingRes, hostelRes] = await Promise.all([buildingService.getAll(), hostelService.getAll()]);
      const buildings = buildingRes.data || [];
      const allHostels = hostelRes.data || [];
      const withHostel = buildings.map((b: any) => ({ ...b, hostelName: allHostels.find((h: any) => h.id === b.hostelId)?.name || 'Unknown' }));
      const totalCapacity = buildings.reduce((a: number, b: any) => a + b.capacity, 0);
      const totalOccupied = buildings.reduce((a: number, b: any) => a + b.occupiedRooms, 0);
      return mockApiCall({ buildings: withHostel, totalCapacity, totalOccupied, overallPercentage: totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0 });
    });
  }

  async getLeaveReport(from: string, to: string) {
    return this.tryApi(`/reports/leaves?from=${from}&to=${to}`, async () => {
      const { leaveService } = await import('./leave.service');
      const res = await leaveService.getAll();
      const records = (res.data || []).filter((l: any) => l.fromDate >= from && l.toDate <= to);
      const byStatus = records.reduce((acc: Record<string, number>, l: any) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byType = records.reduce((acc: Record<string, number>, l: any) => { acc[l.leaveType] = (acc[l.leaveType] || 0) + 1; return acc; }, {} as Record<string, number>);
      return mockApiCall({ total: records.length, byStatus, byType, records });
    });
  }

  async getMessReport(from: string, to: string) {
    return this.tryApi(`/reports/mess?from=${from}&to=${to}`, async () => {
      const { messService } = await import('./mess.service');
      const res = await messService.getAll();
      const menu = res.data || [];
      return mockApiCall({ totalMenuItems: menu.length, menu, daysCovered: menu.length });
    });
  }

  async getDocumentsReport() {
    return this.tryApi('/reports/documents', async () => {
      const { documentService } = await import('./document.service');
      const res = await documentService.getAll();
      const docs = res.data || [];
      const byStatus = docs.reduce((acc: Record<string, number>, d: any) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {} as Record<string, number>);
      const byType = docs.reduce((acc: Record<string, number>, d: any) => { acc[d.type] = (acc[d.type] || 0) + 1; return acc; }, {} as Record<string, number>);
      return mockApiCall({ total: docs.length, verified: docs.filter((d: any) => d.status === 'Verified').length, rejected: docs.filter((d: any) => d.status === 'Rejected').length, pending: docs.filter((d: any) => d.status === 'Pending').length, byStatus, byType });
    });
  }
}

export const reportService = new ReportService();
