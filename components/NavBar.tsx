import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${
      isActive
        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-40 flex items-center gap-1 px-6 py-2 bg-white dark:bg-[#000000] border-b border-gray-100 dark:border-white/5 shadow-sm">
      <NavLink to="/leads" className={linkClass}>Leads</NavLink>
      <NavLink to="/activities" className={linkClass}>Activities</NavLink>
      <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
    </nav>
  );
};

export default NavBar;
