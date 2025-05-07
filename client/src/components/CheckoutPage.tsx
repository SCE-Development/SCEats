import { useState, useEffect, useCallback } from "react";
import OrderSummary from "./OrderSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import VenmoModal from "./modals/VenmoModal";
import CashModal from "./modals/CashModal";
import ItemNotFoundModal from "./modals/ItemNotFoundModal";

import { Item } from "./Item";

const CheckoutPage = () => {
  // State
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [sku, setSku] = useState<string>("");
  const [notFoundSku, setNotFoundSku] = useState<string>("");
  
  // Modals
  const [showVenmoModal, setShowVenmoModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showItemNotFoundModal, setShowItemNotFoundModal] = useState(false);

  // Function to add item by SKU, wrapped in useCallback
  const addItemBySku = useCallback((skuCode: string) => {
    // If item already exists, increment quantity
    if (items.has(skuCode)) {
      setItems(prev => {
        const newItems = new Map(prev);
        const item = newItems.get(skuCode)!;
        newItems.set(skuCode, { ...item, quantity: item.quantity + 1 });
        return newItems;
      });
      return;
    }

    // Add item if it exists in the database
    fetch(`${import.meta.env.BASE_URL}api/v1/inventory/snacks/${skuCode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setItems(prev => {
          const newItems = new Map(prev);
          newItems.set(skuCode, {
            sku: data.sku,
            name: data.name,
            quantity: 1,
            price: data.price,
            description: data.description,
            category: data.category,
            photo_url: data.photo_url,
          });
          return newItems;
        });
      })
      .catch(() => {
        setNotFoundSku(skuCode);
        setShowItemNotFoundModal(true);
        setSku("");
      });
  }, [items]);

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
    fetch(`${import.meta.env.BASE_URL}api/v1/inventory/snacks/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchase_requests: Array.from(items.values()).map(item => ({
          sku: item.sku,
          quantity: item.quantity,
        })),
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then(() => {
      setItems(new Map());
      setShowCashModal(false);
      setShowVenmoModal(false);
      setSku("");
    }).catch(error => {
      console.error("Error checking out:", error);
    });
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

      {showItemNotFoundModal && (
        <ItemNotFoundModal
          sku={notFoundSku}
          onClose={() => {
            setNotFoundSku("");
            setShowItemNotFoundModal(false);
          }}
        />
      )}
    </>
  );
};

export default CheckoutPage;
