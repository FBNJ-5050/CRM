
import React, { useState } from 'react';
import { ColumnConfig } from '../types';

interface ColumnManagerProps {
  columns: ColumnConfig[];
  setColumns: (cols: ColumnConfig[]) => void;
  defaultColumns: ColumnConfig[];
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ columns, setColumns, defaultColumns }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = (key: string) => {
    const updated = columns.map(c => 
      c.key === key ? { ...c, visible: !c.visible } : c
    );
    setColumns(updated);
  };

  const applyPreset = (type: 'default' | 'all') => {
    if (type === 'default') setColumns(defaultColumns);
    else setColumns(columns.map(c => ({ ...c, visible: true })));
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-amber-500 transition-colors shadow-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        Columns
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#000000] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 p-4 max-h-[70vh] flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Display Options</h3>
            <div className="flex gap-2 mb-4">
               <button onClick={() => applyPreset('default')} className="flex-1 text-[10px] font-bold uppercase py-1.5 rounded bg-gray-100 dark:bg-white/10 hover:bg-amber-500 hover:text-white transition-colors">Default View</button>
               <button onClick={() => applyPreset('all')} className="flex-1 text-[10px] font-bold uppercase py-1.5 rounded bg-gray-100 dark:bg-white/10 hover:bg-amber-500 hover:text-white transition-colors">Show All</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {columns.map((col) => (
                <label key={col.key} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${col.visible ? 'bg-amber-500 border-amber-500' : 'border-gray-300 dark:border-white/20'}`}>
                    {col.visible && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={col.visible} onChange={() => toggleColumn(col.key)} />
                  <span className={`text-xs ${col.visible ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>{col.label}</span>
                  {col.pinned && (
                    <svg className="w-3.5 h-3.5 ml-auto text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 00-2 2v1h14v-1a2 2 0 00-2-2zM10 15v4a1 1 0 102 0v-4" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColumnManager;
