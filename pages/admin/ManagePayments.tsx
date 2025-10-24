import React, { useState } from 'react';
import { Payment } from '../../types';
import { mockPayments } from '../../data/payments';
import { useAuth } from '../../context/AuthContext';

const ManagePayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  
  if (user?.role !== 'superadmin' && !user?.permissions?.payments) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les paiements.</p>
        </div>
    );
  }

  const handleRefund = (transactionId: string) => {
    setPayments(prev => 
      prev.map(p => 
        p.transactionId === transactionId ? { ...p, status: 'Remboursé' } : p
      )
    );
  };
  
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Réussi': return 'text-green-600';
      case 'Remboursé': return 'text-blue-600';
      case 'En attente': return 'text-yellow-600';
      case 'Échoué': return 'text-red-600';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Gestion des Paiements</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment.transactionId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{payment.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.amount.toFixed(2)} DA</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  <span className={getStatusColor(payment.status)}>{payment.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.status === 'Réussi' && (
                    <button
                      onClick={() => handleRefund(payment.transactionId)}
                      className="text-accent hover:underline text-xs"
                    >
                      Rembourser
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments;