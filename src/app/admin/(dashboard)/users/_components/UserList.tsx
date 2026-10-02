'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { type AdminUserItem } from '@/actions/admin/users';

function formatCurrency(amount: number) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

function getInitials(name?: string | null) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserList({ initialUsers }: { initialUsers: AdminUserItem[] }) {
  const [users] = useState<AdminUserItem[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;

      // Search query
      if (!q) return true;
      const name = (u.full_name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [users, search, roleFilter]);

  const customerCount = users.filter((u) => u.role !== 'admin').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-4">
      {/* Search & Simple Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Simple Role Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'customer'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            Customers ({customerCount})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            Admins ({adminCount})
          </button>
        </div>
      </div>

      {/* Users List Container */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-cream-200 bg-white p-10 text-center shadow-2xs">
          <p className="text-sm font-semibold text-brand-700">No users found</p>
          <p className="text-xs text-muted mt-1">
            {search ? 'Try adjusting your search query.' : 'Registered users will show up here.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-cream-200/80 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/70 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4">Total Spend</th>
                  <th className="py-3 px-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-xs">
                {filteredUsers.map((u) => {
                  const joinedDate = new Date(u.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={u.id} className="hover:bg-cream-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200/60 font-heading text-xs font-bold text-brand-700">
                            {getInitials(u.full_name)}
                          </div>
                          <span className="font-semibold text-brand-700">{u.full_name || '—'}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <p className="text-muted">{u.email}</p>
                        {u.phone && <p className="text-muted/80 text-[11px] mt-0.5">{u.phone}</p>}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize border ${
                            u.role === 'admin'
                              ? 'bg-brand-50 text-brand-700 border-brand-200'
                              : 'bg-cream-100 text-muted border-cream-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="py-3 px-4 text-center">
                        {u.orderCount > 0 ? (
                          <Link
                            href={`/admin/orders?search=${encodeURIComponent(u.email || u.full_name || '')}`}
                            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                            title="View orders"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>{u.orderCount}</span>
                          </Link>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </td>

                      {/* Total Spend */}
                      <td className="py-3 px-4 font-semibold text-brand-700">
                        {formatCurrency(u.totalSpend)}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-right text-muted">
                        {joinedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {filteredUsers.map((u) => {
              const joinedDate = new Date(u.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={u.id} className="rounded-xl border border-cream-200 bg-white p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 font-bold text-xs text-brand-700">
                        {getInitials(u.full_name)}
                      </div>
                      <span className="font-semibold text-xs text-brand-700">{u.full_name || '—'}</span>
                    </div>
                    <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-medium capitalize text-muted">
                      {u.role}
                    </span>
                  </div>

                  <div className="text-xs text-muted">
                    <p>{u.email}</p>
                    {u.phone && <p>{u.phone}</p>}
                  </div>

                  <div className="flex items-center justify-between border-t border-cream-100 pt-2 text-xs">
                    <div>
                      <span className="text-muted">Spent: </span>
                      <strong className="text-brand-700">{formatCurrency(u.totalSpend)}</strong>
                    </div>

                    {u.orderCount > 0 ? (
                      <Link
                        href={`/admin/orders?search=${encodeURIComponent(u.email || u.full_name || '')}`}
                        className="text-brand-600 font-semibold hover:underline"
                      >
                        {u.orderCount} orders →
                      </Link>
                    ) : (
                      <span className="text-muted">0 orders</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
