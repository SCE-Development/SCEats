import { useState } from "react";
import { DollarSign, QrCode, Plus, Minus, Trash2, ArrowLeft, Check } from "lucide-react";

interface Item {
  name: string;
  quantity: number;
  price: number;
}

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "venmo" | null>(null);
  // const [isClicked, setIsClicked] = useState(false);
  const [clickedButton, setClickedButton] = useState<"cash" | "venmo" | "cancel" | "continue" | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showVenmoModal, setShowVenmoModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showCashConfirmModal, setShowCashConfirmModal] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({ name: "", quantity: 1, price: 0 });

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClick = (buttonType: "cash" | "venmo") => {
    setClickedButton(buttonType);
    setTimeout(() => setClickedButton(null), 300);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, buttonType: "continue" | "cancel") => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setClickedButton(buttonType);
    setTimeout(() => setClickedButton(null), 300);
    if (buttonType === "cancel") {
      setTimeout(() => setShowCancelModal(true), 400);
    } else if (buttonType === "continue" && paymentMethod === "venmo") {
      setTimeout(() => setShowVenmoModal(true), 400);
    } else if (buttonType === "continue" && paymentMethod === "cash") {
      setTimeout(() => setShowCashConfirmModal(true), 400);
    }
  };

  const handleCancel = () => {
    setPaymentMethod(null);     // Reset payment method
    setItems([]);              // Clear all items
    setShowCancelModal(false);  // Close the modal
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      // Random price between $5 and $25
      const randomPrice = Math.floor(Math.random() * 20) + 5; 
      setItems([...items, { ...newItem, price: randomPrice }]);
      setNewItem({ name: "", quantity: 1, price: 0 });
      setShowAddItemModal(false);
    }
  };

  const handleQuantityChange = (index: number, change: number) => {
    const updatedItems = [...items];
    const newQuantity = updatedItems[index].quantity + change;
    
    if (newQuantity > 0) {
      updatedItems[index].quantity = newQuantity;
      setItems(updatedItems);
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between mx-7 mt-32 space-y-3 lg:space-y-0 lg:space-x-7 items-start min-h-[calc(100vh-10rem)]">
        <img 
          src="/image/SCE-glow.png" 
          alt="SCE Logo" 
          className="absolute top-0 left-0 h-24 w-auto ml-6 mt-4 animate-pulse-subtle"
        />
        {/* Checkout Box */}
        <div className="relative rounded-4xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border-2 border-sky-500/30 p-8 text-white w-full lg:w-1/2 flex flex-col h-[calc(100vh-10rem)] backdrop-blur-sm shadow-[0_0_25px_rgba(56,189,248,0.1)] overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Order Summary</h2>
            <button
              className="p-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 active:bg-sky-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-lg shadow-sky-500/10"
              onClick={() => setShowAddItemModal(true)}
            >
              <Plus className="h-6 w-6 text-sky-400 group-hover:text-sky-300" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar px-4">
            <div className="space-y-4 py-2">
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-6 bg-gradient-to-br from-sky-900/40 to-sky-900/20 rounded-2xl border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 shadow-lg shadow-sky-900/10 group hover:scale-[1.02] origin-center"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300">{item.name}</h3>
                    <div className="flex items-center mt-3 space-x-4">
                      <div className="flex items-center bg-sky-900/50 rounded-xl p-1 shadow-inner shadow-black/20">
                        <button
                          onClick={() => handleQuantityChange(index, -1)}
                          className="p-2 rounded-lg hover:bg-sky-600/50 active:bg-sky-700/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                          <Minus className="h-4 w-4 text-sky-400" />
                        </button>
                        <span className="text-lg font-medium min-w-[2.5rem] text-center text-white/90">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(index, 1)}
                          className="p-2 rounded-lg hover:bg-sky-600/50 active:bg-sky-700/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                          <Plus className="h-4 w-4 text-sky-400" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 active:bg-red-500/30 hover:text-red-300 transition-all duration-200 transform hover:scale-105 active:scale-95 group/delete"
                      >
                        <Trash2 className="h-4 w-4 group-hover/delete:animate-wiggle" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full">
                    <p className="text-xl font-bold text-white/90 group-hover:text-white transition-colors duration-300">${(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-white/50 group-hover:text-white/60 transition-colors duration-300">@${item.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-sky-500/20">
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Total:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Box */}
        <div className="relative rounded-4xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border-2 border-sky-500/30 p-8 text-white w-full lg:w-1/2 flex flex-col h-[calc(100vh-10rem)] backdrop-blur-sm shadow-[0_0_25px_rgba(56,189,248,0.1)] overflow-hidden">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent mb-6">Payment Method</h2>
          
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col items-center justify-center flex-grow space-y-8">
              {/* Payment method buttons */}
              <div className="flex flex-col items-center space-y-16">
                <button
                  className={`group relative flex flex-col items-center justify-center rounded-3xl p-6 h-40 w-80 md:h-48 md:w-96 lg:h-56 lg:w-[28rem] border-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)] ${
                    paymentMethod === "cash" 
                      ? "border-sky-400 bg-gradient-to-br from-sky-900/40 to-sky-900/20 shadow-lg shadow-sky-500/20" 
                      : "border-gray-600/40 hover:border-sky-500/60 hover:bg-sky-900/10"
                  } ${clickedButton === "cash" ? "scale-98 shadow-[0_0_30px_rgba(56,189,248,0.5)]" : ""}`}
                  onClick={() => {
                    setPaymentMethod("cash");
                    handleClick("cash");
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <DollarSign className={`h-16 w-16 mb-6 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-all duration-300 group-hover:scale-110 ${paymentMethod === "cash" ? "text-sky-400" : "text-gray-400 group-hover:text-sky-400"} ${clickedButton === "cash" ? "animate-pulse" : ""}`} />
                  <span className={`text-2xl md:text-3xl lg:text-4xl font-medium transition-all duration-300 ${paymentMethod === "cash" ? "text-sky-400" : "text-gray-400 group-hover:text-sky-400"}`}>Cash</span>
                </button>
                <button
                  className={`group relative flex flex-col items-center justify-center rounded-3xl p-6 h-40 w-80 md:h-48 md:w-96 lg:h-56 lg:w-[28rem] border-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)] ${
                    paymentMethod === "venmo" 
                      ? "border-sky-400 bg-gradient-to-br from-sky-900/40 to-sky-900/20 shadow-lg shadow-sky-500/20" 
                      : "border-gray-600/40 hover:border-sky-500/60 hover:bg-sky-900/10"
                  } ${clickedButton === "venmo" ? "scale-98 shadow-[0_0_30px_rgba(56,189,248,0.5)]" : ""}`}
                  onClick={() => {
                    setPaymentMethod("venmo");
                    handleClick("venmo");
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <QrCode className={`h-16 w-16 mb-6 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-all duration-300 group-hover:scale-110 ${paymentMethod === "venmo" ? "text-sky-400" : "text-gray-400 group-hover:text-sky-400"} ${clickedButton === "venmo" ? "animate-pulse" : ""}`} />
                  <span className={`text-2xl md:text-3xl lg:text-4xl font-medium transition-all duration-300 ${paymentMethod === "venmo" ? "text-sky-400" : "text-gray-400 group-hover:text-sky-400"}`}>Venmo</span>
                </button>
              </div>
            </div>

            {/* Cancel and Continue Buttons */}
            {paymentMethod && (
              <div className="mt-2 flex justify-center gap-6 pt-6">
                <button
                  className={`group relative inline-flex items-center justify-center px-10 py-3 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(56,189,248,0.5)] animate-pulse-glow-blue ${
                    clickedButton === "continue" ? "scale-98 shadow-[0_0_50px_rgba(56,189,248,0.7)]" : ""
                  }`}
                  onClick={(e) => handleButtonClick(e, "continue")}
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-xl transition-all duration-300 group-hover:bg-sky-600" />
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full opacity-0 transform scale-0 transition-all duration-300"
                    style={{
                      left: ripplePosition.x,
                      top: ripplePosition.y,
                      transform: clickedButton === "continue" ? "scale(25)" : "scale(0)",
                      opacity: clickedButton === "continue" ? "0.2" : "0"
                    }}
                  />
                  <span className={`relative z-10 text-xl font-semibold transition-all duration-300 group-hover:tracking-wider ${clickedButton === "continue" ? "animate-pulse" : ""}`}>
                    CONTINUE WITH {paymentMethod === "cash" ? "CASH" : "VENMO"}
                  </span>
                </button>
                <button
                  className={`group relative inline-flex items-center justify-center px-10 py-3 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse-glow-red ${
                    clickedButton === "cancel" ? "scale-98 shadow-[0_0_50px_rgba(239,68,68,0.7)]" : ""
                  }`}
                  onClick={(e) => handleButtonClick(e, "cancel")}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-xl transition-all duration-300 group-hover:bg-red-600" />
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full opacity-0 transform scale-0 transition-all duration-300"
                    style={{
                      left: ripplePosition.x,
                      top: ripplePosition.y,
                      transform: clickedButton === "cancel" ? "scale(25)" : "scale(0)",
                      opacity: clickedButton === "cancel" ? "0.2" : "0"
                    }}
                  />
                  <span className={`relative z-10 text-xl font-semibold transition-all duration-300 group-hover:tracking-wider ${clickedButton === "cancel" ? "animate-pulse" : ""}`}>
                    CANCEL
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div 
            className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 w-[28rem] shadow-2xl transform transition-all duration-300 animate-fade-in border border-gray-200"
          >
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center">Add New Item</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-gray-700 text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Quantity</label>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setNewItem(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    className="h-12 w-12 flex items-center justify-center rounded-xl border border-gray-200 hover:border-sky-500 hover:bg-sky-50 active:bg-sky-100 transition-all duration-200 group"
                  >
                    <Minus className="h-5 w-5 text-gray-500 group-hover:text-sky-600" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="w-24 h-12 text-center rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-gray-700 text-lg font-medium transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  />
                  <button
                    onClick={() => setNewItem(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    className="h-12 w-12 flex items-center justify-center rounded-xl border border-gray-200 hover:border-sky-500 hover:bg-sky-50 active:bg-sky-100 transition-all duration-200 group"
                  >
                    <Plus className="h-5 w-5 text-gray-500 group-hover:text-sky-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/25"
                onClick={handleAddItem}
              >
                <div className="absolute inset-0 bg-sky-500 rounded-2xl transition-all duration-300 group-hover:bg-sky-600" />
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Add Item</span>
              </button>
              <button
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold"
                onClick={() => {
                  setShowAddItemModal(false);
                  setNewItem({ name: "", quantity: 1, price: 0 });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-96 text-center shadow-2xl transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-16 w-16 text-red-500 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Are you sure you want to cancel?</h2>
            <div className="flex justify-center space-x-6">
              <button
                className="px-8 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse-glow-red"
                onClick={handleCancel}
              >
                Yes, Cancel
              </button>
              <button
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 font-semibold"
                onClick={() => setShowCancelModal(false)}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Venmo QR Modal */}
      {showVenmoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div 
            className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 w-[36rem] shadow-2xl transform transition-all duration-500 animate-fade-in border border-gray-200 relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-x"></div>
            
            {/* Back Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowVenmoModal(false);
              }}
              className="group absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 z-50"
            >
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
            </button>
            
            <div className="relative mb-5">
              <h2 className="text-3xl font-bold text-gray-800 text-center">Scan to Pay with Venmo</h2>
              <p className="text-gray-600 text-center mt-2">Total Amount: ${calculateTotal().toFixed(2)}</p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 overflow-hidden">
                <img 
                  src="/image/venmoQR.png" 
                  alt="Venmo QR Code" 
                  className="w-[28rem] h-[28rem] scale-100 transform-gpu"
                />
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/25"
                onClick={() => {
                  setShowVenmoModal(false);
                  setPaymentMethod(null);
                  setItems([]);
                  setNewItem({ name: "", quantity: 1, price: 0 });
                  setClickedButton(null);
                  setRipplePosition({ x: 0, y: 0 });
                }}
              >
                <div className="absolute inset-0 bg-sky-500 rounded-2xl transition-all duration-300 group-hover:bg-sky-600" />
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Done
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Confirmation Modal */}
      {showCashConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div 
            className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 w-[36rem] shadow-2xl transform transition-all duration-500 animate-fade-in border border-gray-200 relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-x"></div>
            
            {/* Back Button */}
            <button
              onClick={() => setShowCashConfirmModal(false)}
              className="group absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 z-50"
            >
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
            </button>
            
            <div className="relative mb-5">
              <h2 className="text-3xl font-bold text-gray-800 text-center">Continue with cash?</h2>
              <p className="text-gray-600 text-center mt-2">Total Amount: ${calculateTotal().toFixed(2)}</p>
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/25"
                onClick={() => {
                  setShowCashConfirmModal(false);
                  setShowCashModal(true);
                }}
              >
                <div className="absolute inset-0 bg-sky-500 rounded-2xl transition-all duration-300 group-hover:bg-sky-600" />
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Continue
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Did you pay yet Modal */}
      {showCashModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div 
            className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 w-[36rem] shadow-2xl transform transition-all duration-500 animate-fade-in border border-gray-200 relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-x"></div>
            
            {/* Back Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCashModal(false);
                setShowCashConfirmModal(true);
              }}
              className="group absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 z-50"
            >
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
            </button>
            
            <div className="relative mb-5">
              <h2 className="text-3xl font-bold text-gray-800 text-center">Did you pay yet?</h2>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 overflow-hidden">
                <img 
                  src="/image/cashPaid.png" 
                  alt="Cash Paid" 
                  className="w-[28rem] h-[28rem] scale-100 transform-gpu"
                />
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-lg font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/25"
                onClick={() => {
                  setShowCashModal(false);
                  setPaymentMethod(null);
                  setItems([]);
                  setNewItem({ name: "", quantity: 1, price: 0 });
                  setClickedButton(null);
                  setRipplePosition({ x: 0, y: 0 });
                }}
              >
                <div className="absolute inset-0 bg-sky-500 rounded-2xl transition-all duration-300 group-hover:bg-sky-600" />
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Done
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;