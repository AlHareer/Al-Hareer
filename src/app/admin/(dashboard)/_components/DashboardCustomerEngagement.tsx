'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PendingReview, RecentInquiry } from '@/actions/admin/dashboard';

interface DashboardCustomerEngagementProps {
  pendingReviews: PendingReview[];
  recentInquiries: RecentInquiry[];
  pendingReviewCount: number;
  unresolvedInquiryCount: number;
}

export default function DashboardCustomerEngagement({
  pendingReviews,
  recentInquiries,
  pendingReviewCount,
  unresolvedInquiryCount,
}: DashboardCustomerEngagementProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'inquiries'>('reviews');

  return (
    <div className="rounded-2xl border border-cream-300 bg-white shadow-2xs flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-cream-200">
        <div className="min-w-0">
          <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700 leading-tight">
            Customer Messages &amp; Reviews
          </h2>
          <p className="text-[11px] text-muted mt-0.5 hidden sm:block">
            Recent reviews and inquiries needing a response.
          </p>
        </div>

        {/* Tab switcher — always inline */}
        <div className="flex items-center rounded-xl bg-cream-100 p-1 border border-cream-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-muted hover:text-brand-700'
            }`}
          >
            <Star className="h-3.5 w-3.5 text-gold shrink-0" />
            <span>Reviews</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
              activeTab === 'reviews' ? 'bg-brand-100 text-brand-700' : 'bg-cream-200 text-muted'
            }`}>
              {pendingReviewCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-muted hover:text-brand-700'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#024F5F] shrink-0" />
            <span>Inquiries</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
              activeTab === 'inquiries' ? 'bg-[#F6F1EC] text-[#024F5F]' : 'bg-cream-200 text-muted'
            }`}>
              {unresolvedInquiryCount}
            </span>
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 sm:px-5 pt-3 pb-4">

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col h-full">
            {pendingReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-7 text-center flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F1EC] text-[#024F5F] mb-2.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-brand-700">No reviews waiting</p>
                <p className="text-[11px] text-muted mt-0.5">All customer reviews have been approved.</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {pendingReviews.map((rev) => (
                  <div key={rev.id} className="py-3 first:pt-1 last:pb-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="flex shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${s <= rev.rating ? 'fill-gold text-gold' : 'text-cream-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-brand-700 truncate">{rev.reviewer_name}</span>
                      </div>
                      <span className="text-[10px] text-muted shrink-0">
                        {new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-brand-700 line-clamp-2 italic">
                      &quot;{rev.review_text || 'No review message'}&quot;
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className="truncate max-w-[180px]">Product: {rev.product_name}</span>
                      <Link
                        href="/admin/reviews"
                        className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 shrink-0"
                      >
                        Moderate <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-3 border-t border-cream-200 text-right">
              <Link
                href="/admin/reviews"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
              >
                View All Reviews <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col h-full">
            {recentInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-7 text-center flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F1EC] text-[#024F5F] mb-2.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-brand-700">No new inquiries</p>
                <p className="text-[11px] text-muted mt-0.5">All customer inquiries have been answered.</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3 first:pt-1 last:pb-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-700 truncate">{inq.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${
                        inq.is_resolved
                          ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                          : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
                      }`}>
                        {inq.is_resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-brand-700 line-clamp-2">{inq.message}</p>
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className="truncate max-w-[180px]">{inq.email}</span>
                      <Link
                        href="/admin/inquiries"
                        className="text-xs font-semibold text-[#024F5F] hover:text-[#024F5F] flex items-center gap-1 shrink-0"
                      >
                        Reply <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-3 border-t border-cream-200 text-right">
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#024F5F] hover:text-[#024F5F]"
              >
                View All Inquiries <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
