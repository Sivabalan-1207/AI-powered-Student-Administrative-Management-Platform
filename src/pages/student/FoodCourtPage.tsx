import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import type { FoodProduct } from '../../types';
import { UtensilsCrossed, Search, ShoppingBag, ShoppingCart, Clock, CheckCircle2, AlertTriangle, Plus, Minus, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodCourtPageProps {
  onOpenCart: () => void;
  onNavigate: (page: string) => void;
}

export const FoodCourtPage: React.FC<FoodCourtPageProps> = ({ onOpenCart, onNavigate }) => {
  const [state, setState] = useState(store.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderedSuccessOrder, setOrderedSuccessOrder] = useState<any | null>(null);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const categories = ['All', 'Breakfast', 'Meals', 'Snacks', 'Beverages', 'Bakery', 'Specials'];

  const filteredProducts = state.foodProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product: FoodProduct) => {
    store.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      storeType: 'food'
    });
  };

  const handleQuickCheckout = () => {
    try {
      const order = store.placeOrder('food', 'razorpay');
      setOrderedSuccessOrder(order);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e: any) {
      alert(e.message || 'Checkout failed');
    }
  };

  const foodCartItems = state.cart.filter((i) => i.storeType === 'food');
  const cartSubtotal = foodCartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Green Accent Visual Identity */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 font-bold text-xs mb-3 border border-emerald-400/30">
              <UtensilsCrossed className="w-4 h-4 text-emerald-300" />
              <span>Campus Digital Food Court</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Fresh Dining & Meals</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              Order fresh meals, breakfast combos, beverages, and bakery items with digital payment and single-use QR counter collection.
            </p>
          </div>

          <button
            onClick={onOpenCart}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Food Cart ({foodCartItems.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Order Success Popup */}
      {orderedSuccessOrder && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-emerald-950 space-y-4 animate-in fade-in shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-extrabold text-lg text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              <span>Food Court Order Confirmed! ({orderedSuccessOrder.orderNumber})</span>
            </div>
            <button
              onClick={() => setOrderedSuccessOrder(null)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Close Notice
            </button>
          </div>

          <div className="text-xs text-emerald-800 leading-relaxed">
            Your payment was verified. Show the QR code below at the dining counter to collect your order.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('my-orders')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>View Order QR Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food items..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Food Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const inCart = foodCartItems.find((i) => i.productId === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>

                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {prod.preparationTimeMinutes} min
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{prod.name}</h3>
                    <span className="text-base font-extrabold text-emerald-700">₹{prod.price}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-400">
                  Stock: <span className={prod.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>{prod.stock} left</span>
                </div>

                {prod.isAvailable && prod.stock > 0 ? (
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{inCart ? `Add (${inCart.quantity})` : 'Add to Cart'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-400 font-bold text-xs rounded-lg">
                    Sold Out
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
