import { Mail, CalendarClock, UserCheck } from 'lucide-react';
import { getNewsletterSubscribers } from '@/actions/admin/newsletter';
import NewsletterList from './_components/NewsletterList';

export const metadata = { title: 'Newsletter Subscribers — Al Hareer Admin' };

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = subscribers.filter((s) => new Date(s.created_at) >= today).length;
  const monthCount = subscribers.filter((s) => new Date(s.created_at) >= thisMonthStart).length;

  const stats = [
    {
      label: 'Total Subscribers',
      value: subscribers.length.toString(),
      icon: Mail,
      bgClass: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Joined This Month',
      value: monthCount.toString(),
      icon: UserCheck,
      bgClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Joined Today',
      value: todayCount.toString(),
      icon: CalendarClock,
      bgClass: 'bg-blue-50 text-blue-700',
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
            <span className="font-semibold text-brand-700">Newsletter</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 mt-1">
            Newsletter Subscribers
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-w-2xl">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bgClass}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-xl font-bold text-brand-700 leading-tight">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Subscribers List */}
      <NewsletterList subscribers={subscribers} />
    </div>
  );
}
