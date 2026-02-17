
import React from 'react';
import { Lead } from '../types';

interface HeaderProps {
  leads: Lead[];
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ leads, isDarkMode, toggleTheme }) => {
  const today = new Date().toISOString().split('T')[0];
  const newToday = leads.filter(l => l.email_received_at.split('T')[0] === today).length;
  const unprocessed = leads.filter(l => !l.processed).length;
  const openLeads = leads.filter(l => l.status === 'Open').length;
  
  return (
    <header className="sticky top-0 z-50 h-[90px] flex items-center justify-between px-10 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-16">
        <h1 className="text-4xl font-black tracking-[0.2em] text-gray-900 dark:text-white flex items-center select-none">
          <span className="bg-amber-500 text-white px-5 py-1.5 rounded-lg shadow-xl shadow-amber-500/20">LEADS</span>
        </h1>
        
        <div className="hidden xl:flex items-center gap-6">
          <KPIDisplay label="Today" value={newToday} color="amber" />
          <KPIDisplay label="Pending" value={unprocessed} color="rose" />
          <KPIDisplay label="Open" value={openLeads} color="emerald" />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all border border-gray-200 dark:border-white/10 group shadow-sm"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          )}
        </button>
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-amber-500/30 ring-4 ring-amber-500/10 cursor-pointer hover:scale-105 transition-transform">
          JD
        </div>
      </div>
    </header>
  );
};

const KPIDisplay: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colorMap: Record<string, string> = {
    amber: 'border-amber-500/20 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400',
    rose: 'border-rose-500/20 bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400',
    emerald: 'border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400',
  };

  return (
    <div className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl border ${colorMap[color]} text-[12px] font-black tracking-tight uppercase transition-all hover:-translate-y-1 shadow-sm`}>
      <span className="opacity-60">{label}</span>
      <span className="text-xl tabular-nums">{value}</span>
    </div>
  );
};

export default Header;
