import React, { useState, useEffect, useCallback } from 'react';

export default function ShoppingCart() {
  const [items, setItems] = useState({});
  const [currentInput, setCurrentInput] = useState('');

  const addItem = useCallback((itemName) => {
    console.log(items);
    if (itemName in items) {
      setItems(prev => ({
        ...prev, 
        [itemName]: {
          ...prev[itemName], 
          quantity: prev[itemName].quantity + 1
        }
      }));
    } else {
      const price = Number((Math.random() * 50 + 1).toFixed(2));
      setItems(prev => ({
        ...prev, 
        [itemName]: {
          name: itemName, 
          price: price, 
          quantity: 1
        }
      }));
    }
  }, [items]);

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

  const total = Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="w-full rounded-lg px-3 h-full max-h-[82vh] flex flex-col items-center">
      <div className="w-full rounded-t-lg p-6 bg-secondary text-center">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <p className="text-sm">Scan barcodes to add items</p>
      </div>

      <div className="flex-grow w-full px-3 pt-3 bg-base-200 overflow-y-auto">
        {Object.keys(items).map((item, index) => (
          <div key={index} className="mb-3 p-3 rounded-md shadow">
            <span className="font-medium">
              {items[item].name} 
              <br/> 
              <span className="text-sm text-muted">Quantity: {items[item].quantity}</span>
            </span>
            <span className="float-right text-success">${items[item].price.toFixed(2)}</span>
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
