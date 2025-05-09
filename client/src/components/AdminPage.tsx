import { useState } from 'react';
import AdminInventoryGrid from './AdminInventoryGrid';
import AdminCheckout from './AdminCheckout';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'checkout'>('inventory');

  return (
    <div className="p-8">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded ${
            activeTab === 'inventory'
              ? 'bg-sky-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Inventory Management
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded ${
            activeTab === 'checkout'
              ? 'bg-sky-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Add New Items
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <AdminInventoryGrid />
      ) : (
        <AdminCheckout />
      )}
    </div>
  );
};

export default AdminPage; 