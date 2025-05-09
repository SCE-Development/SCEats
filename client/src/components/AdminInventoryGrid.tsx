import { useEffect, useState } from 'react';
import { Save, Trash2, Pencil } from 'lucide-react';
import { Item } from './Item';

const AdminInventoryGrid = () => {
  const [snacks, setSnacks] = useState<Item[]>([]);
  const [editingSnack, setEditingSnack] = useState<Item | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/v1/inventory/`)
      .then(response => response.json())
      .then(data => setSnacks(data.snacks))
      .catch(error => console.error('Error fetching snacks:', error));
  }, []);

  const handleSave = (updatedSnack: Item) => {
    fetch(`${import.meta.env.BASE_URL}api/v1/inventory/snacks/${updatedSnack.sku}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedSnack.name,
        quantity: updatedSnack.quantity,
        price: updatedSnack.price,
        description: updatedSnack.description,
        category: updatedSnack.category,
        photo_url: updatedSnack.photo_url
      })
    })
      .then(response => response.json())
      .then(updatedSnack => {
        setSnacks(snacks.map(s => s.sku === updatedSnack.sku ? updatedSnack : s));
        setEditingSnack(null);
      })
      .catch(error => console.error('Error updating snack:', error));
  };

  const handleDelete = (sku: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    fetch(`${import.meta.env.BASE_URL}api/v1/inventory/snacks/${sku}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => setSnacks(snacks.filter(s => s.sku !== sku)))
      .catch(error => console.error('Error deleting snack:', error));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800/50">
            <th className="p-4 text-left text-sky-400">SKU</th>
            <th className="p-4 text-left text-sky-400">Name</th>
            <th className="p-4 text-left text-sky-400">Price</th>
            <th className="p-4 text-left text-sky-400">Quantity</th>
            <th className="p-4 text-left text-sky-400">Category</th>
            <th className="p-4 text-left text-sky-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {snacks.map(snack => (
            <tr key={snack.sku} className="border-b border-gray-700/50 hover:bg-gray-800/30">
              <td className="p-4">{snack.sku}</td>
              <td className="p-4">
                {editingSnack?.sku === snack.sku ? (
                  <input
                    type="text"
                    value={editingSnack.name}
                    onChange={e => setEditingSnack({...editingSnack, name: e.target.value})}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  />
                ) : snack.name}
              </td>
              <td className="p-4">
                {editingSnack?.sku === snack.sku ? (
                  <input
                    type="number"
                    value={editingSnack.price}
                    onChange={e => setEditingSnack({...editingSnack, price: parseFloat(e.target.value)})}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-24"
                    step="0.01"
                  />
                ) : `$${snack.price.toFixed(2)}`}
              </td>
              <td className="p-4">
                {editingSnack?.sku === snack.sku ? (
                    <input
                      type="number"
                      value={editingSnack.quantity}
                      onChange={e => setEditingSnack({...editingSnack, quantity: parseInt(e.target.value) || 0})}
                      className="bg-gray-700 text-white px-2 py-1 rounded w-16 text-center"
                    />
                ) : snack.quantity}
              </td>
              <td className="p-4">
                {editingSnack?.sku === snack.sku ? (
                  <input
                    type="text"
                    value={editingSnack.category}
                    onChange={e => setEditingSnack({...editingSnack, category: e.target.value})}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  />
                ) : snack.category}
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  {editingSnack?.sku === snack.sku ? (
                    <button
                      onClick={() => handleSave(editingSnack)}
                      className="p-2 rounded bg-sky-600 hover:bg-sky-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingSnack(snack)}
                      className="p-2 rounded bg-sky-600 hover:bg-sky-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(snack.sku)}
                    className="p-2 rounded bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInventoryGrid; 