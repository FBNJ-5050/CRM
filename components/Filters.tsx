
import React, { useState, useRef, useEffect } from 'react';
import { Status, ProposalStatus, State } from '../types';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  stateFilter: State | 'All';
  setStateFilter: (val: State | 'All') => void;
  statusFilter: Status | 'All';
  setStatusFilter: (val: Status | 'All') => void;
  proposalFilter: ProposalStatus | 'All';
  setProposalFilter: (val: any) => void;
  dateRange: { start: string; end: string };
  setDateRange: (val: { start: string; end: string }) => void;
  unprocessedOnly: boolean;
  setUnprocessedOnly: (val: boolean) => void;
}

const CalendarPicker: React.FC<{ 
  onSelect: (date: string) => void; 
  onClose: () => void; 
  initialDate?: string;
}> = ({ onSelect, onClose, initialDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate || Date.now()));
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' }).toUpperCase();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isSelected = (day: number) => {
    if (!initialDate) return false;
    const d = new Date(initialDate);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  return (
    <div ref={calendarRef} className="absolute top-full mt-3 right-0 lg:left-0 z-[1000] bg-white dark:bg-[#111111] p-8 rounded-[30px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/10 w-[320px] animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[24px] font-black text-amber-500 tracking-tight pl-1">{monthName}</h3>
          <div className="flex gap-4">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 text-gray-400 hover:text-amber-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 text-gray-400 hover:text-amber-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center gap-y-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <span key={d} className="text-[13px] font-black text-gray-300 py-3 tracking-tighter">{d}</span>
          ))}
          {days.map((day, idx) => (
            <div key={idx} className="h-10 flex items-center justify-center">
              {day && (
                <button 
                  onClick={() => {
                    const selected = new Date(year, month, day);
                    onSelect(selected.toISOString().split('T')[0]);
                    onClose();
                  }}
                  className={`w-9 h-9 rounded-full text-[15px] font-bold transition-all flex items-center justify-center ${isSelected(day) ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/30' : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Filters: React.FC<FiltersProps> = ({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  stateFilter, setStateFilter,
  dateRange, setDateRange,
  unprocessedOnly, setUnprocessedOnly
}) => {
  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);

  const formatDateLabel = (date: string) => {
    if (!date) return 'MM/DD/YYYY';
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6 w-full py-4 px-2">
      {/* Left: Search Bar */}
      <div className="flex justify-start w-full">
        <div className="w-full max-w-[450px] relative group">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text"
            placeholder="Search leads, names, or project titles..."
            className="w-full pl-14 pr-6 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-black transition-all text-sm font-bold shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Center: Selectors Group */}
      <div className="flex justify-center items-center gap-4">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="select-ios min-w-[160px] px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-amber-500 text-[11px] font-black uppercase tracking-[0.12em] cursor-pointer shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Pending">Pending</option>
          <option value="Lost">Lost</option>
          <option value="Sold">Sold</option>
          <option value="No Opportunity">No Opportunity</option>
        </select>

        <select 
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as any)}
          className="select-ios min-w-[130px] px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-amber-500 text-[11px] font-black uppercase tracking-[0.12em] cursor-pointer shadow-sm"
        >
          <option value="All">All States</option>
          <option value="NJ">New Jersey</option>
          <option value="NY">New York</option>
          <option value="PA">Pennsylvania</option>
          <option value="CT">Connecticut</option>
        </select>
      </div>

      {/* Right: Date and Action Group */}
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-inner">
           <div className="relative">
              <button 
                onClick={() => setActivePicker(activePicker === 'start' ? null : 'start')}
                className={`px-5 py-1.5 rounded-xl text-xs font-black tabular-nums transition-all ${dateRange.start ? 'bg-white dark:bg-black text-black dark:text-white shadow-md' : 'text-gray-400'}`}
              >
                {formatDateLabel(dateRange.start)}
              </button>
              {activePicker === 'start' && (
                <CalendarPicker 
                  initialDate={dateRange.start} 
                  onSelect={(d) => setDateRange({ ...dateRange, start: d })} 
                  onClose={() => setActivePicker(null)} 
                />
              )}
           </div>
           
           <span className="text-[10px] font-black text-amber-500/50">TO</span>
           
           <div className="relative">
              <button 
                onClick={() => setActivePicker(activePicker === 'end' ? null : 'end')}
                className={`px-5 py-1.5 rounded-xl text-xs font-black tabular-nums transition-all ${dateRange.end ? 'bg-white dark:bg-black text-black dark:text-white shadow-md' : 'text-gray-400'}`}
              >
                {formatDateLabel(dateRange.end)}
              </button>
              {activePicker === 'end' && (
                <CalendarPicker 
                  initialDate={dateRange.end} 
                  onSelect={(d) => setDateRange({ ...dateRange, end: d })} 
                  onClose={() => setActivePicker(null)} 
                />
              )}
           </div>
        </div>

        <button 
          onClick={() => setUnprocessedOnly(!unprocessedOnly)}
          className={`px-8 py-3.5 rounded-2xl border text-[11px] font-black uppercase tracking-[0.15em] transition-all shadow-sm ${unprocessedOnly ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:text-amber-500 hover:border-amber-500/40'}`}
        >
          Unprocessed
        </button>

        <button 
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('All');
            setStateFilter('All');
            setDateRange({ start: '', end: '' });
            setUnprocessedOnly(false);
          }}
          className="p-3.5 text-gray-300 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-2xl"
          title="Clear Filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Filters;
