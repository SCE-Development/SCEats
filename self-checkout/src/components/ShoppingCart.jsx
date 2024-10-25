import React, { useState, useEffect, useCallback } from 'react';
import CashSVG from '../assets/CashSVG';
import VenmoSVG from '../assets/VenmoSVG';

export default function ShoppingCart() {
  const [items, setItems] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('venmo')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`Payment method: ${selectedMethod}`)
    // Add confirm payment logic here
  }

  const addItem = useCallback((itemName) => {
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

  const buyItems = useCallback(() => {
    // display are you sure that's all you want to get?


    // go through each item in the shopping cart and access it to update and "buy" the item
    Object.keys(items).map( async (item) => {
      const result = await fetch(`http://localhost:8080/inventory/items/${items[item].name}`, {
        method: "PUT", 
        headers :{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          amount : items[item].quantity
        })
      })

      const jsonResult = await result.json()
      console.log(JSON.stringify(jsonResult))
    })



  }, [items])



  // const deleteItem = useCallback((itemName) => {
  //   setItems(prev => {
  //     const { [itemName]: _, ...rest } = prev;
  //     return rest;
  //   });
  // }, []);

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
    <div className="w-full px-3 h-[80vh] flex items-center gap-3">
      <div className="w-2/3 h-full rounded-lg flex flex-col items-center">
        <div className="w-full rounded-t-lg p-6 bg-primary text-center text-primary-content">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  {/* <button className="btn btn-square bg-red-400" onClick={() => deleteItem(item)}> */}
                  {/*   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> */}
                  {/*     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> */}
                  {/*   </svg> */}
                  {/* </button> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
          <button type="submit" className="btn btn-success text-2xl w-full p-6 my-3 h-auto rounded-lg" onClick={() => buyItems()}>
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
    </div>
  );
}
