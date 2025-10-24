import React, { useState } from 'react';
import { Order } from '../../types';
import { mockOrders } from '../../data/orders';
import { useAuth } from '../../context/AuthContext';

const ManageOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  if (user?.role !== 'superadmin' && !user?.permissions?.orders) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les commandes.</p>
        </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusDotColor = (status: Order['status']) => {
    switch (status) {
      case 'Livrée': return 'bg-green-500';
      case 'Expédiée': return 'bg-blue-500';
      case 'En attente': return 'bg-yellow-500';
      case 'Annulée': return 'bg-red-500';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Gestion des Commandes</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} DA</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusDotColor(order.status)}`}></span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="p-1.5 text-xs rounded-md border border-gray-300 focus:ring-accent focus:border-accent bg-white text-primary"
                    >
                      <option value="En attente">En attente</option>
                      <option value="Expédiée">Expédiée</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;