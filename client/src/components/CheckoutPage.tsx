import { useState, useEffect, useCallback } from "react";
import OrderSummary from "./OrderSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import VenmoModal from "./modals/VenmoModal";
import CashModal from "./modals/CashModal";

import { Item } from "./Item";

const CheckoutPage = () => {
  // State
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [sku, setSku] = useState<string>("");
  
  // Modals
  const [showVenmoModal, setShowVenmoModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);

  // Function to add item by SKU, wrapped in useCallback
  const addItemBySku = useCallback((skuCode: string) => {
    
    // TODO: Check if item exists in database
    // TODO: If item exists, increment quantity

    setItems(prevItems => {
      const newItems = new Map(prevItems);
      
      if (newItems.has(skuCode)) {
        // If item exists, increment quantity
        const existingItem = newItems.get(skuCode)!;
        newItems.set(skuCode, {
          ...existingItem,
          quantity: existingItem.quantity + 1
        });
      } else {
        // If new item, create it
        const itemName = `Item ${skuCode}`;
        const randomPrice = Math.floor(Math.random() * 20) + 5;
        
        newItems.set(skuCode, {
          sku: skuCode,
          name: itemName,
          quantity: 1,
          price: randomPrice
        });
      }
      
      return newItems;
    });
  }, []);

  // Add keyboard event listener for SKU input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if not in an input field
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        // If key is Enter and we have a SKU, add the item
        if (e.key === 'Enter' && sku.length > 0) {
          addItemBySku(sku);
          setSku("");
          return;
        }
        
        else if (e.key.length === 1 && /^[a-z0-9]+$/i.test(e.key)) {
          setSku(prev => prev + e.key);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sku, addItemBySku]);

  // Functions
  const calculateTotal = () => {
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const handleQuantityChange = (sku: string, change: number) => {
    setItems(prevItems => {
      const newItems = new Map(prevItems);
      const item = newItems.get(sku);
      
      if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
          newItems.set(sku, { ...item, quantity: newQuantity });
        } else {
          newItems.delete(sku);
        }
      }
      
      return newItems;
    });
  };

  const handleDeleteItem = (sku: string) => {
    setItems(prevItems => {
      const newItems = new Map(prevItems);
      newItems.delete(sku);
      return newItems;
    });
  };

  const handleCheckoutComplete = () => {
    setItems(new Map());
    setShowCashModal(false);
    setShowVenmoModal(false);
    setSku("");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between mx-7 mt-32 space-y-3 lg:space-y-0 lg:space-x-7 items-start min-h-[calc(100vh-10rem)]">
        <img 
          src="/image/SCE-glow.png" 
          alt="SCE Logo" 
          className="absolute top-0 left-0 h-24 w-auto ml-6 mt-4 animate-pulse-subtle"
        />
        
        {/* SKU Display - show current input */}
        <div className="fixed top-4 right-4 z-50">
          {sku ? (
            <div className="bg-sky-900/80 text-white px-4 py-2 rounded-xl font-mono text-lg border border-sky-500/50">
              SKU: {sku}
            </div>
          ) : (
            <div className="bg-gray-900/40 text-white/80 px-4 py-2 rounded-xl text-sm border border-white/20">
              Scan the barcode to add item
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <OrderSummary
          items={Array.from(items.values())}
          calculateTotal={calculateTotal}
          onQuantityChange={handleQuantityChange}
          onDeleteItem={handleDeleteItem}
        />

        {/* Payment Method Selector */}
        <PaymentMethodSelector
          enabled={items.size > 0}
          setShowCashModal={setShowCashModal}
          setShowVenmoModal={setShowVenmoModal}
        />
      </div>

      {/* Modals */}
      
      {showVenmoModal && (
        <VenmoModal
          totalAmount={calculateTotal()}
          onClose={() => setShowVenmoModal(false)}
          onComplete={handleCheckoutComplete}
        />
      )}

      {showCashModal && (
        <CashModal
          totalAmount={calculateTotal()}
          onClose={() => setShowCashModal(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </>
  );
};

export default CheckoutPage;