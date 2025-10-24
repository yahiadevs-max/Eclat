import React, { useState, useMemo } from 'react';
import { products } from '../../data/products';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ManageStock: React.FC = () => {
  const { user } = useAuth();
  const [stockLevels, setStockLevels] = useState<Product[]>(products);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  if (user?.role !== 'superadmin' && !user?.permissions?.stock) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer le stock.</p>
        </div>
    );
  }

  const handleStockChange = (productId: number, newStock: number) => {
    const stock = Math.max(0, newStock); // Prevent negative stock
    setStockLevels(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock } : p))
    );
  };

  const lowStockProducts = useMemo(() => {
    return stockLevels.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  }, [stockLevels, lowStockThreshold]);
  
  const outOfStockProducts = useMemo(() => {
      return stockLevels.filter(p => p.stock === 0);
  }, [stockLevels]);

  const getStatusInfo = (stock: number): { text: string; color: string; rowClass: string } => {
    if (stock === 0) {
      return { text: 'En rupture', color: 'bg-red-500', rowClass: 'bg-red-50' };
    }
    if (stock <= lowStockThreshold) {
      return { text: 'Faible', color: 'bg-yellow-500', rowClass: 'bg-yellow-50' };
    }
    return { text: 'Élevé', color: 'bg-green-500', rowClass: '' };
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-3xl font-bold">Gestion du Stock</h2>
        <div className="flex items-center space-x-2">
            <label htmlFor="threshold" className="text-sm font-medium text-gray-700 whitespace-nowrap">Seuil de stock faible :</label>
            <input 
                type="number"
                id="threshold"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white text-primary"
            />
        </div>
      </div>

      <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow">
        <p className="font-bold">
            Alerte : {lowStockProducts.length} produit(s) ont un stock faible (quantité ≤ {lowStockThreshold}).
        </p>
         {outOfStockProducts.length > 0 && (
            <p className="font-bold text-red-800 mt-1">
                {outOfStockProducts.length} produit(s) sont en rupture de stock.
            </p>
         )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau de Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockLevels.map(product => {
              const statusInfo = getStatusInfo(product.stock);
              return (
              <tr key={product.id} className={`transition-colors duration-200 ${statusInfo.rowClass} hover:bg-gray-100`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${statusInfo.color} mr-2`}></div>
                        {statusInfo.text}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleStockChange(product.id, parseInt(e.target.value, 10))}
                    className="w-20 p-1 border border-gray-300 rounded-md bg-white text-primary"
                    aria-label={`Stock pour ${product.name}`}
                  />
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStock;