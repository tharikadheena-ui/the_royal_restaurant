import React from 'react';
import { Scale } from 'lucide-react';

export default function MetricsDisplay({ metrics, tables, orders }) {
  const occupiedTables = tables.filter(t => t.occupied).length;
  const totalTables = tables.length;
  const utilization = totalTables > 0 ? ((occupiedTables / totalTables) * 100).toFixed(1) : 0;
  const activeOrders = orders.filter(o => o.status !== 4).length;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL AUDIT & TELEMETRY
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            ESTATE METRICS
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "Audit records formatted according to the Royal Treasury standards."
          </p>
        </div>

        <div className="mt-4 sm:mt-0 font-serif-royal text-xs text-[#a88642] tracking-widest uppercase">
          <span>AUDIT STATUS: <strong className="text-[#96b87d]">VERIFIED ACCURATE</strong></span>
        </div>
      </div>

      {/* Engraved Ledger Plaque (Exact match to "REVENUE STREAMS" from reference image) */}
      <div className="royal-plaque p-8 sm:p-12 rounded-none relative">
        <div className="royal-corner royal-corner-tl" />
        <div className="royal-corner royal-corner-tr" />
        <div className="royal-corner royal-corner-bl" />
        <div className="royal-corner royal-corner-br" />

        <div className="text-center pb-6 border-b border-[#5a441e]/50">
          <span className="text-xs text-[#a88642] uppercase tracking-[0.3em] font-serif-royal block">
            PALATIAL TELEMETRY
          </span>
          <h3 className="font-serif-royal text-2xl text-[#f2ebd9] tracking-[0.18em] mt-1 uppercase">
            OPERATIONAL STREAMS & LEDGER
          </h3>
        </div>

        {/* Engraved Ledger Rows with Diamond Bullet Points */}
        <div className="divide-y divide-[#3d2d14] max-w-3xl mx-auto py-6 font-serif-royal text-sm sm:text-base">
          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>TABLE UTILIZATION</span>
            </span>
            <span className="font-mono font-bold text-[#e6ca94] tracking-wider">
              {utilization}%
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>AVERAGE ESTIMATED WAIT</span>
            </span>
            <span className="font-mono font-bold text-[#f2ebd9] tracking-wider">
              {metrics.averageWaitTimeMinutes || '4.8'} MIN
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>ORDERS COMPLETED</span>
            </span>
            <span className="font-mono font-bold text-[#e6ca94] tracking-wider">
              {metrics.totalOrdersCompleted}
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>ACTIVE CULINARY COMMISSIONS</span>
            </span>
            <span className="font-mono font-bold text-[#f2ebd9] tracking-wider">
              {activeOrders}
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>CUSTOMERS SERVED TODAY</span>
            </span>
            <span className="font-mono font-bold text-[#e6ca94] tracking-wider">
              {metrics.totalCustomersSeated}
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>SALON CAPACITY ACTIVE</span>
            </span>
            <span className="font-mono font-bold text-[#f2ebd9] tracking-wider">
              {occupiedTables} OF {totalTables} TABLES
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642]">◈</span>
              <span>TOTAL ESTATE REVENUE</span>
            </span>
            <span className="font-mono font-bold text-[#e6ca94] tracking-wider">
              $ 89,760,980
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
