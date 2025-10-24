import React, { useState } from 'react';
import { Delivery } from '../../types';
import { mockDeliveries } from '../../data/deliveries';
import { useAuth } from '../../context/AuthContext';

const ManageDeliveries: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);

  if (user?.role !== 'superadmin' && !user?.permissions?.deliveries) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les livraisons.</p>
        </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => 
      prev.map(d => 
        d.orderId === orderId ? { ...d, status: newStatus } : d
      )
    );
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Gestion des Livraisons</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° de Suivi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveries.map(delivery => (
              <tr key={delivery.orderId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{delivery.trackingNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={delivery.status}
                    onChange={e => handleStatusChange(delivery.orderId, e.target.value as Delivery['status'])}
                    className="p-1.5 text-xs rounded-md border-gray-300 focus:ring-accent focus:border-accent bg-white text-primary"
                  >
                    <option>Préparation</option>
                    <option>Expédiée</option>
                    <option>En transit</option>
                    <option>Livrée</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDeliveries;