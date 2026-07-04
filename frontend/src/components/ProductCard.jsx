import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ item, onUpdateStock, onViewDetails }) {
  // Determine stock configuration indicators based on the backend data parameters
  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock < 15;

  // Custom status configuration mapping directly to your Figma layout colors
  const statusConfig = isOutOfStock
    ? { 
        border: 'border-l-red-500', 
        badge: 'bg-red-500/10 text-red-400 border-red-500/20', 
        label: 'OUT OF STOCK' 
      }
    : isLowStock
    ? { 
        border: 'border-l-amber-500', 
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', 
        label: 'LOW STOCK' 
      }
    : { 
        border: 'border-l-emerald-500', 
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
        label: 'FULLY SUPPLIED' 
      };

  return (
    <div className={`bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 border-l-4 ${statusConfig.border} flex flex-col justify-between text-white shadow-md backdrop-blur-sm transition-all hover:border-slate-700/80`}>
      <div>
        {/* Header Row: Title, Brand & Status Badge */}
        <div className="flex justify-between items-start gap-x-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-100 truncate tracking-wide" title={item.product_name}>
              {item.product_name}
            </h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{item.brand || 'Unknown Brand'}</p>
          </div>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider border uppercase shrink-0 ${statusConfig.badge}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Info Grid: Price & Category */}
        <div className="mt-5 grid grid-cols-2 gap-x-4 border-b border-slate-800/50 pb-4">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Price</span>
            {/* Formats cents from API (e.g., 350 -> $3.50) to strict retail standards */}
            <span className="text-base font-semibold text-slate-200">
              ${(item.price / 100).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Category</span>
            <span className="text-sm font-medium text-slate-300 mt-0.5 block truncate">
              {item.category || 'General'}
            </span>
          </div>
        </div>
        
        {/* Barcode Display */}
        <div className="mt-4 flex items-center gap-x-2 text-slate-500">
          <ShoppingBagIcon className="h-4 w-4 text-slate-600" />
          <div className="flex-1 min-w-0">
            <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-600 leading-none">Barcode</span>
            <span className="text-xs font-mono text-slate-400 block truncate mt-0.5">{item.barcode || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Footer Row: Interactive Counter Controls & Details Trigger */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div>
          <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5">Stock</span>
          <div className="inline-flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800/80 shadow-inner">
            <button 
              type="button"
              disabled={isOutOfStock} 
              onClick={() => onUpdateStock(item.id, item.stock - 1)}
              className="px-2.5 py-0.5 text-slate-400 hover:text-red-400 disabled:opacity-20 disabled:hover:text-slate-400 font-bold transition-colors select-none text-sm"
            >
              −
            </button>
            <span className="text-xs font-bold w-6 text-center text-slate-200 tabular-nums">
              {item.stock}
            </span>
            <button 
              type="button"
              onClick={() => onUpdateStock(item.id, item.stock + 1)}
              className="px-2.5 py-0.5 text-slate-400 hover:text-emerald-400 font-bold transition-colors select-none text-sm"
            >
              +
            </button>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={() => onViewDetails(item)}
          className="text-[11px] font-bold text-slate-400 hover:text-amber-400 tracking-wider transition-colors uppercase mt-auto flex items-center gap-x-1"
        >
          Details <span>→</span>
        </button>
      </div>
    </div>
  );
}