
import React, { useState, useEffect, useMemo } from 'react';
import { Lead, SortState, Density, ColumnConfig, Status, State } from '../types';
import { MOCK_LEADS } from '../mockData';
import Header from '../components/Header';
import Filters from '../components/Filters';
import LeadTable from '../components/LeadTable';
import ColumnManager from '../components/ColumnManager';
import BulkActionBar from '../components/BulkActionBar';


const DEFAULT_COLUMNS: ColumnConfig[] = [
    { key: 'email_received_at', label: 'Received', visible: true, pinned: true },
    { key: 'opportunity_title', label: 'Opportunity Title', visible: true, pinned: true },
    { key: 'contact_display_name', label: 'Contact Name', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'created_by', label: 'Created By', visible: false },
    { key: 'contact_first_name', label: 'First Name', visible: false },
    { key: 'contact_last_name', label: 'Last Name', visible: false },
    { key: 'street_address', label: 'Street Address', visible: true },
    { key: 'city', label: 'City', visible: true },
    { key: 'state', label: 'State', visible: true },
    { key: 'zip', label: 'Zip', visible: true },
    { key: 'street_address_contact', label: 'Street Address (Contact)', visible: false },
    { key: 'city_contact', label: 'City (Contact)', visible: false },
    { key: 'state_contact', label: 'State (Contact)', visible: false },
    { key: 'zip_contact', label: 'Zip (Contact)', visible: false },
    { key: 'salesperson', label: 'Salesperson', visible: true },
    { key: 'source', label: 'Source', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'cell', label: 'Cell', visible: false },
    { key: 'email', label: 'Email', visible: true },
    { key: 'general_notes', label: 'General Notes', visible: false },
    { key: 'tag', label: 'Tag', visible: true },
    { key: 'project_type', label: 'Project Type', visible: true },
    { key: 'estimated_revenue_start', label: 'Est. Revenue Start', visible: false },
    { key: 'estimated_revenue_end', label: 'Est. Revenue End', visible: false },
    { key: 'sewer_service', label: 'Sewer Service', visible: false },
    { key: 'wish_list', label: 'Wish List', visible: false },
    { key: 'basement_sq_ft', label: 'Basement Sq ft', visible: false },
    { key: 'basement_status', label: 'Basement Status', visible: false },
    { key: 'appointment_type', label: 'Appointment Type', visible: false },
    { key: 'hoa', label: 'HOA', visible: false },
    { key: 'gas_service', label: 'Gas Service', visible: false },
    { key: 'design_type', label: 'Design Type', visible: false },
    { key: 'selected_services', label: 'Selected Services', visible: false },
    { key: 'project_budget', label: 'Project Budget', visible: true },
    { key: 'home_age', label: 'Home Age', visible: false },
    { key: 'home_sq_ft', label: 'Home Sq ft', visible: false },
    { key: 'home_style', label: 'Home Style', visible: false },
    { key: 'water_service', label: 'Water Service', visible: false },
    { key: 'second_egress', label: 'Second Egress', visible: false },
    { key: 'proposal_status', label: 'Proposal Status', visible: true },
    { key: 'processed', label: 'Processed', visible: true },
];

