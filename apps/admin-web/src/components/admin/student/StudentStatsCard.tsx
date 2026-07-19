import { Users, Check, X, Ban, GraduationCap, Mars, Venus, Clock, AlertTriangle } from 'lucide-react';

interface StudentStatsCardProps {
  label: string;
  value: string | number;
  icon: 'users' | 'check' | 'x' | 'ban' | 'graduation' | 'male' | 'female' | 'clock' | 'alert';
  color?: string;
}

const ICON_MAP = {
  users: Users, check: Check, x: X, ban: Ban,
  graduation: GraduationCap, male: Mars, female: Venus,
  clock: Clock, alert: AlertTriangle,
};

const COLOR_MAP: Record<string, string> = {
  brand: 'from-blue-500/10 to-cyan-600/5 text-blue-600 dark:text-blue-400',
  emerald: 'from-emerald-500/10 to-teal-600/5 text-emerald-600 dark:text-emerald-400',
  slate: 'from-slate-500/10 to-slate-600/5 text-slate-600 dark:text-slate-400',
  rose: 'from-rose-500/10 to-pink-600/5 text-rose-600 dark:text-rose-400',
  amber: 'from-amber-500/10 to-orange-600/5 text-amber-600 dark:text-amber-400',
  blue: 'from-blue-500/10 to-indigo-600/5 text-blue-600 dark:text-blue-400',
  purple: 'from-purple-500/10 to-violet-600/5 text-purple-600 dark:text-purple-400',
  cyan: 'from-cyan-500/10 to-sky-600/5 text-cyan-600 dark:text-cyan-400',
};

export function StudentStatsCard({ label, value, icon, color = 'brand' }: StudentStatsCardProps) {
  const Icon = ICON_MAP[icon];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${COLOR_MAP[color] || COLOR_MAP.brand} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}
