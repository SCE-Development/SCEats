import { ArrowLeft, Check, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

interface VenmoModalProps {
  totalAmount: number;
  onClose: () => void;
  onComplete: () => void;
}

const VenmoModal = ({ totalAmount, onClose, onComplete }: VenmoModalProps) => {
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center">
      <div 
        className="bg-gradient-to-br from-gray-900/90 to-gray-900/80 rounded-3xl p-8 w-[36rem] shadow-2xl transform transition-all duration-500 animate-fade-in border border-sky-500/20 relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-x"></div>
        
        {/* Back Button */}
        <button
          onClick={onClose}
          className="group absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 z-50"
        >
          <div className="relative p-2 rounded-full bg-sky-900/50 group-hover:bg-sky-800/50 transition-all duration-300">
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </div>
        </button>
        
        <div className="relative mb-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Scan to Pay with Venmo</h2>
        </div>

        <div className="relative flex flex-col items-center space-y-8">
          {/* Amount Display */}
          <div className="bg-sky-900/30 p-4 rounded-2xl border border-sky-500/30 w-full">
            <p className="text-white/70 text-lg mb-2">Amount Due:</p>
            <div className="flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-sky-400 mr-2" />
              <span className="text-4xl font-bold text-white">{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white/5 p-6 rounded-2xl border border-sky-500/30 transform transition-all duration-300 overflow-hidden shadow-xl shadow-sky-500/10">
            <img 
              src={`${import.meta.env.BASE_URL}/image/venmoQR.png`}
              alt="Venmo QR Code" 
              className="w-84 h-84 scale-100 transform-gpu"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            disabled={countdown > 0}
            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={onComplete}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${countdown > 0 ? 'from-gray-500 to-gray-600' : 'from-sky-500 to-sky-600 group-hover:from-sky-600 group-hover:to-sky-700'} rounded-2xl transition-all duration-300`} />
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {countdown > 0 ? (
                <span>{countdown}s</span>
              ) : (
                <>
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Done
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenmoModal; 