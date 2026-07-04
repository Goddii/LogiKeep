import React from 'react';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProductDetailsModal({ item, onClose }) {
  if (!item) return null;

  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock < 15;

  const statusConfig = isOutOfStock
    ? { badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'OUT OF STOCK' }
    : isLowStock
    ? { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'LOW STOCK' }
    : { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'FULLY SUPPLIED' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-5">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-lg font-bold text-slate-100 truncate" title={item.product_name}>
              {item.product_name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{item.brand || 'Unknown Brand'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider border uppercase ${statusConfig.badge}`}>
            {statusConfig.label}
          </span>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Price</span>
              <span className="text-base font-semibold text-slate-200">
                ${(item.price / 100).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Stock</span>
              <span className="text-base font-semibold text-slate-200">{item.stock} units</span>
            </div>
          </div>

          <div className="flex items-center gap-x-2 text-slate-500 border-t border-slate-800/60 pt-4">
            <ShoppingBagIcon className="h-4 w-4 text-slate-600" />
            <div>
              <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-600 leading-none">Barcode</span>
              <span className="text-xs font-mono text-slate-400 block mt-0.5">{item.barcode || 'N/A'}</span>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4">
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Ingredients</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {item.ingredients_text || 'No ingredient data available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}