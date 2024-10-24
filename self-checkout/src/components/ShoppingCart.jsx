import React, { useState, useEffect, useCallback } from 'react';
import PaymentPanel from './PaymentPanel';
import AdminPanel from './AdminPanel';

export default function ShoppingCart() {
  const [items, setItems] = useState({})
  const [currentInput, setCurrentInput] = useState('')
  const [mode, setMode] = useState('buyMode')

  const addItem = useCallback((itemName) => {
    if (itemName === "buyMode") {
      setMode("buyMode")
    }
    else if (itemName === "addMode") {
      setMode("addMode")
    }
    else if (itemName in items) {
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
  }, [items, mode]);

  const increaseQuantity = useCallback((itemName) => {
    setItems(prev => ({
      ...prev,
      [itemName]: {
        ...prev[itemName],
        quantity: prev[itemName].quantity + 1
      }
    }));
  }, []);

  const decreaseQuantity = useCallback((itemName) => {
    setItems(prev => {
      if (prev[itemName].quantity > 1) {
        return {
          ...prev,
          [itemName]: {
            ...prev[itemName],
            quantity: prev[itemName].quantity - 1
          }
        };
      } else {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      }
    });
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

  return (
    <div className="w-full px-3 h-[80vh] flex items-center gap-3">
      <div className="w-2/3 h-full rounded-lg flex flex-col items-center">
        <div className="w-full rounded-t-lg p-6 bg-primary text-center text-primary-content">
          <h2 className="text-2xl font-bold">
            {mode === "buyMode" ? "Shopping Cart" : "Admin Restock"}
          </h2>
        </div>
        <div className="flex-grow w-full px-3 pt-3 bg-base-200 overflow-y-auto rounded-b-lg">
          {Object.keys(items).length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-2xl">Scan barcodes to add items.</h2>
            </div>
          ) : (
            Object.keys(items).map((item, index) => (
              <div key={index} className="mb-3 p-6 rounded-md shadow flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{items[item].name}
                    <br />
                    <span className="text-xl text-success">${items[item].price.toFixed(2)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-square shadow" onClick={() => decreaseQuantity(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <button className="btn btn-square text-xl shadow-none">{items[item].quantity}</button>
                  <button className="btn btn-square shadow" onClick={() => increaseQuantity(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {mode === "buyMode" ? (
        <PaymentPanel
          items={items}
          setItems={setItems}
        />
      ) : (
        <AdminPanel
          items={items}
          setItems={setItems}
        />
      )
      }
    </div>
  );
}
