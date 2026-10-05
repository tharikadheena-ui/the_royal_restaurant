import React from 'react';
import { 
  Crown, 
  Layers, 
  Users, 
  UtensilsCrossed, 
  Flame, 
  Sparkles, 
  Scale,
  Clock
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'OVERVIEW', icon: Crown, glyph: 'I' },
  { id: 'tables', label: 'TABLES', icon: Layers, glyph: 'II' },
  { id: 'queue', label: 'QUEUE', icon: Users, glyph: 'III' },
  { id: 'orders', label: 'ORDERS', icon: UtensilsCrossed, glyph: 'IV' },
  { id: 'kitchen', label: 'KITCHEN', icon: Flame, glyph: 'V' },
  { id: 'simulation', label: 'SIMULATION', icon: Sparkles, glyph: 'VI' },
  { id: 'metrics', label: 'METRICS', icon: Scale, glyph: 'VII' },
];

export default function Navbar({ activeTab, setActiveTab, currentTime }) {
  return (
    <header className="sticky top-0 z-50 bg-[#070605] border-b-2 border-[#5a441e] shadow-2xl">
      {/* Top Royal Crest Header: Direct translation of Reference Image Top ("5 ROYAL TREASURY OVERVIEW") */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3b2b12]">
        <div className="flex items-center space-x-4">
          {/* Left Embossed Medallion (Matching the "5" medallion in the reference image) */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="cursor-pointer w-12 h-12 rounded-full border-2 border-[#8b6f38] bg-gradient-to-b from-[#241a0e] to-[#0a0704] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,230,160,0.3),0_4px_10px_rgba(0,0,0,0.8)] hover:border-[#d4af37] transition-all"
          >
            <span className="font-serif-royal text-xl font-bold text-[#e6ca94]">
              V
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif-royal text-xl sm:text-2xl font-bold tracking-[0.16em] text-[#f2ebd9] uppercase leading-none">
                ROYAL RESTAURANT
              </h1>
            </div>
            <p className="text-[10px] tracking-[0.28em] text-[#a88642] uppercase font-serif-royal mt-1">
              THE HOUSE OPERATES WITH UNCOMPROMISING PRECISION
            </p>
          </div>
        </div>

        {/* Right Status Ledger */}
        <div className="flex items-center space-x-6 text-[11px] font-serif-royal tracking-widest text-[#a88642]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
            <span className="text-[#e6ca94]">HOUSE OF SERVICE</span>
          </div>
          <span className="text-[#5a441e]">❖</span>
          <div className="flex items-center space-x-1.5 font-mono text-xs text-[#c4b59d]">
            <Clock className="w-3.5 h-3.5 text-[#8b6f38]" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Royal Medallion Navigation (Direct translation of the bottom circular icon buttons in the reference) */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-center space-x-3 sm:space-x-6 md:space-x-8 overflow-x-auto scrollbar-none py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center group flex-shrink-0 focus:outline-none"
              >
                {/* Circular Embossed Medallion */}
                <div className={`royal-medallion ${isActive ? 'active' : ''}`}>
                  <div className="royal-medallion-inner">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#f2ebd9]' : 'text-[#a88642] group-hover:text-[#e6ca94]'
                    }`} />
                  </div>
                </div>

                {/* Text Label Underneath */}
                <span className={`text-[10px] font-serif-royal tracking-[0.2em] uppercase mt-1.5 transition-colors ${
                  isActive ? 'text-[#e6ca94] font-bold' : 'text-[#755928] group-hover:text-[#c4b59d]'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
