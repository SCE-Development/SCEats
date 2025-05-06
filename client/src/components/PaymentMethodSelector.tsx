import { DollarSign, QrCode } from "lucide-react";

interface PaymentMethodSelectorProps {
  enabled: boolean;
  setShowCashModal: (show: boolean) => void;
  setShowVenmoModal: (show: boolean) => void;
}

const PaymentMethodSelector = ({
  enabled,
  setShowCashModal,
  setShowVenmoModal
}: PaymentMethodSelectorProps) => {
  return (
    <div className="relative rounded-4xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border-2 border-sky-500/30 p-8 text-white w-full lg:w-1/2 flex flex-col h-[calc(100vh-10rem)] backdrop-blur-sm shadow-[0_0_25px_rgba(56,189,248,0.1)] overflow-hidden">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent mb-6">Payment Method</h2>
      
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center justify-center flex-grow space-y-8">
          {/* Payment method buttons */}
          <div className="flex flex-col items-center space-y-16">
            <button
              disabled={!enabled}
              className={`group relative flex flex-col items-center justify-center rounded-3xl p-8 w-96 border transition-all duration-100 border-sky-500/30 bg-sky-900/20 hover:bg-sky-900/30 ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setShowCashModal(true)}
            >
              <DollarSign className="h-20 w-20 mb-4 text-sky-400" />
              <span className="text-3xl font-medium text-sky-400">Cash</span>
            </button>
            <button
              disabled={!enabled}
              className={`group relative flex flex-col items-center justify-center rounded-3xl p-8 w-96 border transition-all duration-100 border-sky-500/30 bg-sky-900/20 hover:bg-sky-900/30 ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setShowVenmoModal(true)}
            >
              <QrCode className="h-20 w-20 mb-4 text-sky-400" />
              <span className="text-3xl font-medium text-sky-400">Venmo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector; 