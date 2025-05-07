import { Plus, Minus, Trash2 } from "lucide-react";

export interface Item {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;  
  photo_url: string;
}

interface ItemProps {
  item: Item;
  onQuantityChange: (change: number) => void;
  onDelete: () => void;
}

const ItemComponent = ({ item, onQuantityChange, onDelete }: ItemProps) => {
  return (
    <div className="flex justify-between items-center p-6 bg-gradient-to-br from-sky-900/40 to-sky-900/20 rounded-2xl border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 shadow-lg shadow-sky-900/10 group hover:scale-[1.02] origin-center">
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300">{item.name}</h3>
        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center bg-sky-900/50 rounded-xl p-1 shadow-inner shadow-black/20">
            <button
              onClick={() => onQuantityChange(-1)}
              className="p-2 rounded-lg hover:bg-sky-600/50 active:bg-sky-700/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Minus className="h-4 w-4 text-sky-400" />
            </button>
            <span className="text-lg font-medium min-w-[2.5rem] text-center text-white/90">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(1)}
              className="p-2 rounded-lg hover:bg-sky-600/50 active:bg-sky-700/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 text-sky-400" />
            </button>
          </div>
          <button
            onClick={onDelete}
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
  );
};

export default ItemComponent; 