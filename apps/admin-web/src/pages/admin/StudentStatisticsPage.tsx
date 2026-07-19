import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import type { StudentStatistics } from '../../services/student.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { StudentStatsCard } from '../../components/admin/student/StudentStatsCard';
import { ArrowLeft } from 'lucide-react';

export function StudentStatisticsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStatistics | null>(null);

  useEffect(() => {
    studentService.getStatistics().then(res => {
      if (res.success && res.data) setStats(res.data);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Statistics"
        description="Overview of all student metrics"
        actions={
          <button onClick={() => navigate('/admin/students')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Students
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StudentStatsCard label="Total Students" value={stats?.totalStudents ?? '-'} icon="users" color="brand" />
        <StudentStatsCard label="Active" value={stats?.activeStudents ?? '-'} icon="check" color="emerald" />
        <StudentStatsCard label="Inactive" value={stats?.inactiveStudents ?? '-'} icon="x" color="slate" />
        <StudentStatsCard label="Suspended" value={stats?.suspendedStudents ?? '-'} icon="ban" color="rose" />
        <StudentStatsCard label="Graduated" value={stats?.graduatedStudents ?? '-'} icon="graduation" color="blue" />
        <StudentStatsCard label="Male" value={stats?.maleStudents ?? '-'} icon="male" color="blue" />
        <StudentStatsCard label="Female" value={stats?.femaleStudents ?? '-'} icon="female" color="purple" />
        <StudentStatsCard label="Other" value={stats?.otherStudents ?? '-'} icon="users" color="cyan" />
        <StudentStatsCard label="Fee - Paid" value={stats?.paidFee ?? '-'} icon="check" color="emerald" />
        <StudentStatsCard label="Fee - Pending" value={stats?.pendingFee ?? '-'} icon="clock" color="amber" />
        <StudentStatsCard label="Fee - Overdue" value={stats?.overdueFee ?? '-'} icon="alert" color="rose" />
      </div>
    </div>
  );
}
