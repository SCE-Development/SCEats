import React, { useState } from 'react';
import CashSVG from '../assets/CashSVG';
import VenmoSVG from '../assets/VenmoSVG';

export default function PaymentPanel({ items, setItems }) {
  const [selectedMethod, setSelectedMethod] = useState('venmo')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`Payment method: ${selectedMethod}`)
    console.log(`Buying items...`)
    // Add confirm payment logic here
    // setItems({})
  }

  const total = Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="w-1/3 h-full rounded-lg flex flex-col items-center bg-base-200 p-3">
      <div className="w-full flex justify-center h-[25vh] items-center text-center rounded-lg">
        <span className="text-4xl font-bold text-success">Total:
          <br />
          <span className="text-7xl font-bold text-success">${total.toFixed(2)}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex-grow p-3 font-bold rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl w-full text-center pb-3">Select Payment Method:</h2>
        <div className="w-full items-center grid grid-cols-2 gap-3">
          <label className={`cursor-pointer flex items-center text-center flex-col p-3 rounded-lg btn-ghost shadow ${selectedMethod === "venmo" ? "btn-active" : ""}`}>
            <input
              type="radio"
              onChange={() => setSelectedMethod("venmo")}
              value="venmo"
              checked={selectedMethod === 'venmo'}
              className="hidden"
              id="venmo"
            />
            <VenmoSVG />
            <span className="text-2xl font-bold mt-3">Venmo</span>
          </label>

          <label className={`cursor-pointer flex items-center text-center flex-col p-3 rounded-lg btn-ghost shadow ${selectedMethod === "cash" ? "btn-active" : ""}`}>
            <input
              type="radio"
              onChange={() => setSelectedMethod("cash")}
              value="cash"
              checked={selectedMethod === 'cash'}
              className="hidden"
              id="cash"
            />
            <CashSVG />
            <span className="text-2xl font-bold mt-3">Cash</span>
          </label>
        </div>
        <button type="submit" className="btn btn-success text-2xl w-full p-6 my-3 h-auto rounded-lg">
          Confirm Purchase
        </button>
      </form>

      <div className="w-full p-6 font-bold rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl w-full text-center">Coupon Code:</h2>
        <div className="w-full flex-grow flex items-center justify-center">
          <div className="flex items-center justify-center flex-col h-auto">
            <h2 className="text-2xl w-full text-center">None</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
