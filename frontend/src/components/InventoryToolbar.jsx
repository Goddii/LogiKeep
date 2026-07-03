import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function InventoryToolbar({ searchTerm, setSearchTerm, activeFilter, setActiveFilter, sortBy, setSortBy, totalCounts }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
      
      {/* Search Input Box */}
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, brand, barcode..."
          className="block w-full rounded-lg border-0 bg-slate-900 py-2 pl-10 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex items-center gap-x-1.5 overflow-x-auto p-0.5 bg-slate-950 rounded-lg border border-slate-800">
        {[
          { id: 'ALL', label: 'ALL', count: totalCounts.all || 0 },
          { id: 'OUT', label: 'OUT', count: totalCounts.out || 0},
          { id: 'LOW', label: 'LOW', count: totalCounts.low || 0},
          { id: 'OK', label: 'OK', count: totalCounts.ok  || 0},
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`inline-flex items-center gap-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label} <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Configuration Select Menu */}
      <div className="flex items-center gap-x-2">
        <label htmlFor="sort" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border-0 bg-slate-900 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-300 focus:ring-2 focus:ring-amber-500"
        >
          <option value="name">NAME</option>
          <option value="stock-asc">STOCK: LOW TO HIGH</option>
          <option value="stock-desc">STOCK: HIGH TO LOW</option>
          <option value="price">PRICE</option>
        </select>
      </div>

    </div>
  );
}