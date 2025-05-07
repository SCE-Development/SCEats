import { ArrowLeft, AlertCircle } from "lucide-react";

interface ItemNotFoundModalProps {
  sku: string;
  onClose: () => void;
}

const ItemNotFoundModal = ({ sku, onClose }: ItemNotFoundModalProps) => {
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
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Item Not Found</h2>
        </div>

        <div className="relative flex flex-col items-center space-y-8">
          {/* Error Display */}
          <div className="bg-sky-900/30 p-6 rounded-2xl border border-sky-500/30 w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <span className="text-2xl font-bold text-white">SKU: {sku}</span>
            </div>
            <p className="text-white/70 text-center">This item was not found in the inventory.</p>
          </div>

          {/* Instructions */}
          <div className="bg-sky-900/30 p-6 rounded-2xl border border-sky-500/30 w-full">
            <h3 className="text-xl font-semibold text-white/90 mb-4">What to do:</h3>
            <ol className="space-y-3 text-white/70">
              <li className="flex items-start">
                <span className="bg-sky-500/20 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 text-sky-300">1</span>
                <span>Check if the SKU was scanned correctly</span>
              </li>
              <li className="flex items-start">
                <span className="bg-sky-500/20 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 text-sky-300">2</span>
                <span>Try scanning the item again</span>
              </li>
              <li className="flex items-start">
                <span className="bg-sky-500/20 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 text-sky-300">3</span>
                <span>If the problem persists, contact an SCE officer</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600 group-hover:from-sky-600 group-hover:to-sky-700 rounded-2xl transition-all duration-300" />
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemNotFoundModal;
