import React, { useState } from 'react';
import { ReturnRequest } from '../../types';
import { mockReturnRequests } from '../../data/returns';
import { useAuth } from '../../context/AuthContext';

const ManageReturns: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ReturnRequest[]>(mockReturnRequests);

  if (user?.role !== 'superadmin' && !user?.permissions?.returns) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les retours.</p>
        </div>
    );
  }

  const handleStatusUpdate = (requestId: string, newStatus: ReturnRequest['status']) => {
    setRequests(prev =>
      prev.map(req => 
        req.requestId === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Gestion des Retours</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demande ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(req => (
              <tr key={req.requestId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.requestId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {req.status === 'Demandé' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(req.requestId, 'Approuvé')}
                        className="text-green-600 hover:text-green-900">
                        Approuver
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req.requestId, 'Rejeté')}
                        className="text-red-600 hover:text-red-900">
                        Rejeter
                      </button>
                    </>
                  )}
                  {req.status === 'Approuvé' && (
                     <button 
                        onClick={() => handleStatusUpdate(req.requestId, 'Terminé')}
                        className="text-blue-600 hover:text-blue-900">
                        Marquer comme Terminé
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

export default ManageReturns;