const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [density, setDensity] = useState<Density>(() => (localStorage.getItem('density') as Density) || 'Comfortable');
    const [visibleColumns, setVisibleColumns] = useState<ColumnConfig[]>(() => {
        const saved = localStorage.getItem('columns');
        return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    });
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
    const [stateFilter, setStateFilter] = useState<State | 'All'>('All');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [unprocessedOnly, setUnprocessedOnly] = useState(false);
    const [sort, setSort] = useState<SortState>({ column: 'email_received_at', direction: 'desc' });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('density', density);
    }, [density]);

    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const togglePin = (key: keyof Lead) => {
        setVisibleColumns(prev => prev.map(col =>
            col.key === key ? { ...col, pinned: !col.pinned } : col
        ));
    };

    const filteredLeads = useMemo(() => {
        let result = [...leads];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(l =>
                l.opportunity_title.toLowerCase().includes(q) ||
                l.contact_display_name.toLowerCase().includes(q) ||
                l.email?.toLowerCase().includes(q) ||
                l.phone?.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'All') result = result.filter(l => l.status === statusFilter);
        if (stateFilter !== 'All') result = result.filter(l => l.state === stateFilter);
        if (unprocessedOnly) result = result.filter(l => !l.processed);

        if (dateRange.start) result = result.filter(l => new Date(l.email_received_at) >= new Date(dateRange.start));
        if (dateRange.end) result = result.filter(l => new Date(l.email_received_at) <= new Date(dateRange.end + 'T23:59:59'));

        result.sort((a, b) => {
            const valA = a[sort.column];
            const valB = b[sort.column];
            if (valA === undefined || valB === undefined) return 0;
            if (sort.direction === 'asc') return valA > valB ? 1 : -1;
            if (sort.direction === 'desc') return valA < valB ? 1 : -1;
            return 0;
        });

        return result;
    }, [leads, searchQuery, statusFilter, stateFilter, unprocessedOnly, dateRange, sort]);

    return (
        <div className="h-screen bg-[#fdfdfd] text-[#1a1a1a] dark:bg-[#000000] dark:text-gray-100 flex flex-col overflow-hidden">
            <Header leads={leads} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />

            <div className="bg-white dark:bg-[#000000] px-6 py-2 border-b border-gray-100 dark:border-white/5 flex items-center shadow-sm z-[200]">
                <Filters
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    stateFilter={stateFilter} setStateFilter={setStateFilter}
                    dateRange={dateRange} setDateRange={setDateRange}
                    unprocessedOnly={unprocessedOnly} setUnprocessedOnly={setUnprocessedOnly}
                    proposalFilter="All" setProposalFilter={() => { }}
                />
            </div>

            <main className="flex-1 flex flex-col min-h-0">
                <div className="px-6 py-3 flex items-center justify-between bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[18px] font-black tabular-nums tracking-tighter leading-none">{filteredLeads.length}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Results</span>
                        </div>
                        <div className="flex gap-1">
                            <SortBtn active={sort.column === 'email_received_at' && sort.direction === 'desc'} onClick={() => setSort({ column: 'email_received_at', direction: 'desc' })}>Newest</SortBtn>
                            <SortBtn active={sort.column === 'email_received_at' && sort.direction === 'asc'} onClick={() => setSort({ column: 'email_received_at', direction: 'asc' })}>Oldest</SortBtn>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-200/50 dark:bg-white/10 p-1 rounded-lg border border-gray-200 dark:border-white/10">
                            <DensityBtn active={density === 'Comfortable'} onClick={() => setDensity('Comfortable')}>Comfortable</DensityBtn>
                            <DensityBtn active={density === 'Compact'} onClick={() => setDensity('Compact')}>Compact</DensityBtn>
                        </div>
                        <ColumnManager columns={visibleColumns} setColumns={setVisibleColumns} defaultColumns={DEFAULT_COLUMNS} />
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-white dark:bg-[#000000] relative shadow-inner">
                    <LeadTable
                        leads={filteredLeads}
                        columns={visibleColumns}
                        isLoading={isLoading}
                        density={density}
                        sort={sort}
                        setSort={setSort}
                        selectedLeadIds={selectedLeadIds}
                        setSelectedLeadIds={setSelectedLeadIds}
                        togglePin={togglePin}
                    />
                </div>

                {selectedLeadIds.size > 0 && (
                    <BulkActionBar count={selectedLeadIds.size} onAction={(a) => {
                        setLeads(prev => prev.map(l => {
                            if (!selectedLeadIds.has(l.id)) return l;
                            if (a === 'mark-processed') return { ...l, processed: true };
                            if (a === 'mark-unprocessed') return { ...l, processed: false };
                            if (a === 'proposal-sent') return { ...l, proposal_status: 'Sent' };
                            return l;
                        }));
                        setSelectedLeadIds(new Set());
                    }} onClear={() => setSelectedLeadIds(new Set())} />
                )}
            </main>
        </div>
    );
};

const SortBtn = ({ children, active, onClick }: any) => (
    <button onClick={onClick} className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-all ${active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{children}</button>
);

const DensityBtn = ({ children, active, onClick }: any) => (
    <button onClick={onClick} className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-all ${active ? 'bg-white dark:bg-[#000000] text-amber-500 shadow-md' : 'text-gray-400'}`}>{children}</button>
);

export default LeadsPage;
