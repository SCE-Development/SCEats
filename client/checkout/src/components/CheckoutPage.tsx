import { useState } from "react"
import { CreditCard, QrCode } from "lucide-react"

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "venmo" | null>(null)


  return (
    <>
      <div className="flex justify-between mx-7 mt-4 space-x-3">
        {/* Checkout Box */}
        <div className="relative rounded-4xl border-3 border-sky-600 p-80 text-white w-1/2 space-x-5">
          <div className="absolute top-5 left-5 text-4xl font-bold">
            Order Summary
          </div>
        </div>

        {/* Payment Box */}
        <div className="relative rounded-4xl border-3 border-sky-600 p-70 text-white w-1/2">
          <div className="absolute top-5 left-5 text-4xl font-bold">
            Payment

            <div className="flex flex-col space-y-4 p-10">
              <button
                className={`flex flex-col items-center justify-center rounded-3xl p-4 h-40 w-105 border-3 ${
                  paymentMethod === "cash" ? "border-sky-600" : "border-gray-600"
                } bg-transparent text-white hover:bg-sky-800 hover:text-white transition-colors`}
                onClick={() => setPaymentMethod("cash")}
                >
                <CreditCard className="h-16 w-16 mb-4" />
                <span className="text-2xl">Cash</span>
              </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;