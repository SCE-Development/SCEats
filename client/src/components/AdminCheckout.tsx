import { useState, useEffect, useCallback } from "react";
import { Item } from "./Item";
import AddItemModal from "./modals/AddItemModal";
import { Plus, Minus, Trash2, Save } from "lucide-react";

const AdminCheckout = () => {
  const [sku, setSku] = useState<string>("");
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalData, setModalData] = useState<{
    sku: string;
    name?: string;
    photo_url?: string;
  } | null>(null);

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

    // Check if item exists in our database
    fetch(`${import.meta.env.BASE_URL}/api/v1/inventory/snacks/${skuCode}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Not in database");
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
        // If not in database, try OpenFoodFacts
        fetch(`https://world.openfoodfacts.net/api/v2/product/${skuCode}?fields=product_name,image_url`)
          .then(response => response.json())
          .then(data => {
            if (data.status === 1) {
              // Found in OpenFoodFacts
              setModalData({
                sku: skuCode,
                name: data.product.product_name,
                photo_url: data.product.image_url,
              });
            } else {
              // Not found in OpenFoodFacts
              setModalData({
                sku: skuCode,
              });
            }
            setShowAddModal(true);
          })
          .catch(() => {
            // Error with OpenFoodFacts, show empty modal
            setModalData({
              sku: skuCode,
            });
            setShowAddModal(true);
          });
      });
  }, [items]);

  const handleAddItem = (item: Omit<Item, 'quantity'>) => {
    setItems(prev => {
      const newItems = new Map(prev);
      newItems.set(item.sku, { ...item, quantity: 1 });
      return newItems;
    });
    setShowAddModal(false);
    setModalData(null);
  };

  // Add keyboard event listener for SKU input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if not in an input field
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        // If key is Enter and we have a SKU, handle the SKU
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sku, addItemBySku]);

  const handleQuantityChange = (sku: string, change: number) => {
    setItems(prev => {
      const newItems = new Map(prev);
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
    setItems(prev => {
      const newItems = new Map(prev);
      newItems.delete(sku);
      return newItems;
    });
  };

  const handleSaveToInventory = async () => {
    const itemsArray = Array.from(items.values());
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}/api/v1/inventory/snacks/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: itemsArray.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            category: item.category,
            photo_url: item.photo_url,
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save items');
      }
      
      setItems(new Map());
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between mx-7 space-y-3 lg:space-y-0 lg:space-x-7 items-start min-h-[calc(100vh-10rem)]">
      {showAddModal && modalData && (
        <AddItemModal
          sku={modalData.sku}
          initialData={{
            name: modalData.name,
            photo_url: modalData.photo_url,
          }}
          onClose={() => {
            setShowAddModal(false);
            setModalData(null);
          }}
          onConfirm={handleAddItem}
        />
      )}
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

      {/* Cart Display */}
      <div className="w-full bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        {items.size === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No items in cart. Scan a barcode to add items.
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(items.values()).map(item => (
              <div key={item.sku} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  {item.photo_url && (
                    <img
                      src={item.photo_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.sku, -1)}
                      className="p-1 rounded hover:bg-gray-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.sku, 1)}
                      className="p-1 rounded hover:bg-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.sku)}
                    className="p-2 rounded bg-red-600/50 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveToInventory}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-600 rounded hover:bg-sky-700"
              >
                <Save className="h-4 w-4" />
                <span>Save to Inventory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckout; 