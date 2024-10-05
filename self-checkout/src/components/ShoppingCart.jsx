import React, { useState, useEffect, useCallback } from 'react';

export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  const addItem = useCallback((itemName) => {
    const price = Number((Math.random() * 50 + 1).toFixed(2));
    setItems(prevItems => [...prevItems, { name: itemName, price }]);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && currentInput.trim() !== '') {
      addItem(currentInput.trim());
      setCurrentInput('');
    } else if (event.key.length === 1) {
      setCurrentInput(prev => prev + event.key);
    }
  }, [currentInput, addItem]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full rounded-lg px-3 h-full max-h-[82vh] flex flex-col items-center">
      <div className="w-full rounded-t-lg p-6 bg-secondary text-center">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <p className="text-sm">Scan barcodes to add items</p>
      </div>

      <div className="flex-grow w-full px-3 pt-3 bg-base-200 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="mb-3 p-3 rounded-md shadow">
            <span className="font-medium">{item.name}</span>
            <span className="float-right text-success">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="w-full px-6 pb-6 pt-3 bg-base-200 rounded-b-lg">
        <div className="flex justify-center items-center">
          <span className="text-2xl font-bold text-success">Total: ${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
