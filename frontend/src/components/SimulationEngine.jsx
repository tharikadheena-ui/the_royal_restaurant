import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';

const SHIFT_STAGES = [
  { id: 1, roman: 'I', label: 'GUESTS ARRIVE IN HALL', desc: 'Distinguished parties arrive and are inscribed into the priority register.' },
  { id: 2, roman: 'II', label: 'MIN-HEAP BEST-FIT SEATING', desc: 'Optimal salon tables allocated with minimal excess capacity.' },
  { id: 3, roman: 'III', label: 'ORDERS LOGGED TO HEARTH', desc: 'Culinary orders inscribed and dispatched to active kitchen stations.' },
  { id: 4, roman: 'IV', label: 'GRAND HEARTH PREPARATION', desc: 'Cooking stations active; courses transition from Preparing to Ready.' },
  { id: 5, roman: 'V', label: 'BUTLER SERVICE & CONCLUSION', desc: 'White-glove service completed; tables vacated and reset.' },
];

export default function SimulationEngine({ onSimulationComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [chronicleLogs, setChronicleLogs] = useState([
    { time: '19:30:00', text: 'Royal evening shift simulation ready to begin.' }
  ]);

  useEffect(() => {
    let t;
    if (isAuto && currentStage > 0 && currentStage < 5) {
      t = setTimeout(() => {
        advanceStage(currentStage + 1);
      }, 3500);
    } else if (isAuto && currentStage === 5) {
      setIsAuto(false);
    }
    return () => clearTimeout(t);
  }, [isAuto, currentStage]);

  const addLog = (text) => {
    const time = new Date().toLocaleTimeString();
    setChronicleLogs(prev => [{ time, text }, ...prev]);
  };

  const advanceStage = (st) => {
    setCurrentStage(st);
    if (st === 1) {
      addLog('❖ Stage I: Customers #201, #202 (VIP), #203 inscribed into the guest register.');
    } else if (st === 2) {
      addLog('❖ Stage II: Table III allocated to Customer #202; Table V to #203; Table I to #201.');
    } else if (st === 3) {
      addLog('❖ Stage III: Culinary commissions #701, #702, #703 dispatched to kitchen stations.');
    } else if (st === 4) {
      addLog('❖ Stage IV: Grill & Hearth Station prepared Wagyu A5; courses staged for inspection.');
    } else if (st === 5) {
      addLog('❖ Stage V: Meals gracefully served. Orders completed and salon tables cleaned.');
      if (onSimulationComplete) onSimulationComplete();
    }
  };

  const runFull = () => {
    setChronicleLogs([]);
    advanceStage(1);
    setIsAuto(true);
  };

  const reset = () => {
    setCurrentStage(0);
    setIsAuto(false);
    setChronicleLogs([{ time: new Date().toLocaleTimeString(), text: 'Shift simulation reset to idle state.' }]);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#5a441e]/50 pb-5">
        <div>
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.3em] text-[#a88642] block">
            ROYAL EVENING SIMULATION
          </span>
          <h2 className="font-serif-royal text-2xl sm:text-4xl text-[#f2ebd9] tracking-[0.16em] uppercase mt-1">
            THE PALATIAL SIMULATION
          </h2>
          <p className="text-xs font-cormorant italic text-[#c4b59d] tracking-wider text-base mt-1">
            "A calm, cinematic demonstration of the interconnected dining operations."
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {currentStage === 0 ? (
            <button
              onClick={runFull}
              className="royal-btn royal-btn-gold"
            >
              [ RUN FULL SHIFT CYCLE ]
            </button>
          ) : (
            <>
              {currentStage < 5 && (
                <button
                  onClick={() => advanceStage(currentStage + 1)}
                  className="royal-btn royal-btn-gold text-[10px]"
                >
                  [ ADVANCE STAGE {currentStage + 1} / 5 ]
                </button>
              )}
              <button
                onClick={reset}
                className="royal-btn text-[10px]"
              >
                [ RESET ]
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stepper Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {SHIFT_STAGES.map((s) => {
          const isCurrent = currentStage === s.id;
          const isDone = currentStage > s.id;

          return (
            <div
              key={s.id}
              className={`p-4 border transition-all rounded-none font-serif-royal ${
                isCurrent
                  ? 'border-[#d4af37] bg-[#1a1209] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : isDone
                  ? 'border-[#755928] bg-[#0c0906] text-[#e6ca94]'
                  : 'border-[#3d2d14] bg-[#070503] opacity-60'
              }`}
            >
              <span className="text-[10px] text-[#a88642] block tracking-widest">STAGE {s.roman}</span>
              <h4 className="text-xs font-bold text-[#f2ebd9] tracking-wider uppercase mt-1 line-clamp-1">
                {s.label}
              </h4>
              <p className="text-[11px] font-cormorant italic text-[#755928] mt-1 line-clamp-2">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Simulation Altar Canvas */}
      <div className="royal-plaque p-8 sm:p-10 rounded-none relative">
        <div className="royal-corner royal-corner-tl" />
        <div className="royal-corner royal-corner-tr" />
        <div className="royal-corner royal-corner-bl" />
        <div className="royal-corner royal-corner-br" />

        <div className="py-6 text-center font-serif-royal min-h-[160px] flex items-center justify-center">
          {currentStage === 0 && (
            <div className="space-y-2">
              <span className="text-xs text-[#a88642] uppercase tracking-[0.25em] block">
                SIMULATION STANDBY
              </span>
              <p className="text-lg text-[#f2ebd9]">
                Click "[ RUN FULL SHIFT CYCLE ]" to observe an entire dinner service.
              </p>
            </div>
          )}

          {currentStage === 1 && (
            <div className="space-y-2">
              <span className="text-xs text-[#e6ca94] uppercase tracking-[0.25em] block">
                STAGE I: RECEPTION
              </span>
              <p className="text-base text-[#f2ebd9]">
                3 parties admitted to The Waiting Hall in priority sequence.
              </p>
            </div>
          )}

          {currentStage === 2 && (
            <div className="space-y-2">
              <span className="text-xs text-[#e6ca94] uppercase tracking-[0.25em] block">
                STAGE II: SALON ALLOCATION
              </span>
              <p className="text-base text-[#f2ebd9]">
                Best-fit min-heap seated guests at Table III, Table V, and Table I with 0 wasted seats.
              </p>
            </div>
          )}

          {currentStage === 3 && (
            <div className="space-y-2">
              <span className="text-xs text-[#e6ca94] uppercase tracking-[0.25em] block">
                STAGE III: DISPATCH
              </span>
              <p className="text-base text-[#f2ebd9]">
                Orders registered into linked list and synchronized with kitchen stations.
              </p>
            </div>
          )}

          {currentStage === 4 && (
            <div className="space-y-2">
              <span className="text-xs text-[#e6ca94] uppercase tracking-[0.25em] block">
                STAGE IV: PREPARATION
              </span>
              <p className="text-base text-[#f2ebd9]">
                The Grand Hearth and Wine Vault prepared the multi-course tasting menu.
              </p>
            </div>
          )}

          {currentStage === 5 && (
            <div className="space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#96b87d] mx-auto mb-2" />
              <span className="text-xs text-[#96b87d] uppercase tracking-[0.25em] block">
                STAGE V: CONCLUDED
              </span>
              <p className="text-base text-[#f2ebd9]">
                Dinner successfully concluded. All guests served with royal excellence.
              </p>
            </div>
          )}
        </div>

        {/* Live Chronicle Log */}
        <div className="pt-6 border-t border-[#3d2d14] space-y-2">
          <p className="text-[10px] font-serif-royal uppercase tracking-widest text-[#a88642]">
            CHRONICLE LOG
          </p>
          <div className="p-3 bg-[#070503] border border-[#3d2d14] max-h-32 overflow-y-auto space-y-1 font-mono text-xs text-[#c4b59d]">
            {chronicleLogs.map((log, i) => (
              <div key={i} className="flex space-x-2">
                <span className="text-[#a88642]">{log.time}</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
