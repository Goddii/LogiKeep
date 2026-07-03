import React from 'react';
import { XCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function StatsStrip({ items = [] }) {
  // Compute counts dynamically based on your LogiKeep inventory data array
  const outOfStock = items.filter(i => i.stock === 0).length;
  const lowStock = items.filter(i => i.stock > 0 && i.stock < 15).length;
  const fullySupplied = items.filter(i => i.stock >= 15).length;

  const stats = [
    { name: 'OUT OF STOCK', value: outOfStock, icon: XCircleIcon, textClass: 'text-red-500', bgClass: 'bg-red-500/10', borderClass: 'border-red-500/20' },
    { name: 'LOW STOCK', value: lowStock, icon: ExclamationTriangleIcon, textClass: 'text-amber-500', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20' },
    { name: 'FULLY SUPPLIED', value: fullySupplied, icon: CheckCircleIcon, textClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className={`relative overflow-hidden rounded-xl border ${stat.borderClass} bg-slate-900/60 p-5 flex items-center gap-x-4 shadow-sm`}
        >
          <div className={`p-3 rounded-lg ${stat.bgClass}`}>
            <stat.icon className={`h-6 w-6 ${stat.textClass}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}