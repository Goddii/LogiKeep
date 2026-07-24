import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function AddItemForm({ isOpen, onClose, onAddProduct }) {
  const [activeTab, setActiveTab] = useState('api'); // 'api' or 'manual'
  
  // API Lookups / Import State
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState('');
  const [apiPrice, setApiPrice] = useState('');
  const [apiStock, setApiStock] = useState('');

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    product_name: '',
    brand: '',
    barcode: '',
    price: '',
    stock: '',
    ingredients_text: ''
  });

  if (!isOpen) return null;

  // Search OpenFoodFacts via local Flask backend endpoint
  const handleApiSearch = (e) => {
    e.preventDefault();
    if (!barcodeQuery.trim()) return;

    setApiError('');
    setApiResult(null);

    fetch(`http://127.0.0.1:5000/inventory/lookup?barcode=${barcodeQuery.trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found in OpenFoodFacts database.');
        return res.json();
      })
      .then((data) => {
        setApiResult(data);
      })
      .catch((err) => {
        setApiError(err.message || 'Failed to communicate with lookup service.');
      });
  };

  // Submit the Smart Import to POST /inventory/from-api
  const handleApiImportSubmit = (e) => {
    e.preventDefault();
    if (!apiPrice || !apiStock || !apiResult) return;

    // Convert decimal retail price to integer cents for Flask server logic
    const priceInCents = Math.round(parseFloat(apiPrice) * 100);

    fetch('http://127.0.0.1:5000/inventory/from-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barcode: apiResult.barcode,
        price: priceInCents,
        stock: parseInt(apiStock, 10)
      })
    })
      .then((res) => res.json())
      .then((data) => {
        onAddProduct(data.product);
        resetAndClose();
      })
      .catch((err) => console.error("Error importing product:", err));
  };

  // Submit standard manual creation form to POST /inventory
  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    const priceInCents = Math.round(parseFloat(manualForm.price) * 100);

    fetch('http://127.0.0.1:5000/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...manualForm,
        price: priceInCents,
        stock: parseInt(manualForm.stock, 10)
      })
    })
      .then((res) => res.json())
      .then((data) => {
        onAddProduct(data.product);
        resetAndClose();
      })
      .catch((err) => console.error("Error creating product manually:", err));
  };

  const resetAndClose = () => {
    setBarcodeQuery('');
    setApiResult(null);
    setApiError('');
    setApiPrice('');
    setApiStock('');
    setManualForm({ product_name: '', brand: '', barcode: '', price: '', stock: '', ingredients_text: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-white shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-bold tracking-wide text-slate-100 flex items-center gap-x-2">
            <SparklesIcon className="h-5 w-5 text-amber-500" /> New Inventory Item
          </h2>
          <button type="button" onClick={resetAndClose} className="text-slate-400 hover:text-white transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'api' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Smart API Import
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'manual' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Entry
          </button>
        </div>

        {/* Modal Scrollable Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB A: SMART API IMPORT WORKFLOW */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <form onSubmit={handleApiSearch} className="flex gap-x-2">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter item barcode (e.g., 3017624010701)"
                    value={barcodeQuery}
                    onChange={(e) => setBarcodeQuery(e.target.value)}
                    className="block w-full rounded-lg border-0 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                  Lookup
                </button>
              </form>

              {apiError && <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{apiError}</p>}

              {apiResult && (
                <form onSubmit={handleApiImportSubmit} className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Verified Product Found</span>
                    <h4 className="font-bold text-slate-200">{apiResult.product_name}</h4>
                    <p className="text-xs text-slate-400">{apiResult.brand || 'Unknown Brand'}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate mt-1">Ingredients: {apiResult.ingredients_text || 'None cataloged'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Retail Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="3.50"
                        value={apiPrice}
                        onChange={(e) => setApiPrice(e.target.value)}
                        className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Initial Stock Level</label>
                      <input
                        type="number"
                        required
                        placeholder="20"
                        value={apiStock}
                        onChange={(e) => setApiStock(e.target.value)}
                        className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-sm tracking-wide shadow transition-colors mt-2">
                    📥 Commit & Import to Store Inventory 
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB B: STANDARD MANUAL ENTRY FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={manualForm.product_name}
                  onChange={(e) => setManualForm({...manualForm, product_name: e.target.value})}
                  className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={manualForm.brand}
                    onChange={(e) => setManualForm({...manualForm, brand: e.target.value})}
                    className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Barcode</label>
                  <input
                    type="text"
                    value={manualForm.barcode}
                    onChange={(e) => setManualForm({...manualForm, barcode: e.target.value})}
                    className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualForm.price}
                    onChange={(e) => setManualForm({...manualForm, price: e.target.value})}
                    className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Initial Stock Level</label>
                  <input
                    type="number"
                    required
                    value={manualForm.stock}
                    onChange={(e) => setManualForm({...manualForm, stock: e.target.value})}
                    className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ingredients (Optional)</label>
                <textarea
                  rows={2}
                  value={manualForm.ingredients_text}
                  onChange={(e) => setManualForm({...manualForm, ingredients_text: e.target.value})}
                  className="block w-full rounded-lg border-0 bg-slate-950 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-sm tracking-wide shadow transition-colors pt-2">
                + Add Product Manually
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}