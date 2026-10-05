import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewSection from './components/OverviewSection';
import TableManagement from './components/TableManagement';
import WaitingQueue from './components/WaitingQueue';
import OrderManagement from './components/OrderManagement';
import KitchenOperations from './components/KitchenOperations';
import SimulationEngine from './components/SimulationEngine';
import MetricsDisplay from './components/MetricsDisplay';

import {
  INITIAL_TABLES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_STATIONS,
  INITIAL_METRICS
} from './data/initialState';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [queue, setQueue] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [currentTime, setCurrentTime] = useState('');
  const [globalNotice, setGlobalNotice] = useState(null);

  // Royal clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSeatedNotification = (msg) => {
    setGlobalNotice(msg);
    // Update metrics: 1 more customer seated
    setMetrics(prev => ({
      ...prev,
      totalCustomersSeated: prev.totalCustomersSeated + 1,
    }));
    setTimeout(() => setGlobalNotice(null), 5000);
  };

  const handleSeatFromQueue = (customer) => {
    setActiveTab('tables');
  };

  const handleSimulationComplete = () => {
    setMetrics(prev => ({
      ...prev,
      totalCustomersArrived: prev.totalCustomersArrived + 3,
      totalCustomersSeated: prev.totalCustomersSeated + 3,
      totalOrdersPlaced: prev.totalOrdersPlaced + 3,
      totalOrdersCompleted: prev.totalOrdersCompleted + 3,
    }));
  };

  return (
    <div className="min-h-screen bg-[#060504] text-[#e8dfcf] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#9e7d3b]/40 selection:text-[#fff]">
      {/* Dark Aged Stone & Royal Treasury Atmospheric Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat filter blur-[3.5px] scale-105 opacity-25 brightness-75 contrast-125"
        style={{ backgroundImage: `url('/royal_treasury_reference.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#060504]/90 via-[#070605]/80 to-[#060504]/95" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,5,4,0.7)_100%)]" />

      {/* Main Structural Frame */}
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentTime={currentTime} 
        />

        {/* Global Royal Notice if active */}
        {globalNotice && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
            <div className="p-3 bg-[#171109] border border-[#d4af37] text-center font-serif-royal text-xs text-[#e6ca94] shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-fadeIn">
              {globalNotice}
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
          {activeTab === 'overview' && (
            <OverviewSection 
              tables={tables}
              queue={queue}
              orders={orders}
              stations={stations}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tables' && (
            <TableManagement 
              tables={tables}
              setTables={setTables}
              queue={queue}
              setQueue={setQueue}
              onSeatedNotification={handleSeatedNotification}
            />
          )}

          {activeTab === 'queue' && (
            <WaitingQueue 
              queue={queue}
              setQueue={setQueue}
              onSeatCustomer={(cust) => {
                setActiveTab('tables');
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagement 
              orders={orders}
              setOrders={setOrders}
            />
          )}

          {activeTab === 'kitchen' && (
            <KitchenOperations 
              stations={stations}
              setStations={setStations}
            />
          )}

          {activeTab === 'simulation' && (
            <SimulationEngine 
              onSimulationComplete={handleSimulationComplete}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricsDisplay 
              metrics={metrics}
              tables={tables}
              orders={orders}
            />
          )}
        </main>
      </div>

      {/* Royal Ancient Palace Footer */}
      <footer className="relative z-10 border-t-2 border-[#5a441e] bg-[#070503] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-serif-royal text-[#755928]">
          <div className="flex items-center space-x-3">
            <span className="text-base text-[#e6ca94] font-bold tracking-widest uppercase">
              L'OBSIDIENNE
            </span>
            <span className="text-[#5a441e]">❖</span>
            <span className="uppercase tracking-[0.2em] text-[10px]">
              HOUSE OF SERVICE · PALATIAL DINING CONTROL
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono text-[#a88642]">
            <span>C11 DSA CORE: <strong className="text-[#96b87d]">SOURCE OF TRUTH</strong></span>
            <span className="text-[#5a441e]">❖</span>
            <span>MIN-HEAP · ADJACENCY MATRIX · LINKED LIST · HASH TABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
