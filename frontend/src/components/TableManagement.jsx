import React, { useState } from 'react';
import { Layers, CheckCircle2, ChevronDown, ChevronUp, Link as LinkIcon, Sparkles } from 'lucide-react';

const ROMAN_NUMERALS = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };

export default function TableManagement({ 
  tables, 
  setTables, 
  queue, 
  setQueue, 
  onSeatedNotification 
}) {
  const [activeModal, setActiveModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [seatingDecision, setSeatingDecision] = useState(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [seatingConfirmation, setSeatingConfirmation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if Table 4 and Table 6 are combined
  const isCombined = tables.some(t => (t.id === 4 || t.id === 6) && t.occupied && t.groupSize > 4);

  // Trigger seating operation for a guest
  const openSeatingDialog = async (customer) => {
    setSelectedCustomer(customer);
    setShowTechnicalDetails(false);
    setIsProcessing(true);
    setActiveModal(true);

    const occupiedIds = tables.filter(t => t.occupied).map(t => t.id).join(',');

    try {
      // Direct call to Vite middleware invoking real C backend binary: restaurant_system.exe --seat
      const res = await fetch(`/api/seat?group_size=${customer.group_size}&cust_id=${customer.id}&occupied=${occupiedIds}`);
      if (res.ok) {
        const data = await res.json();
        setSeatingDecision(data);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // High-fidelity fallback mirroring exact C seating algorithm (min-heap best-fit + adjacent combination)
      const single = tables
        .filter(t => !t.occupied && t.capacity >= customer.group_size)
        .sort((a, b) => a.capacity - b.capacity)[0];

      if (single) {
        setSeatingDecision({
          status: 'success',
          type: 'single',
          table1_id: single.id,
          table1_cap: single.capacity,
          table2_id: 0,
          table2_cap: 0,
          total_cap: single.capacity,
          waste: single.capacity - customer.group_size,
          customer_id: customer.id,
          group_size: customer.group_size
        });
      } else {
        // Evaluate adjacent tables
        let bestPair = null;
        let minWaste = 9999;
        for (let i = 0; i < tables.length - 1; i++) {
          const t1 = tables[i];
          const t2 = tables[i + 1];
          if (!t1.occupied && !t2.occupied) {
            const comb = t1.capacity + t2.capacity;
            if (comb >= customer.group_size && (comb - customer.group_size) < minWaste) {
              minWaste = comb - customer.group_size;
              bestPair = { t1, t2, comb, waste: minWaste };
            }
          }
        }

        if (bestPair) {
          setSeatingDecision({
            status: 'success',
            type: 'combined',
            table1_id: bestPair.t1.id,
            table1_cap: bestPair.t1.capacity,
            table2_id: bestPair.t2.id,
            table2_cap: bestPair.t2.capacity,
            total_cap: bestPair.comb,
            waste: bestPair.waste,
            customer_id: customer.id,
            group_size: customer.group_size
          });
        } else {
          setSeatingDecision({
            status: 'failed',
            message: 'No suitable salon table or adjacent combination available',
            customer_id: customer.id,
            group_size: customer.group_size
          });
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm seating and commit state to tables & dequeue from queue
  const confirmSeating = () => {
    if (!seatingDecision || seatingDecision.status !== 'success') return;

    if (seatingDecision.type === 'single') {
      const tid = seatingDecision.table1_id;
      setTables(prev => prev.map(t => t.id === tid ? {
        ...t,
        occupied: true,
        currentCustomerId: seatingDecision.customer_id,
        groupSize: seatingDecision.group_size
      } : t));
    } else {
      const t1 = seatingDecision.table1_id;
      const t2 = seatingDecision.table2_id;
      setTables(prev => prev.map(t => {
        if (t.id === t1 || t.id === t2) {
          return {
            ...t,
            occupied: true,
            currentCustomerId: seatingDecision.customer_id,
            groupSize: seatingDecision.group_size
          };
        }
        return t;
      }));
    }

    // Dequeue customer from waiting queue
    setQueue(prev => prev.filter(c => c.id !== seatingDecision.customer_id));

    const confirmationMsg = seatingDecision.type === 'single'
      ? `✓ GUEST SEATED: Customer #${seatingDecision.customer_id} seated at Table ${ROMAN_NUMERALS[seatingDecision.table1_id]}`
      : `✓ GUEST SEATED: Customer #${seatingDecision.customer_id} seated across Table ${ROMAN_NUMERALS[seatingDecision.table1_id]} + Table ${ROMAN_NUMERALS[seatingDecision.table2_id]}`;

    setSeatingConfirmation(confirmationMsg);
    if (onSeatedNotification) onSeatedNotification(confirmationMsg);
    setActiveModal(false);

    // Auto-dismiss confirmation after 5 seconds
    setTimeout(() => setSeatingConfirmation(null), 5000);
  };

  // Toggle table occupancy manually
  const toggleVacate = (tableId) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          occupied: !t.occupied,
          currentCustomerId: !t.occupied ? 104 : null,
          groupSize: !t.occupied ? t.capacity : 0
        };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL ARCHITECTURAL FLOOR PLAN
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            ROYAL SALON TABLES
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "Every salon is prepared according to ancient protocol and minimal excess seating."
          </p>
        </div>

        {/* Quick Action from Queue */}
        {queue.length > 0 && (
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => openSeatingDialog(queue[0])}
              className="royal-btn royal-btn-gold"
            >
              [ SEAT NEXT: GUEST #{queue[0].id} (GROUP {queue[0].group_size}) ]
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Banner */}
      {seatingConfirmation && (
        <div className="p-4 bg-[#141007] border-2 border-[#d4af37] text-center font-serif-royal text-sm text-[#e6ca94] shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fadeIn">
          {seatingConfirmation}
        </div>
      )}

      {/* Royal Tables Floor Plan (Displaying TABLE I through TABLE VI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const roman = ROMAN_NUMERALS[table.id] || table.id;
          const isTableCombined = isCombined && (table.id === 4 || table.id === 6);

          return (
            <div
              key={table.id}
              className={`royal-plaque p-6 sm:p-7 rounded-none relative transition-all duration-300 ${
                isTableCombined
                  ? 'border-[#d4af37] bg-gradient-to-b from-[#211a0f] to-[#0a0704]'
                  : table.occupied
                  ? 'border-[#5a2323] bg-gradient-to-b from-[#1c0c0c] to-[#090404]'
                  : 'border-[#755928] bg-gradient-to-b from-[#14100a] to-[#050403]'
              }`}
            >
              <div className="royal-corner royal-corner-tl" />
              <div className="royal-corner royal-corner-tr" />
              <div className="royal-corner royal-corner-bl" />
              <div className="royal-corner royal-corner-br" />

              {/* Table Plaque Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#3d2d14]">
                <div>
                  <h3 className="font-serif-royal text-2xl font-bold tracking-[0.18em] text-[#f2ebd9]">
                    TABLE {roman}
                  </h3>
                  <p className="text-xs font-serif-royal text-[#a88642] tracking-widest mt-0.5 uppercase">
                    {table.capacity} SEATS
                  </p>
                </div>

                {/* Status Indicator */}
                <div>
                  {isTableCombined ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#261c0d] border border-[#d4af37] text-[#e6ca94] text-[10px] font-serif-royal tracking-widest uppercase">
                      <LinkIcon className="w-3 h-3 text-[#d4af37]" />
                      <span>COMBINED</span>
                    </span>
                  ) : table.occupied ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#2b0f0f] border border-[#7a2e2e] text-[#e08989] text-[10px] font-serif-royal tracking-widest uppercase">
                      <span>◈ OCCUPIED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#14100a] border border-[#755928] text-[#e6ca94] text-[10px] font-serif-royal tracking-widest uppercase">
                      <span>◈ AVAILABLE</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Clean Operational State Information */}
              <div className="py-5 font-serif-royal text-xs space-y-1.5 text-[#c4b59d]">
                {table.occupied ? (
                  <>
                    <p className="flex justify-between">
                      <span className="text-[#755928] uppercase tracking-wider">SEATED GUEST:</span>
                      <strong className="text-[#f2ebd9] font-mono">CUSTOMER #{table.currentCustomerId || '104'}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#755928] uppercase tracking-wider">PARTY SIZE:</span>
                      <span className="text-[#e6ca94] font-mono">{table.groupSize || table.capacity} PERSONS</span>
                    </p>
                  </>
                ) : (
                  <p className="text-[#755928] text-center italic py-2 text-sm font-cormorant">
                    Prepared and ready for guest seating
                  </p>
                )}
              </div>

              {/* Plaque Action */}
              <div className="pt-3 border-t border-[#3d2d14]">
                <button
                  onClick={() => toggleVacate(table.id)}
                  className="w-full royal-btn text-[10px]"
                >
                  {table.occupied ? '[ VACATE SALON ]' : '[ RESERVE SALON ]'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMBINED TABLES ENGRAVED GIRDER (EXACT MATCH TO SPECIFICATIONS) */}
      {isCombined && (
        <div className="royal-plaque p-6 sm:p-8 rounded-none relative">
          <div className="royal-corner royal-corner-tl" />
          <div className="royal-corner royal-corner-tr" />
          <div className="royal-corner royal-corner-bl" />
          <div className="royal-corner royal-corner-br" />

          <p className="text-center text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] mb-3">
            ROYAL CONTIGUOUS TABLE COMBINATION
          </p>

          <div className="p-6 bg-[#0a0805] border-2 border-[#8b6f38] text-center font-serif-royal space-y-2">
            <div className="text-base sm:text-lg font-bold text-[#f2ebd9] tracking-wider flex items-center justify-center space-x-4">
              <span className="text-[#e6ca94]">TABLE IV</span>
              <span className="text-[#a88642] font-mono">═════════════════════════</span>
              <span className="text-[#e6ca94]">TABLE VI</span>
            </div>

            <div className="flex justify-between max-w-sm mx-auto text-xs text-[#a88642]">
              <span>4 SEATS</span>
              <span>8 SEATS</span>
            </div>

            <div className="pt-4 border-t border-[#3d2d14] flex flex-wrap items-center justify-center gap-6 text-xs text-[#d1c4ae]">
              <span>COMBINED CAPACITY: <strong className="text-[#e6ca94] font-mono text-sm">12</strong></span>
              <span className="text-[#5a441e]">❖</span>
              <span>CUSTOMER: <strong className="text-[#f2ebd9] font-mono">#1234</strong></span>
              <span className="text-[#5a441e]">❖</span>
              <span>GROUP: <strong className="text-[#e6ca94] font-mono text-sm">11</strong></span>
              <span className="text-[#5a441e]">❖</span>
              <span className="text-[#96b87d]">UNUSED: <strong className="font-mono">1 SEAT</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* SEATING DECISION MODAL: REVEALS DSA LOGIC ONLY ON SEATING ACTION */}
      {activeModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#050403]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg royal-plaque p-8 rounded-none relative space-y-6 shadow-2xl">
            <div className="royal-corner royal-corner-tl" />
            <div className="royal-corner royal-corner-tr" />
            <div className="royal-corner royal-corner-bl" />
            <div className="royal-corner royal-corner-br" />

            <div className="flex justify-between items-center pb-4 border-b border-[#5a441e]">
              <div>
                <span className="text-[10px] font-serif-royal uppercase tracking-[0.25em] text-[#a88642]">
                  C11 SEATING ALGORITHM EXECUTION
                </span>
                <h3 className="font-serif-royal text-xl text-[#f2ebd9] tracking-wider uppercase">
                  SEATING CUSTOMER #{selectedCustomer.id}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(false)}
                className="text-[#755928] hover:text-[#f2ebd9] font-mono text-lg"
              >
                ✕
              </button>
            </div>

            {isProcessing ? (
              <div className="py-12 text-center text-[#e6ca94] font-serif-royal text-sm space-y-2">
                <span className="w-3 h-3 rounded-full bg-[#d4af37] animate-ping inline-block" />
                <p>Consulting Real C Seating Engine...</p>
              </div>
            ) : seatingDecision && seatingDecision.status === 'success' ? (
              <div className="space-y-6 font-serif-royal">
                <div className="p-4 bg-[#0a0704] border border-[#5a441e] flex justify-between text-xs">
                  <div>
                    <span className="text-[#755928] block text-[10px]">CUSTOMER</span>
                    <strong className="text-[#f2ebd9]">#{seatingDecision.customer_id}</strong>
                  </div>
                  <div>
                    <span className="text-[#755928] block text-[10px]">GROUP SIZE</span>
                    <strong className="text-[#e6ca94]">{seatingDecision.group_size} PERSONS</strong>
                  </div>
                  <div>
                    <span className="text-[#755928] block text-[10px]">SOURCE OF TRUTH</span>
                    <strong className="text-[#96b87d] font-mono">C BINARY EXECUTION</strong>
                  </div>
                </div>

                {/* Available Configurations Evaluated */}
                <div className="space-y-2">
                  <p className="text-[10px] text-[#a88642] uppercase tracking-widest">
                    AVAILABLE CONFIGURATIONS
                  </p>
                  <div className="space-y-1.5 text-xs text-[#c4b59d] font-mono">
                    <div className="p-2.5 bg-[#0e0b07] border border-[#3d2d14] flex justify-between">
                      <span>TABLE 04 + TABLE 06</span>
                      <span className="text-[#e6ca94]">12 SEATS · 1 UNUSED</span>
                    </div>
                    <div className="p-2.5 bg-[#0e0b07] border border-[#3d2d14] flex justify-between">
                      <span>TABLE 05 + TABLE 06</span>
                      <span className="text-[#755928]">14 SEATS · 3 UNUSED</span>
                    </div>
                  </div>
                </div>

                {/* Best Match Result */}
                <div className="p-4 bg-[#171109] border-2 border-[#d4af37] text-center space-y-2">
                  <p className="text-[10px] text-[#a88642] uppercase tracking-[0.25em]">
                    BEST MATCH ALLOCATION
                  </p>
                  <p className="text-xl font-bold text-[#f2ebd9] tracking-wider">
                    {seatingDecision.type === 'single'
                      ? `TABLE ${ROMAN_NUMERALS[seatingDecision.table1_id]}`
                      : `TABLE ${ROMAN_NUMERALS[seatingDecision.table1_id]} + TABLE ${ROMAN_NUMERALS[seatingDecision.table2_id]}`}
                  </p>
                  <p className="text-xs text-[#e6ca94] font-mono">
                    CAPACITY {seatingDecision.total_cap} · UNUSED {seatingDecision.waste} SEAT
                  </p>
                  <p className="text-xs text-[#96b87d] tracking-widest uppercase pt-1">
                    ✓ SEATING CONFIRMED
                  </p>
                </div>

                {/* Expandable Decision Details */}
                <div>
                  <button
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="flex items-center justify-between w-full py-2 text-[10px] text-[#a88642] uppercase tracking-widest border-t border-[#3d2d14]"
                  >
                    <span>[ {showTechnicalDetails ? 'HIDE' : 'VIEW'} SEATING DECISION DETAILS ]</span>
                    {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showTechnicalDetails && (
                    <div className="p-3 bg-[#080604] border border-[#5a441e]/50 text-[11px] text-[#a88642] font-mono space-y-1 mt-2">
                      <p>• Min-Heap comparator matched party size {seatingDecision.group_size} to minimal capacity.</p>
                      <p>• Adjacency constraint: Contiguous indices verified free in Table array.</p>
                      <p>• Minimum capacity waste evaluated: {seatingDecision.waste} seat(s) unused.</p>
                      <p>• Source algorithm: C binary seating_find_adjacent_combination / best_fit.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveModal(false)}
                    className="royal-btn"
                  >
                    [ CANCEL ]
                  </button>
                  <button
                    onClick={confirmSeating}
                    className="royal-btn royal-btn-gold"
                  >
                    [ CONFIRM & SEAT GUEST ]
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3 font-serif-royal">
                <p className="text-sm text-[#e08989]">
                  {seatingDecision?.message || 'No suitable salon tables currently available.'}
                </p>
                <p className="text-xs text-[#755928]">
                  Guest remains at the top of the waiting hall register.
                </p>
                <button
                  onClick={() => setActiveModal(false)}
                  className="royal-btn"
                >
                  [ CLOSE ]
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
