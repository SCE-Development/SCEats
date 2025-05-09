import { useState } from 'react';
import { Item } from '../Item';

interface AddItemModalProps {
  sku: string;
  initialData?: {
    name?: string;
    photo_url?: string;
  };
  onClose: () => void;
  onConfirm: (item: Omit<Item, 'quantity'>) => void;
}

const AddItemModal = ({ sku, initialData, onClose, onConfirm }: AddItemModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: '',
    description: initialData?.name || '',
    category: 'snack',
    photo_url: initialData?.photo_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      sku,
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              value={sku}
              disabled
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
              step="0.01"
              min="0"
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input
              type="text"
              value={formData.photo_url}
              onChange={e => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 rounded hover:bg-sky-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal; 