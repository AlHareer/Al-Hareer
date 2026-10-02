import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { getAllInquiries } from '@/actions/admin/inquiries';
import InquiriesList from './_components/InquiriesList';

export const metadata = { title: 'Customer Inquiries — Al Hareer Admin' };

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  const unresolvedCount = inquiries.filter((i) => !i.is_resolved).length;
  const resolvedCount = inquiries.length - unresolvedCount;

  const stats = [
    {
      label: 'Total Inquiries',
      value: inquiries.length.toString(),
      icon: MessageSquare,
      bgClass: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Needs Reply (New)',
      value: unresolvedCount.toString(),
      icon: Clock,
      bgClass: 'bg-amber-50 text-amber-700',
      pulse: unresolvedCount > 0,
    },
    {
      label: 'Resolved',
      value: resolvedCount.toString(),
      icon: CheckCircle2,
      bgClass: 'bg-emerald-50 text-emerald-700',
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
            <span className="font-semibold text-brand-700">Inquiries</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 mt-1">Customer Inquiries</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bgClass}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-heading text-xl font-bold text-brand-700 leading-tight">{s.value}</p>
                {s.pulse && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
              </div>
              <p className="text-[11px] font-semibold text-muted mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Inquiries List */}
      <InquiriesList inquiries={inquiries} />
    </div>
  );
}
