import { Users, IndianRupee, Repeat, Shield } from 'lucide-react';
import { getAllUsers } from '@/actions/admin/users';
import UserList from './_components/UserList';

export const metadata = { title: 'Users — Al Hareer Admin' };

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  const totalSpend = users.reduce((sum, u) => sum + u.totalSpend, 0);
  const repeatCount = users.filter((u) => u.orderCount > 1).length;
  const customerCount = users.filter((u) => u.role !== 'admin').length;

  const stats = [
    {
      label: 'Total Users',
      value: users.length.toString(),
      icon: Users,
    },
    {
      label: 'Customers',
      value: customerCount.toString(),
      icon: Shield,
    },
    {
      label: 'Repeat Buyers',
      value: repeatCount.toString(),
      icon: Repeat,
    },
    {
      label: 'Total Customer Spend',
      value: `₹${totalSpend.toLocaleString('en-IN')}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cream-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-brand-700">Users</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 mt-1">Users &amp; Customers</h1>
        </div>
      </div>

      {/* Clean Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-xl font-bold text-brand-700 leading-tight">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Users List */}
      <UserList initialUsers={users} />
    </div>
  );
}
