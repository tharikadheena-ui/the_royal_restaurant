import React from 'react';
import { Flame, Clock, ChefHat } from 'lucide-react';

export default function KitchenOperations({ stations, setStations }) {
  const toggleStation = (stationId) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        const nextAvail = !s.available;
        return {
          ...s,
          available: nextAvail,
          currentTask: nextAvail ? 'Idle / Ready for Service' : 'Active Preparation Task',
          estRemaining: nextAvail ? 0 : 15
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL KITCHEN STATIONS
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            THE ROYAL KITCHEN
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "Artisanal hearths and sommelier vaults operating under ancient royal recipes."
          </p>
        </div>

        <div className="mt-4 sm:mt-0 font-serif-royal text-xs text-[#a88642] tracking-widest uppercase">
          <span>AVAILABLE: {stations.filter(s => s.available).length}</span>
          <span className="mx-2 text-[#5a441e]">❖</span>
          <span>BUSY: {stations.filter(s => !s.available).length}</span>
        </div>
      </div>

      {/* Engraved Station Plaques (Exact match to prompt specifications) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stations.map((st) => {
          return (
            <div
              key={st.id}
              className={`royal-plaque p-6 rounded-none relative flex flex-col justify-between min-h-[350px] transition-all duration-300 ${
                st.available
                  ? 'border-[#755928] bg-gradient-to-b from-[#14100a] to-[#070503]'
                  : 'border-[#8c4819] bg-gradient-to-b from-[#211207] to-[#0a0604]'
              }`}
            >
              <div className="royal-corner royal-corner-tl" />
              <div className="royal-corner royal-corner-tr" />
              <div className="royal-corner royal-corner-bl" />
              <div className="royal-corner royal-corner-br" />

              {/* Station Header */}
              <div>
                <span className="text-[10px] font-serif-royal tracking-[0.25em] text-[#755928] uppercase block pb-2 border-b border-[#3d2d14]">
                  STATION {st.id.toString().padStart(2, '0')}
                </span>

                <h3 className="font-serif-royal text-xl font-bold tracking-wider text-[#f2ebd9] mt-4 uppercase leading-snug">
                  {st.name}
                </h3>

                {/* Status Indicator */}
                <div className="mt-4">
                  {st.available ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#14100a] border border-[#755928] text-[#e6ca94] text-[10px] font-serif-royal tracking-widest uppercase">
                      <span>◈ AVAILABLE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#2b1607] border border-[#d4812f] text-[#ffb366] text-[10px] font-serif-royal tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff9933] animate-pulse" />
                      <span>◈ BUSY</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Active Task */}
              <div className="py-6 border-y border-[#3d2d14] my-4 font-serif-royal space-y-1.5">
                <p className="text-[10px] text-[#755928] uppercase tracking-widest">
                  CURRENT TASK
                </p>
                <p className="text-xs text-[#c4b59d] font-medium leading-relaxed">
                  {st.currentTask}
                </p>
                {!st.available && (
                  <p className="text-[11px] font-mono text-[#ffb366] pt-1">
                    EST. {st.estRemaining} MINS REMAINING
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => toggleStation(st.id)}
                  className="w-full royal-btn text-[10px]"
                >
                  {st.available ? '[ ASSIGN PREPARATION ]' : '[ RELEASE HEARTH ]'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
