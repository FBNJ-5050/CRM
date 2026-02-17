
import React from 'react';

interface BulkActionBarProps {
  count: number;
  onAction: (action: string) => void;
  onClear: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onAction, onClear }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300">
      <div className="bg-white dark:bg-[#000000] border border-amber-500/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
            {count}
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">Selected</span>
        </div>
        <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
        <div className="flex items-center gap-2">
          <button onClick={() => onAction('mark-processed')} className="px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Process</button>
          <button onClick={() => onAction('proposal-sent')} className="px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Proposal Sent</button>
          <button onClick={() => onAction('mark-unprocessed')} className="px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-rose-500">Reset</button>
        </div>
        <button onClick={onClear} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
