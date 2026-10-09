import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { store } from '../services/store';
import type { CampusOrder } from '../types';
import { QrCode, Camera, CheckCircle2, XCircle, AlertTriangle, X, PackageCheck, ShoppingBag, Utensils } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    order?: CampusOrder;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize html5-qrcode scanner inside element
    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        handleProcessQR(decodedText);
        scanner.clear();
      },
      (error) => {
        // quiet ignore scan frame errors
      }
    );

    return () => {
      scanner.clear().catch((e) => console.warn('Failed to clear scanner:', e));
    };
  }, [isOpen]);

  const handleProcessQR = (qrString: string) => {
    const result = store.validateAndCollectOrder(qrString);
    setScanResult(result);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <QrCode className="w-5 h-5 text-teal-400" />
            <span>Campus Order QR Collection Scanner</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Result Banner if Scanned */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm mb-1">{scanResult.message}</div>
                  {scanResult.order && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                      <div>• **Customer:** {scanResult.order.userName} ({scanResult.order.userRole.toUpperCase()})</div>
                      <div>• **Store:** {scanResult.order.storeType.toUpperCase()}</div>
                      <div>• **Items ({scanResult.order.items.length}):** {scanResult.order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                      <div>• **Total Paid:** ₹{scanResult.order.total} ({scanResult.order.paymentMethod})</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Camera Scanner Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                Live Camera QR Scanner
              </span>
              <span className="text-[10px] text-slate-400">Position receipt in frame</span>
            </div>
            
            <div id="qr-reader-container" className="w-full rounded-lg overflow-hidden border border-slate-200 bg-black min-h-[220px]" />
          </div>

          {/* Manual Input Fallback */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Or Enter Order Number / Token Manually:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. ORD-FDC-88401 or token-fdc-99201"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                onClick={() => handleProcessQR(manualCode)}
                disabled={!manualCode.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Validate QR
              </button>
            </div>

            {/* Quick Demo Scan Buttons */}
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-semibold">Quick Demo Scan:</span>
              <button
                onClick={() => {
                  setManualCode('ORD-FDC-88401');
                  handleProcessQR('ORD-FDC-88401');
                }}
                className="px-2 py-1 rounded bg-teal-50 text-teal-700 font-mono hover:bg-teal-100 border border-teal-200"
              >
                Food Court Order
              </button>
              <button
                onClick={() => {
                  setManualCode('ORD-STN-30112');
                  handleProcessQR('ORD-STN-30112');
                }}
                className="px-2 py-1 rounded bg-purple-50 text-purple-700 font-mono hover:bg-purple-100 border border-purple-200"
              >
                Stationery Order
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
