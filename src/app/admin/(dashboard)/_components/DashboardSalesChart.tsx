'use client';

import { useState } from 'react';
import { IndianRupee, ShoppingCart, TrendingUp } from 'lucide-react';
import type { SalesTrendPoint } from '@/actions/admin/dashboard';

interface DashboardSalesChartProps {
  salesTrend: SalesTrendPoint[];
}

export default function DashboardSalesChart({ salesTrend }: DashboardSalesChartProps) {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG canvas dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 35;
  const paddingY = 28;

  const emptyFallback = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().split('T')[0];
    const label = i === 6 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    return { date, label, revenue: 0, orders: 0 };
  });
  const data = salesTrend && salesTrend.length > 0 ? salesTrend : emptyFallback;

  const values = data.map((d) => (metric === 'revenue' ? d.revenue : d.orders));
  const rawMax = Math.max(...values, 0);
  const maxValue = metric === 'revenue' ? Math.max(rawMax, 5000) : Math.max(rawMax, 5);

  // Calculate points
  const points = data.map((d, index) => {
    const val = metric === 'revenue' ? d.revenue : d.orders;
    const x = paddingX + (index / (data.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (val / maxValue) * (svgHeight - paddingY * 2);
    return { x, y, data: d, val };
  });

  // Generate smooth SVG path (curved bezier)
  const linePath = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Fill path closing at bottom
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Summary figures
  const totalPeriodRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalPeriodOrders = data.reduce((s, d) => s + d.orders, 0);
  const peakDay = data.reduce((max, d) => (d.revenue > max.revenue ? d : max), data[0]);

  // Current active display point
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-cream-200 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base sm:text-lg font-bold text-brand-700">Sales & Orders</h2>
            <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-brand-500 uppercase tracking-widest border border-cream-300 shrink-0">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">Daily sales revenue and order counts.</p>
        </div>

        {/* Toggle buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center rounded-xl bg-cream-100 p-1 border border-cream-300 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all ${
              metric === 'revenue'
                ? 'bg-white text-brand-700 shadow-2xs'
                : 'text-muted hover:text-brand-700'
            }`}
          >
            <IndianRupee className="h-3.5 w-3.5 text-gold-dark shrink-0" />
            <span>Revenue</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric('orders')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all ${
              metric === 'orders'
                ? 'bg-white text-brand-700 shadow-2xs'
                : 'text-muted hover:text-brand-700'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Active Day Highlight */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-cream-50 px-3 py-2 border border-cream-200 text-xs">
        <span className="font-semibold text-brand-700 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-gold" />
          <span>{activePoint.data.label}:</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-700">
            ₹{activePoint.data.revenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-muted">
            ({activePoint.data.orders} order{activePoint.data.orders === 1 ? '' : 's'})
          </span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative mt-3 w-full overflow-hidden">
        {/* Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="pointer-events-none hidden sm:block absolute -top-2 z-20 -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{ left: `${(points[hoveredIndex].x / svgWidth) * 100}%` }}
          >
            <div className="rounded-xl border border-cream-300 bg-brand-800 px-3 py-2 text-white shadow-luxury text-center min-w-[120px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                {points[hoveredIndex].data.label}
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                {metric === 'revenue'
                  ? `₹${points[hoveredIndex].data.revenue.toLocaleString('en-IN')}`
                  : `${points[hoveredIndex].data.orders} Order${points[hoveredIndex].data.orders === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none touch-manipulation"
        >
          <defs>
            <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#8B6B52" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#8B6B52" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="orderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A3525" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4A3525" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
            const val = Math.round(ratio * maxValue);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E2D7C7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="11"
                  fill="#8C8178"
                  fontWeight="600"
                >
                  {metric === 'revenue' ? `₹${val > 999 ? (val / 1000).toFixed(0) + 'k' : val}` : val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={metric === 'revenue' ? 'url(#salesGrad)' : 'url(#orderGrad)'}
          />

          {/* Stroke line */}
          <path
            d={linePath}
            fill="none"
            stroke={metric === 'revenue' ? '#D4AF37' : '#4A3525'}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              {hoveredIndex === i && (
                <line
                  x1={p.x}
                  y1={paddingY}
                  x2={p.x}
                  y2={svgHeight - paddingY}
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i ? '#2B231D' : '#FFFFFF'}
                stroke={metric === 'revenue' ? '#D4AF37' : '#4A3525'}
                strokeWidth="2.5"
                className="transition-all duration-150"
              />

              <text
                x={p.x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill={hoveredIndex === i ? '#2B231D' : '#655B53'}
                fontWeight={hoveredIndex === i ? '700' : '500'}
              >
                {p.data.label}
              </text>

              <rect
                x={p.x - (svgWidth / (data.length * 2))}
                y={0}
                width={svgWidth / data.length}
                height={svgHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(i)}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Highlights Strip */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 border-t border-cream-200 pt-3">
        <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start p-2 sm:p-0 rounded-lg sm:rounded-none bg-cream-50/50 sm:bg-transparent">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">7-Day Total</p>
          <p className="text-xs sm:text-sm font-bold text-brand-700 sm:mt-0.5">
            ₹{totalPeriodRevenue.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] sm:text-[11px] font-normal text-muted">({totalPeriodOrders} orders)</span>
          </p>
        </div>

        <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start p-2 sm:p-0 rounded-lg sm:rounded-none bg-cream-50/50 sm:bg-transparent">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Best Day</p>
          <p className="text-xs sm:text-sm font-bold text-brand-700 sm:mt-0.5">
            {peakDay ? peakDay.label : '—'}{' '}
            <span className="text-[10px] sm:text-[11px] font-normal text-muted">
              ({peakDay ? `₹${peakDay.revenue.toLocaleString('en-IN')}` : '₹0'})
            </span>
          </p>
        </div>

        <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start p-2 sm:p-0 rounded-lg sm:rounded-none bg-cream-50/50 sm:bg-transparent">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Daily Average</p>
          <p className="text-xs sm:text-sm font-bold text-brand-700 sm:mt-0.5">
            ₹{Math.round(totalPeriodRevenue / 7).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}
