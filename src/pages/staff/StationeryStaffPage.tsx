import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { ShoppingBag, QrCode, Edit2 } from 'lucide-react';

interface StationeryStaffPageProps {
  onOpenQRScanner: () => void;
}

export const StationeryStaffPage: React.FC<StationeryStaffPageProps> = ({ onOpenQRScanner }) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const stationeryProducts = state.stationeryProducts;
  const stationeryOrders = state.orders.filter((o) => o.storeType === 'stationery');

  const handleUpdateStock = (productId: string, currentStock: number) => {
    const input = prompt('Enter new stock quantity:', currentStock.toString());
    if (input !== null) {
      const newQty = parseInt(input, 10);
      if (!isNaN(newQty)) {
        store.updateStationeryProductStock(productId, newQty, newQty > 0);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 font-bold text-xs mb-3 border border-purple-400/30">
            <ShoppingBag className="w-4 h-4 text-purple-300" />
            <span>Stationery Store Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold">Stationery Hub Inventory & Fulfilment</h1>
          <p className="text-purple-100 text-xs mt-1">
            Manage stationery stock, update prices, and validate customer QR collection receipts.
          </p>
        </div>

        <button
          onClick={onOpenQRScanner}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <QrCode className="w-5 h-5 text-purple-200" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* Products Inventory Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Stationery Product Inventory Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stationeryProducts.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                <span className="font-extrabold text-purple-700">₹{p.price}</span>
              </div>

              <div className="text-[11px] text-slate-500">Category: {p.category}</div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Stock: <span className={p.stock > 0 ? 'text-purple-600' : 'text-red-500'}>{p.stock} units</span></span>

                <button
                  onClick={() => handleUpdateStock(p.id, p.stock)}
                  className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-lg flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Update Stock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Recent Stationery Orders ({stationeryOrders.length})</h2>

        <div className="space-y-3">
          {stationeryOrders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{ord.orderNumber} • {ord.userName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Items: {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full font-extrabold uppercase text-[10px] ${
                  ord.orderStatus === 'collected' ? 'bg-slate-200 text-slate-700' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {ord.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
