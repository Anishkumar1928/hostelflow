import { Notification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data';
import { api } from '../api/client';

class NotificationService {
  private notifications: Notification[] = INITIAL_NOTIFICATIONS as Notification[];

  async getAll(userId: string): Promise<{ success: boolean; data?: Notification[] }> {
    try {
      const res = await api.get<Notification[]>(`/notifications?userId=${userId}`);
      if (res.success && res.data) {
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
        return { success: true, data };
      }
    } catch {}
    return { success: true, data: this.notifications.filter(n => n.userId === userId) };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const res = await this.getAll(userId);
    return (res.data || []).filter(n => !n.read).length;
  }

  async markRead(id: string): Promise<{ success: boolean }> {
    try {
      const res = await api.patch(`/notifications/${id}`, { isRead: true });
      if (res.success) return { success: true };
    } catch {}
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx !== -1) this.notifications[idx].read = true;
    return { success: true };
  }

  async markAllRead(userId: string): Promise<{ success: boolean }> {
    try {
      const res = await api.post('/notifications/read-all', { userId });
      if (res.success) return { success: true };
    } catch {}
    this.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    return { success: true };
  }

  async add(notification: Omit<Notification, 'id'>): Promise<{ success: boolean; data?: Notification }> {
    const n: Notification = { ...notification, id: Math.random().toString(36).substring(2, 10) };
    this.notifications.unshift(n);
    return { success: true, data: n };
  }
}

export const notificationService = new NotificationService();
