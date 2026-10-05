import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function WaitingQueue({ queue, setQueue, onSeatCustomer }) {
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [newCustId, setNewCustId] = useState(1234);
  const [newGroupSize, setNewGroupSize] = useState(11);
  const [newPriority, setNewPriority] = useState(1); // 1: Normal, 2: VIP, 3: Urgent
  const [admitConfirmation, setAdmitConfirmation] = useState(null);

  const handleAdmitGuest = (e) => {
    e.preventDefault();
    const priorityLabels = { 1: 'Normal', 2: 'VIP', 3: 'Urgent' };
    const admitted = {
      id: parseInt(newCustId, 10),
      group_size: parseInt(newGroupSize, 10),
      priority: parseInt(newPriority, 10),
      priorityLabel: priorityLabels[newPriority],
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: 'Palatial Reception Registration'
    };

    // Re-heapify / sort according to C priority queue logic: higher priority first, tie-break by lower ID
    const updated = [...queue, admitted].sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.id - b.id;
    });

    setQueue(updated);

    // Calculate position
    const pos = updated.findIndex(c => c.id === admitted.id) + 1;
    const confirmationText = `✓ GUEST ADMITTED: Customer #${admitted.id}, Group of ${admitted.group_size}, Position ${pos.toString().padStart(2, '0')}`;
    setAdmitConfirmation(confirmationText);

    setNewCustId(prev => prev + 1);
    setShowAdmitModal(false);

    setTimeout(() => {
      setAdmitConfirmation(null);
    }, 5000);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL GUEST REGISTER
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            THE WAITING HALL
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "Priority queue & guest register for esteemed palatial patrons."
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowAdmitModal(true)}
            className="royal-btn royal-btn-gold"
          >
            [ + ADMIT GUEST ]
          </button>
        </div>
      </div>

      {/* Subtle Elegant Admission Confirmation */}
      {admitConfirmation && (
        <div className="p-4 bg-[#141007] border-2 border-[#d4af37] text-center font-serif-royal text-sm text-[#e6ca94] shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fadeIn">
          {admitConfirmation}
        </div>
      )}

      {/* Royal Ledger / Guest Register (Matching the prompt's exact ledger design) */}
      <div className="royal-plaque p-6 sm:p-10 rounded-none relative">
        <div className="royal-corner royal-corner-tl" />
        <div className="royal-corner royal-corner-tr" />
        <div className="royal-corner royal-corner-bl" />
        <div className="royal-corner royal-corner-br" />

        <div className="text-center pb-6 border-b border-[#5a441e]/50">
          <span className="text-xs text-[#a88642] uppercase tracking-[0.3em] font-serif-royal block">
            ESTABLISHED ORDER OF SERVICE
          </span>
          <h3 className="font-serif-royal text-xl text-[#f2ebd9] tracking-[0.18em] mt-1 uppercase">
            GUEST PRECEDENCE ROSTER
          </h3>
        </div>

        {queue.length === 0 ? (
          <div className="py-16 text-center text-[#755928] font-serif-royal text-sm">
            The waiting hall is quiet. All guests have been graciously seated.
          </div>
        ) : (
          <div className="divide-y divide-[#3d2d14] max-w-4xl mx-auto py-4 font-serif-royal">
            {queue.map((customer, index) => {
              const position = (index + 1).toString().padStart(2, '0');
              const estWait = (index) * 5;

              return (
                <div
                  key={customer.id}
                  className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#120e08]/60 px-4 transition-colors"
                >
                  {/* Left: Position & Guest Details */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center font-mono">
                      <span className="text-[9px] text-[#755928] block tracking-widest">POS</span>
                      <span className="font-serif-royal text-2xl font-bold text-[#e6ca94]">
                        {position}
                      </span>
                    </div>

                    <div className="border-l border-[#5a441e]/40 pl-6 space-y-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-serif-royal text-base sm:text-lg text-[#f2ebd9] tracking-wider">
                          CUSTOMER #{customer.id}
                        </h4>
                        <span className="text-xs font-mono text-[#a88642]">
                          GROUP {customer.group_size}
                        </span>
                      </div>
                      <p className="text-xs text-[#755928] font-cormorant italic tracking-wide">
                        {customer.notes || 'Palatial Patron'} · Arrived {customer.arrivalTime}
                      </p>
                    </div>
                  </div>

                  {/* Right: Refined Typographic Priority, Wait & Action */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[9px] text-[#755928] uppercase tracking-widest block">PRIORITY</span>
                      <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${
                        customer.priority === 3 ? 'text-[#f2ebd9] underline decoration-[#d4af37]' :
                        customer.priority === 2 ? 'text-[#e6ca94]' : 'text-[#a88642]'
                      }`}>
                        {customer.priorityLabel.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    <div className="text-right font-mono min-w-[90px]">
                      <span className="text-[9px] text-[#755928] uppercase tracking-widest block">EST. WAIT</span>
                      <span className="text-xs font-semibold text-[#f2ebd9]">
                        {estWait === 0 ? '0 MIN' : `${estWait} MIN`}
                      </span>
                    </div>

                    {/* SEAT GUEST BUTTON: Triggers the real C seating algorithm */}
                    <div>
                      <button
                        onClick={() => onSeatCustomer(customer)}
                        className="royal-btn royal-btn-gold text-[10px]"
                      >
                        [ SEAT GUEST ]
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADMIT GUEST MODAL (Exact translation of the prompt's specified modal) */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-[#050403]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md royal-plaque p-8 rounded-none relative space-y-6 shadow-2xl">
            <div className="royal-corner royal-corner-tl" />
            <div className="royal-corner royal-corner-tr" />
            <div className="royal-corner royal-corner-bl" />
            <div className="royal-corner royal-corner-br" />

            <div className="text-center pb-4 border-b border-[#5a441e]">
              <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
                ROYAL RECEPTION
              </span>
              <h3 className="font-serif-royal text-xl text-[#f2ebd9] tracking-wider uppercase mt-1">
                ADMIT NEW GUEST
              </h3>
            </div>

            <form onSubmit={handleAdmitGuest} className="space-y-5 font-serif-royal text-xs">
              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  GUEST / CUSTOMER ID
                </label>
                <input
                  type="number"
                  value={newCustId}
                  onChange={(e) => setNewCustId(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#f2ebd9] font-mono focus:border-[#d4af37] outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  PARTY SIZE
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newGroupSize}
                  onChange={(e) => setNewGroupSize(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#f2ebd9] font-mono focus:border-[#d4af37] outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  PRIORITY
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#e6ca94] focus:border-[#d4af37] outline-none text-xs"
                >
                  <option value={1}>NORMAL (Standard Priority)</option>
                  <option value={2}>VIP (Distinguished Members)</option>
                  <option value={3}>URGENT (Royal Diplomatic)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between space-x-4 border-t border-[#3d2d14]">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="royal-btn w-1/2"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  className="royal-btn royal-btn-gold w-1/2"
                >
                  [ ADMIT GUEST ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
