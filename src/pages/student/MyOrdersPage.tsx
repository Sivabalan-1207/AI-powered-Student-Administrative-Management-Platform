import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { store } from '../../services/store';
import type { CampusOrder } from '../../types';
import { ShoppingCart, QrCode, CheckCircle2, UtensilsCrossed, ShoppingBag, X } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const [selectedQRModalOrder, setSelectedQRModalOrder] = useState<CampusOrder | null>(null);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const user = state.currentUser;
  const myOrders = state.orders.filter((o) => o.userId === user.id);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-teal-600" />
            <span>My Campus Orders & QR Collection Receipts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display your single-use QR receipts at the Food Court or Stationery Store counters for collection.
          </p>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
          No active campus orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-900">{ord.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ord.storeType === 'food' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {ord.storeType === 'food' ? 'Food Court' : 'Stationery Hub'}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ord.orderStatus === 'collected'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-500 text-white animate-pulse'
                    }`}
                  >
                    {ord.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-semibold">
                  Items ({ord.items.length}): {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="text-[11px] text-slate-400">
                  Ordered on {new Date(ord.createdAt).toLocaleString()} • Transaction Ref: {ord.transactionRef}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 shrink-0 justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">Total Paid:</div>
                  <div className="text-xl font-extrabold text-slate-900">₹{ord.total}</div>
                </div>

                <button
                  onClick={() => setSelectedQRModalOrder(ord)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-teal-400" />
                  <span>View QR Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Receipt Modal */}
      {selectedQRModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden text-center animate-in fade-in zoom-in-95">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Single-Use Collection Receipt</span>
              </div>
              <button
                onClick={() => setSelectedQRModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="font-mono text-sm font-extrabold text-slate-900">
                {selectedQRModalOrder.orderNumber}
              </div>

              {/* Render SVG QR Code */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
                <QRCodeSVG
                  value={selectedQRModalOrder.qrCodeData}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                Present this QR code at the counter for instant staff scanning & verification.
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Token: {selectedQRModalOrder.qrToken}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
