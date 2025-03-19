const CheckoutPage = () => {
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;