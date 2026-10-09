import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { UtensilsCrossed, QrCode, Plus, CheckCircle2, Edit2, PackageCheck } from 'lucide-react';

interface FoodCourtStaffPageProps {
  onOpenQRScanner: () => void;
}

export const FoodCourtStaffPage: React.FC<FoodCourtStaffPageProps> = ({ onOpenQRScanner }) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const foodProducts = state.foodProducts;
  const foodOrders = state.orders.filter((o) => o.storeType === 'food');

  const handleUpdateStock = (productId: string, currentStock: number) => {
    const input = prompt('Enter new stock quantity:', currentStock.toString());
    if (input !== null) {
      const newQty = parseInt(input, 10);
      if (!isNaN(newQty)) {
        store.updateFoodProductStock(productId, newQty, newQty > 0);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-200 font-bold text-xs mb-3 border border-teal-400/30">
            <UtensilsCrossed className="w-4 h-4 text-teal-300" />
            <span>Food Court Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold">Food Court Staff Counter & Menu Management</h1>
          <p className="text-teal-100 text-xs mt-1">
            Validate single-use QR receipts, manage menu items, update stock quantities, and mark order collection.
          </p>
        </div>

        <button
          onClick={onOpenQRScanner}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <QrCode className="w-5 h-5" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* Menu Inventory Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Food Menu & Stock Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodProducts.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                <span className="font-extrabold text-teal-700">₹{p.price}</span>
              </div>

              <div className="text-[11px] text-slate-500">Category: {p.category} • Prep: {p.preparationTimeMinutes} min</div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Stock: <span className={p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>{p.stock}</span></span>

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

      {/* Food Orders Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Recent Food Orders ({foodOrders.length})</h2>

        <div className="space-y-3">
          {foodOrders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{ord.orderNumber} • {ord.userName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Items: {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full font-extrabold uppercase text-[10px] ${
                  ord.orderStatus === 'collected' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
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
