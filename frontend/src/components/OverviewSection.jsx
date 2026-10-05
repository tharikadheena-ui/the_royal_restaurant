import React from 'react';
import { Crown, Layers, Users, UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

export default function OverviewSection({ 
  tables, 
  queue, 
  orders, 
  stations, 
  setActiveTab 
}) {
  const availableTables = tables.filter(t => !t.occupied).length;
  const occupiedTables = tables.filter(t => t.occupied).length;
  const activeOrders = orders.filter(o => o.status !== 4).length;
  const busyStations = stations.filter(s => !s.available).length;
  const totalGuestsSeated = tables.reduce((acc, t) => acc + (t.occupied ? (t.groupSize || t.capacity) : 0), 0);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Central Royal Hero Section (Matching the Reference Image Altar & Crown Composition) */}
      <div className="royal-plaque p-6 sm:p-10 rounded-none relative overflow-hidden">
        {/* Corner Ornate Accents */}
        <div className="royal-corner royal-corner-tl" />
        <div className="royal-corner royal-corner-tr" />
        <div className="royal-corner royal-corner-bl" />
        <div className="royal-corner royal-corner-br" />

        {/* Central Atmospheric Background with Subtle Dark Velvet Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter brightness-75 contrast-125 pointer-events-none"
          style={{ backgroundImage: `url('/royal_treasury_reference.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090705] via-[#090705]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-serif-royal tracking-[0.3em] text-[#e6ca94]">
            <span>❖</span>
            <span>THE HOUSE OF FINE DINING</span>
            <span>❖</span>
          </div>

          <h2 className="font-serif-royal text-3xl sm:text-5xl font-normal tracking-[0.14em] text-[#f2ebd9] uppercase leading-tight">
            RESTAURANT OVERVIEW
          </h2>

          <p className="text-xs sm:text-sm font-cormorant italic text-[#c4b59d] tracking-widest text-lg">
            "The House operates with uncompromising precision. Every service has a story."
          </p>

          {/* Central Engraved Altar Plaque (Direct translation of the Treasury Balance plinth from reference) */}
          <div className="mt-8 p-6 max-w-lg mx-auto bg-[#0d0a07] border-2 border-[#8b6f38] shadow-[inset_0_0_15px_rgba(0,0,0,0.9),0_6px_20px_rgba(0,0,0,0.8)] space-y-2">
            <p className="text-[10px] font-serif-royal tracking-[0.3em] text-[#a88642] uppercase">
              PALATIAL SERVICE STATUS
            </p>
            <p className="font-serif-royal text-3xl sm:text-4xl font-bold tracking-wider text-[#e6ca94]">
              $ 89,760,980
            </p>
            <p className="text-[11px] font-mono tracking-widest text-[#755928] uppercase">
              +19.52% EXCELLENCE THIS CYCLE · 6 GRAND SALONS
            </p>
          </div>
        </div>
      </div>

      {/* Royal Ledger Table: "THE HOUSE AT A GLANCE" (Direct translation of "REVENUE STREAMS" from reference) */}
      <div className="royal-plaque p-6 sm:p-10 rounded-none relative">
        <div className="royal-corner royal-corner-tl" />
        <div className="royal-corner royal-corner-tr" />
        <div className="royal-corner royal-corner-bl" />
        <div className="royal-corner royal-corner-br" />

        <div className="text-center pb-6 border-b border-[#5a441e]/50">
          <span className="text-xs text-[#a88642] uppercase tracking-[0.3em] font-serif-royal block">
            ROYAL REGISTER
          </span>
          <h3 className="font-serif-royal text-2xl text-[#f2ebd9] tracking-[0.18em] mt-1 uppercase">
            THE HOUSE AT A GLANCE
          </h3>
        </div>

        {/* Engraved Ledger Rows with Diamond Bullet Points */}
        <div className="divide-y divide-[#3d2d14] max-w-3xl mx-auto py-4 font-serif-royal text-xs sm:text-sm">
          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642] text-xs">◈</span>
              <span>ACTIVE GUESTS SEATED</span>
            </span>
            <span className="font-mono text-base font-bold text-[#e6ca94] tracking-wider">
              {totalGuestsSeated} GUESTS
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642] text-xs">◈</span>
              <span>AVAILABLE SALON TABLES</span>
            </span>
            <span className="font-mono text-base font-bold text-[#f2ebd9] tracking-wider">
              {availableTables} <span className="text-xs text-[#755928]">/ {tables.length}</span>
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642] text-xs">◈</span>
              <span>WAITING GUESTS IN THE HALL</span>
            </span>
            <span className="font-mono text-base font-bold text-[#e6ca94] tracking-wider">
              {queue.length} PARTIES
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642] text-xs">◈</span>
              <span>ACTIVE CULINARY ORDERS</span>
            </span>
            <span className="font-mono text-base font-bold text-[#f2ebd9] tracking-wider">
              {activeOrders} ORDERS
            </span>
          </div>

          <div className="py-4 flex items-center justify-between hover:bg-[#120e08]/60 px-4 transition-colors">
            <span className="flex items-center space-x-3 text-[#d1c4ae] tracking-widest">
              <span className="text-[#a88642] text-xs">◈</span>
              <span>KITCHEN HEARTH LOAD</span>
            </span>
            <span className="font-mono text-base font-bold text-[#e6ca94] tracking-wider">
              {busyStations} OF {stations.length} STATIONS ACTIVE
            </span>
          </div>
        </div>

        {/* Operational Plaque Buttons */}
        <div className="pt-8 border-t border-[#5a441e]/50 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveTab('tables')}
            className="royal-btn royal-btn-gold"
          >
            [ VIEW ROYAL TABLES ]
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className="royal-btn"
          >
            [ INSPECT WAITING HALL ]
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="royal-btn"
          >
            [ CULINARY ORDERS ]
          </button>
        </div>
      </div>
    </div>
  );
}
