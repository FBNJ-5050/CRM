
import React, { useMemo } from 'react';
import { Lead, ColumnConfig, Density, SortState } from '../types';

interface LeadTableProps {
  leads: Lead[];
  columns: ColumnConfig[];
  isLoading: boolean;
  density: Density;
  sort: SortState;
  setSort: (val: SortState) => void;
  selectedLeadIds: Set<string>;
  setSelectedLeadIds: (val: Set<string>) => void;
  togglePin: (key: keyof Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads, columns, isLoading, density, sort, setSort, selectedLeadIds, setSelectedLeadIds, togglePin
}) => {
  const CHECKBOX_WIDTH = 50;
  
  // Dynamic visible columns
  const visibleCols = useMemo(() => columns.filter(c => c.visible), [columns]);
  
  // Calculate dynamic left offsets for pinned columns
  const columnOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentOffset = CHECKBOX_WIDTH;
    
    visibleCols.forEach(col => {
      if (col.pinned) {
        offsets[col.key] = currentOffset;
        let w = 180;
        if (col.key === 'email_received_at') w = 135;
        if (col.key === 'opportunity_title') w = 300;
        currentOffset += w;
      }
    });
    return offsets;
  }, [visibleCols]);

  const toggleSort = (key: keyof Lead) => {
    let newDirection: 'asc' | 'desc' | null = 'asc';
    if (sort.column === key) {
      if (sort.direction === 'asc') newDirection = 'desc';
      else if (sort.direction === 'desc') newDirection = null;
    }
    setSort({ column: key, direction: newDirection });
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedLeadIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedLeadIds(newSelected);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-8 space-y-4 animate-pulse bg-white dark:bg-[#000000]">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex gap-4"><div className="w-8 h-8 bg-gray-100 dark:bg-white/10 rounded"></div><div className="flex-1 h-8 bg-gray-50 dark:bg-white/5 rounded"></div></div>
        ))}
      </div>
    );
  }

  const paddingY = density === 'Compact' ? 'py-2.5' : 'py-5';
  const fontSize = density === 'Compact' ? 'text-[11px]' : 'text-[13px]';
  const headerHeight = density === 'Compact' ? 'h-11' : 'h-14';

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar bg-white dark:bg-[#000000]">
      <table className="w-full min-w-max border-separate border-spacing-0">
        <thead className="sticky top-0 z-[100]">
          <tr className={`${headerHeight} bg-white dark:bg-[#000000]`}>
            <th className="sticky left-0 z-[150] px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#000000]" style={{ width: CHECKBOX_WIDTH }}>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 accent-amber-500 cursor-pointer"
                checked={leads.length > 0 && selectedLeadIds.size === leads.length}
                onChange={() => {
                   if (selectedLeadIds.size === leads.length) setSelectedLeadIds(new Set());
                   else setSelectedLeadIds(new Set(leads.map(l => l.id)));
                }}
              />
            </th>

            {visibleCols.map(col => {
              const isPinned = !!col.pinned;
              const leftOffset = columnOffsets[col.key];
              const isLastPinned = isPinned && !visibleCols.some((c, idx) => idx > visibleCols.indexOf(col) && c.pinned);

              return (
                <th 
                  key={col.key} 
                  className={`${isPinned ? 'sticky z-[150]' : 'z-[100]'} px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#000000] text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-amber-500 transition-colors ${isLastPinned ? 'pinned-shadow' : ''}`}
                  style={{ 
                    left: isPinned ? leftOffset : 'auto', 
                    minWidth: col.key === 'email_received_at' ? '135px' : col.key === 'opportunity_title' ? '300px' : '180px' 
                  }}
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center justify-between group/header">
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sort.column === col.key && <span className="text-amber-500">{sort.direction === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); togglePin(col.key); }}
                      className={`ml-2 p-1 rounded hover:bg-amber-500/10 transition-colors ${isPinned ? 'text-amber-500' : 'text-gray-300 opacity-0 group-hover/header:opacity-100'}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 00-2 2v1h14v-1a2 2 0 00-2-2zM10 15v4a1 1 0 102 0v-4" />
                      </svg>
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className={`group transition-colors hover:bg-amber-50/40 dark:hover:bg-amber-500/5 ${selectedLeadIds.has(lead.id) ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-white dark:bg-[#000000]'}`} onClick={(e) => toggleRow(lead.id, e)}>
              <td className="sticky left-0 z-[50] px-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#000000] group-hover:bg-[#fefce8] dark:group-hover:bg-[#111111]" style={{ width: CHECKBOX_WIDTH }}>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 accent-amber-500" checked={selectedLeadIds.has(lead.id)} readOnly />
              </td>

              {visibleCols.map(col => {
                const isPinned = !!col.pinned;
                const leftOffset = columnOffsets[col.key];
                const isLastPinned = isPinned && !visibleCols.some((c, idx) => idx > visibleCols.indexOf(col) && c.pinned);

                return (
                  <td 
                    key={col.key} 
                    className={`${isPinned ? 'sticky z-[50]' : ''} px-4 border-b border-gray-100 dark:border-white/5 transition-colors group-hover:bg-[#fefce8] dark:group-hover:bg-[#111111] bg-white dark:bg-[#000000] ${isPinned ? 'z-[50]' : 'z-0'} ${isLastPinned ? 'pinned-shadow' : ''}`}
                    style={{ left: isPinned ? leftOffset : 'auto' }}
                  >
                    {renderCell(lead, col.key, fontSize, paddingY)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCell = (lead: Lead, key: keyof Lead, fontSize: string, paddingY: string) => {
  const value = lead[key];
  
  if (key === 'opportunity_title' || key === 'contact_display_name') {
    return (
      <div className={`flex flex-col ${paddingY} min-w-0 pr-8`}>
        <span className={`${fontSize} font-black text-amber-600 dark:text-amber-500 truncate gold-glow uppercase tracking-tight`}>
          {value?.toString()}
        </span>
      </div>
    );
  }

  if (key === 'email_received_at') {
    return (
      <div className={`flex items-center gap-2 ${fontSize} font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-tight`}>
        {!lead.processed && <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
        {new Date(value as string).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    );
  }

  if (key === 'status') {
    const statusStyles: Record<string, string> = {
      'Open': 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5',
      'In Progress': 'text-blue-600 border-blue-500/30 bg-blue-500/5',
      'On Hold': 'text-amber-600 border-amber-500/30 bg-amber-500/5',
      'Pending': 'text-amber-500 border-amber-500/20 bg-amber-500/5',
      'Lost': 'text-gray-400 border-gray-500/30',
      'Sold': 'text-indigo-600 border-indigo-500/30 bg-indigo-500/5',
      'No Opportunity': 'text-rose-600 border-rose-500/30 bg-rose-500/5',
    };
    return <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${statusStyles[value as string] || 'text-gray-400 border-gray-200 dark:border-white/10'}`}>{value as string}</span>;
  }
  
  if (key === 'proposal_status') return <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-colors ${value === 'Sent' ? 'text-amber-500 border-amber-500/40 bg-amber-500/5' : 'text-gray-400 border-gray-500/10 dark:border-white/5'}`}>{value as string}</span>;
  if (key === 'processed') return <div className={`w-3 h-3 rounded-sm border ${value ? 'bg-emerald-500 border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-transparent border-gray-300 dark:border-white/20'}`}></div>;
  if (key === 'email') return <span className="text-gray-400 dark:text-gray-500 font-bold hover:text-amber-500 transition-colors truncate max-w-[150px] inline-block">{value as string}</span>;
  if (key === 'phone' || key === 'cell') return <span className="text-gray-600 dark:text-gray-400 tabular-nums font-bold tracking-tight">{value as string}</span>;
  if (key === 'project_budget') return <span className="text-amber-600 dark:text-amber-500 font-black tabular-nums">{value as string}</span>;
  
  return <span className="text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[180px] inline-block">{value?.toString() || '--'}</span>;
};

export default LeadTable;
