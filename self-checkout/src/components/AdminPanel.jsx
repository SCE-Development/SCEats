import React from 'react';

export default function AdminPanel({ items, setItems }) {
  const total = Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = Object.values(items).reduce((acc, item) => acc + item.quantity, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`Adding items...`)
    // Add logic to add items to database here
    // setItems({})
  }

  return (
    <div className="w-1/3 h-full rounded-lg flex flex-col items-center bg-base-200 p-3">
      <div className="w-full flex flex-col justify-center h-[55vh] items-center text-center rounded-lg">
        <span className="text-4xl font-bold text-success">Total Value:
          <br />
          <span className="text-7xl font-bold text-success">${total.toFixed(2)}</span>
        </span>
        <br />
        <span className="text-4xl font-bold text-success">Quantity:
          <br />
          <span className="text-7xl font-bold text-success">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex-grow p-3 font-bold rounded-lg flex flex-col items-center justify-center">
        <button type="submit" className="btn btn-success text-2xl w-full p-6 my-3 h-auto rounded-lg">
          Add Items
        </button>
      </form>

    </div>
  );
}
