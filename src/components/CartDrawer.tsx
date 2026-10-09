import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, UtensilsCrossed, ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [state, setState] = useState(store.getState());
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'demo_upi' | 'demo_card'>('razorpay');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  if (!isOpen) return null;

  const cart = state.cart;
  const foodItems = cart.filter((i) => i.storeType === 'food');
  const stationeryItems = cart.filter((i) => i.storeType === 'stationery');

  const foodSubtotal = foodItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const stationerySubtotal = stationeryItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleCheckoutStore = (storeType: 'food' | 'stationery') => {
    setIsCheckingOut(true);
    setErrorMsg('');

    setTimeout(() => {
      try {
        const order = store.placeOrder(storeType, paymentMethod);
        setIsCheckingOut(false);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onClose();
        onNavigate('my-orders');
      } catch (e: any) {
        setIsCheckingOut(false);
        setErrorMsg(e.message || 'Checkout failed.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShoppingCart className="w-5 h-5 text-teal-400" />
            <span>Campus Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-800 text-xs font-bold border-b border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Cart Items Scroll */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Food Court Cart Section */}
          {foodItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-xs text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                  Food Court Order
                </span>
                <span className="text-xs font-bold text-slate-900">₹{(foodSubtotal * 1.05).toFixed(1)}</span>
              </div>

              {foodItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-slate-500">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg border border-slate-200">
                      <button
                        onClick={() => store.updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => store.updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => store.updateCartQuantity(item.productId, 0)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleCheckoutStore('food')}
                disabled={isCheckingOut}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{(foodSubtotal * 1.05).toFixed(1)} & Get Food QR</span>
              </button>
            </div>
          )}

          {/* Stationery Cart Section */}
          {stationeryItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-xs text-purple-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  Stationery Order
                </span>
                <span className="text-xs font-bold text-slate-900">₹{(stationerySubtotal * 1.05).toFixed(1)}</span>
              </div>

              {stationeryItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-slate-500">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg border border-slate-200">
                      <button
                        onClick={() => store.updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => store.updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => store.updateCartQuantity(item.productId, 0)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleCheckoutStore('stationery')}
                disabled={isCheckingOut}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{(stationerySubtotal * 1.05).toFixed(1)} & Get Stationery QR</span>
              </button>
            </div>
          )}

          {cart.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              Your cart is empty.
            </div>
          )}

        </div>

        {/* Footer Payment Selector */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="text-[11px] font-bold text-slate-600">Select Payment Gateway:</div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-2 rounded-lg font-bold border transition-colors ${
                  paymentMethod === 'razorpay' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                }`}
              >
                Razorpay
              </button>
              <button
                onClick={() => setPaymentMethod('demo_upi')}
                className={`p-2 rounded-lg font-bold border transition-colors ${
                  paymentMethod === 'demo_upi' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                }`}
              >
                Demo UPI
              </button>
              <button
                onClick={() => setPaymentMethod('demo_card')}
                className={`p-2 rounded-lg font-bold border transition-colors ${
                  paymentMethod === 'demo_card' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                }`}
              >
                Demo Card
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
