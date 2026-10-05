import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Clock, CheckCircle2 } from 'lucide-react';

const STATUS_NAMES = ['RECEIVED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'];

export default function OrderManagement({ orders, setOrders }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrderId, setNewOrderId] = useState(14);
  const [newCustId, setNewCustId] = useState(1234);
  const [newTableStr, setNewTableStr] = useState('IV + VI');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [confirmation, setConfirmation] = useState(null);

  const advanceOrder = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextStatus = ord.status < 4 ? ord.status + 1 : 4;
        return {
          ...ord,
          status: nextStatus,
          statusLabel: STATUS_NAMES[nextStatus],
          etaMinutes: Math.max(0, ord.etaMinutes - 6)
        };
      }
      return ord;
    }));

    setConfirmation(`✓ ORDER #${orderId.toString().padStart(3, '0')} STATUS ADVANCED`);
    setTimeout(() => setConfirmation(null), 4000);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const created = {
      id: parseInt(newOrderId, 10),
      customerId: parseInt(newCustId, 10),
      tableId: 4,
      tableDisplay: newTableStr,
      priority: 2,
      priorityLabel: newPriority,
      status: 0,
      statusLabel: 'RECEIVED',
      items: ['Smoked Black Truffle Risotto', 'Wagyu A5 Ribeye', 'Château Margaux 2015'],
      etaMinutes: 25
    };

    setOrders([created, ...orders]);
    setConfirmation(`✓ ORDER #${created.id.toString().padStart(3, '0')} COMMISSIONED`);
    setNewOrderId(prev => prev + 1);
    setShowCreateModal(false);
    setTimeout(() => setConfirmation(null), 4000);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL KITCHEN DISPATCH
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            CULINARY ORDERS
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "Every dish crafted under royal decree with stringent course tracking."
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="royal-btn royal-btn-gold"
          >
            [ + CREATE ORDER ]
          </button>
        </div>
      </div>

      {confirmation && (
        <div className="p-3 bg-[#141007] border-2 border-[#d4af37] text-center font-serif-royal text-sm text-[#e6ca94] shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fadeIn">
          {confirmation}
        </div>
      )}

      {/* Orders Grid of Engraved Plaques (Matching Prompt's exact specification) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((ord) => {
          const isDone = ord.status === 4;

          return (
            <div
              key={ord.id}
              className={`royal-plaque p-6 sm:p-7 rounded-none relative transition-all duration-300 ${
                isDone ? 'opacity-65 border-[#3d2d14]' : 'border-[#755928]'
              }`}
            >
              <div className="royal-corner royal-corner-tl" />
              <div className="royal-corner royal-corner-tr" />
              <div className="royal-corner royal-corner-bl" />
              <div className="royal-corner royal-corner-br" />

              {/* Order Header */}
              <div className="flex justify-between items-start pb-4 border-b border-[#3d2d14]">
                <div>
                  <h3 className="font-serif-royal text-2xl font-bold tracking-widest text-[#f2ebd9]">
                    ORDER #{ord.id.toString().padStart(3, '0')}
                  </h3>
                  <p className="text-xs font-serif-royal text-[#a88642] tracking-wider mt-0.5">
                    CUSTOMER #{ord.customerId}
                  </p>
                </div>

                <span className="px-2.5 py-1 bg-[#14100a] border border-[#755928] text-[#e6ca94] text-[10px] font-serif-royal tracking-widest uppercase">
                  {ord.priorityLabel || 'NORMAL'}
                </span>
              </div>

              {/* Order Body Details */}
              <div className="py-5 font-serif-royal text-xs space-y-2 text-[#c4b59d]">
                <p className="flex justify-between">
                  <span className="text-[#755928] uppercase">SALON TABLE:</span>
                  <strong className="text-[#f2ebd9] font-mono">{ord.tableDisplay || (ord.tableId > 0 ? `TABLE ${ord.tableId}` : 'PARCHMENT BAR')}</strong>
                </p>

                <p className="flex justify-between">
                  <span className="text-[#755928] uppercase">STATUS:</span>
                  <span className={`font-bold tracking-widest uppercase ${
                    ord.status === 4 ? 'text-[#96b87d]' :
                    ord.status >= 1 ? 'text-[#e6ca94]' : 'text-[#f2ebd9]'
                  }`}>
                    {ord.statusLabel || STATUS_NAMES[ord.status]}
                  </span>
                </p>

                <p className="flex justify-between">
                  <span className="text-[#755928] uppercase">EST. COMPLETION:</span>
                  <span className="text-[#f2ebd9] font-mono">{ord.etaMinutes} MIN</span>
                </p>

                <p className="pt-2 text-[11px] font-cormorant italic text-[#755928] line-clamp-1">
                  {ord.items ? ord.items.join(' · ') : 'Haute gastronomie tasting course'}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#3d2d14]">
                {!isDone ? (
                  <button
                    onClick={() => advanceOrder(ord.id)}
                    className="w-full royal-btn text-[10px]"
                  >
                    [ ADVANCE STATUS ]
                  </button>
                ) : (
                  <span className="w-full text-center block text-[10px] font-serif-royal text-[#96b87d] py-1 tracking-widest uppercase">
                    ✓ COMPLETED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#050403]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md royal-plaque p-8 rounded-none relative space-y-6 shadow-2xl">
            <div className="royal-corner royal-corner-tl" />
            <div className="royal-corner royal-corner-tr" />
            <div className="royal-corner royal-corner-bl" />
            <div className="royal-corner royal-corner-br" />

            <div className="text-center pb-4 border-b border-[#5a441e]">
              <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
                COMMISSION RECEIPT
              </span>
              <h3 className="font-serif-royal text-xl text-[#f2ebd9] tracking-wider uppercase mt-1">
                COMMISSION NEW ORDER
              </h3>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5 font-serif-royal text-xs">
              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  ORDER NUMBER
                </label>
                <input
                  type="number"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#f2ebd9] font-mono focus:border-[#d4af37] outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  CUSTOMER ID
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
                  SALON TABLE (E.G. TABLE IV + VI)
                </label>
                <input
                  type="text"
                  value={newTableStr}
                  onChange={(e) => setNewTableStr(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#f2ebd9] font-mono focus:border-[#d4af37] outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a88642] uppercase tracking-widest mb-1">
                  PRIORITY TIER
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-[#0a0704] border border-[#5a441e] px-3.5 py-2.5 text-[#e6ca94] focus:border-[#d4af37] outline-none text-xs"
                >
                  <option value="NORMAL">NORMAL (Dine-In Standard)</option>
                  <option value="VIP">VIP (Expedited Hearth Service)</option>
                  <option value="URGENT">URGENT (Royal Banquet Protocol)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between space-x-4 border-t border-[#3d2d14]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="royal-btn w-1/2"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  className="royal-btn royal-btn-gold w-1/2"
                >
                  [ COMMISSION ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
