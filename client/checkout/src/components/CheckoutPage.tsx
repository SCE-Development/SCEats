import { useState } from "react"
import { CreditCard, QrCode } from "lucide-react"

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "venmo" | null>(null)

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between mx-7 mt-4 space-y-3 lg:space-y-0 lg:space-x-3">
        {/* Checkout Box */}
        <div className="relative rounded-4xl border-3 border-sky-600 p-8 text-white w-full lg:w-1/2">
          <div className="absolute top-5 left-5 text-4xl font-bold">
            Order Summary
          </div>
        </div>

        {/* Payment Box */}
        <div className="relative rounded-4xl border-3 border-sky-600 p-8 text-white w-full lg:w-1/2">
          <div className="absolute top-5 left-5 text-4xl font-bold">
            Payment
          </div>
          <div className="flex flex-col items-center space-y-4 p-10">
            <button
              className={`flex flex-col items-center justify-center rounded-3xl p-4 h-32 w-40 md:h-40 md:w-48 lg:h-48 lg:w-64 border-3 ${
                paymentMethod === "cash" ? "border-sky-600" : "border-gray-600"
              } bg-transparent text-white hover:bg-sky-800 hover:text-white transition-colors`}
              onClick={() => setPaymentMethod("cash")}
            >
              <CreditCard className="h-12 w-12 mb-4 md:h-16 md:w-16 lg:h-20 lg:w-20" />
              <span className="text-xl md:text-2xl lg:text-3xl">Cash</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center rounded-3xl p-4 h-32 w-60 md:h-40 md:w-100 lg:h-48 lg:w-100 border-3 ${
                paymentMethod === "venmo" ? "border-sky-600" : "border-gray-600"
              } bg-transparent text-white hover:bg-sky-800 hover:text-white transition-colors`}
              onClick={() => setPaymentMethod("venmo")}
            >
              <QrCode className="h-12 w-12 mb-4 md:h-16 md:w-16 lg:h-20 lg:w-20" />
              <span className="text-xl md:text-2xl lg:text-3xl">Venmo</span>
            </button>
          </div>
          {paymentMethod && (
            <div className="flex justify-center mt-6">
              <button className="relative inline-flex items-center justify-center px-10 py-2.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-transparent border-2 border-sky-500 hover: border-gradient-to-br from-cyan-500 to-blue-500">
                <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-400 border-t-3 border-gray-500 group-hover:w-full ease"></span>
                <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-400 border-b-3 border-gray-500 group-hover:w-full ease"></span>
                <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-300 bg-gray-500 group-hover:h-full ease"></span>
                <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-300 bg-gray-500 group-hover:h-full ease"></span>
                <span className="absolute inset-0 w-full h-full duration-300 delay-430 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100"></span>
                <span className="relative z-10 transition-all duration-300 group-hover:text-white">Continue with {paymentMethod === "cash" ? "Cash" : "Venmo"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;