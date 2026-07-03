import React from 'react';
import ProductCard from './ProductCard'; // Assuming ProductCard is in the same folder

export default function ProductGrid({ items, searchTerm, activeFilter, sortBy, onUpdateStock }) {
  
  // 1. Filter items based on the search input box text
  const searchedItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.product_name?.toLowerCase().includes(term) ||
      item.brand?.toLowerCase().includes(term) ||
      item.barcode?.includes(term)
    );
  });

  // 2. Filter items based on the active toolbar pill selection (ALL, OUT, LOW, OK)
  const filteredItems = searchedItems.filter((item) => {
    if (activeFilter === 'OUT') return item.stock === 0;
    if (activeFilter === 'LOW') return item.stock > 0 && item.stock < 15;
    if (activeFilter === 'OK') return item.stock >= 15;
    return true; // 'ALL'
  });

  // 3. Sort items based on the selected dropdown menu configuration
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return a.product_name.localeCompare(b.product_name);
    }
    if (sortBy === 'stock-asc') {
      return a.stock - b.stock;
    }
    if (sortBy === 'stock-desc') {
      return b.stock - a.stock;
    }
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div>
      {/* Empty State: Shows up if no products match the current filters */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
          <p className="text-sm text-slate-500">No products found matching your criteria.</p>
        </div>
      ) : (
        /* The Responsive Grid Container (1 column on mobile, 2 on tablets, 3 on desktop layouts) */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              onUpdateStock={onUpdateStock} 
            />
          ))}
        </div>
      )}
    </div>
  );
}