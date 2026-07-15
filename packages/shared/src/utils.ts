export function generateId(prefix: string, length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

export function formatCurrency(amount: number | string, currency = 'INR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { day: '2-digit', month: 'short', year: 'numeric' }
      : format === 'long'
        ? { day: 'numeric', month: 'long', year: 'numeric' }
        : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleDateString('en-IN', options);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function parsePaginationParams(query: Record<string, string | undefined>) {
  return {
    page: Math.max(1, parseInt(query.page || '1', 10)),
    limit: Math.min(100, Math.max(1, parseInt(query.limit || '10', 10))),
    sortBy: query.sortBy || 'createdAt',
    sortOrder: (query.sortOrder || 'desc') as 'asc' | 'desc',
    search: query.search || '',
    status: query.status || '',
    hostelId: query.hostelId || '',
  };
}

export function buildWhereClause(
  search: string,
  searchFields: string[],
  additionalFilters: Record<string, unknown> = {},
) {
  const where: Record<string, unknown> = { ...additionalFilters };
  if (search) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    }));
  }
  return where;
}

export function calculateAge(dob: string | Date): number {
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 10) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}
