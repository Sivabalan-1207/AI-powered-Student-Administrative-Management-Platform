import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import type { StationeryProduct } from '../../types';
import { ShoppingBag, Search, ShoppingCart, CheckCircle2, Plus, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StationeryStorePageProps {
  onOpenCart: () => void;
  onNavigate: (page: string) => void;
}

export const StationeryStorePage: React.FC<StationeryStorePageProps> = ({ onOpenCart, onNavigate }) => {
  const [state, setState] = useState(store.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderedSuccessOrder, setOrderedSuccessOrder] = useState<any | null>(null);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const categories = ['All', 'Notebooks', 'Pens & Pencils', 'Lab Supplies', 'Drawing', 'Files & Folders', 'Printing'];

  const filteredProducts = state.stationeryProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product: StationeryProduct) => {
    store.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      storeType: 'stationery'
    });
  };

  const stationeryCartItems = state.cart.filter((i) => i.storeType === 'stationery');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Purple Accent Identity */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 font-bold text-xs mb-3 border border-purple-400/30">
              <ShoppingBag className="w-4 h-4 text-purple-300" />
              <span>Campus Digital Stationery Store</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Academic Supplies & Printing</h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl">
              Purchase lab record files, spiral notebooks, drawing kits, pens, and laser document printing with digital payment & QR pickup.
            </p>
          </div>

          <button
            onClick={onOpenCart}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Stationery Cart ({stationeryCartItems.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Order Success Banner */}
      {orderedSuccessOrder && (
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-3xl text-purple-950 space-y-4 animate-in fade-in shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-extrabold text-lg text-purple-900">
              <CheckCircle2 className="w-7 h-7 text-purple-600" />
              <span>Stationery Order Confirmed! ({orderedSuccessOrder.orderNumber})</span>
            </div>
            <button
              onClick={() => setOrderedSuccessOrder(null)}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Close Notice
            </button>
          </div>

          <div className="text-xs text-purple-800 leading-relaxed">
            Your payment was verified. Show the QR code at the stationery counter for collection.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('my-orders')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>View Order QR Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notebooks, pens, lab records..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const inCart = stationeryCartItems.find((i) => i.productId === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{prod.name}</h3>
                    <span className="text-base font-extrabold text-purple-700">₹{prod.price}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-400">
                  Stock: <span className={prod.stock > 0 ? 'text-purple-600' : 'text-red-500'}>{prod.stock} units</span>
                </div>

                {prod.isAvailable && prod.stock > 0 ? (
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{inCart ? `Add (${inCart.quantity})` : 'Add to Cart'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-400 font-bold text-xs rounded-lg">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
