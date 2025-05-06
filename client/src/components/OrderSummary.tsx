import ItemComponent, { Item } from "./Item";

interface OrderSummaryProps {
  items: Item[];
  calculateTotal: () => number;
  onQuantityChange: (sku: string, change: number) => void;
  onDeleteItem: (sku: string) => void;
}

const OrderSummary = ({
  items,
  calculateTotal,
  onQuantityChange,
  onDeleteItem
}: OrderSummaryProps) => {
  return (
    <div className="relative rounded-4xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border-2 border-sky-500/30 p-8 text-white w-full lg:w-1/2 flex flex-col h-[calc(100vh-10rem)] backdrop-blur-sm shadow-[0_0_25px_rgba(56,189,248,0.1)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">Order Summary</h2>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar px-4">
        <div className="space-y-4 py-2">
          {items.map((item) => (
            <ItemComponent 
              key={item.sku}
              item={item}
              onQuantityChange={(change) => onQuantityChange(item.sku, change)}
              onDelete={() => onDeleteItem(item.sku)}
            />
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
  );
};

export default OrderSummary; 