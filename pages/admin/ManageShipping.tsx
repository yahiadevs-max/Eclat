import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { wilayas as wilayaList, shippingCosts as initialShippingCosts } from '../../data/shipping';

const ManageShipping: React.FC = () => {
  const { user } = useAuth();
  const [shippingCosts, setShippingCosts] = useState<Record<string, number>>(initialShippingCosts);

  if (user?.role !== 'superadmin' && !user?.permissions?.shipping) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les frais de port.</p>
        </div>
    );
  }

  const handleCostChange = (wilaya: string, cost: string) => {
    const numericCost = Number(cost);
    if (!isNaN(numericCost)) {
      setShippingCosts(prev => ({
        ...prev,
        [wilaya]: numericCost
      }));
    }
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would send the updated shippingCosts object to a server.
    // For this demo, we'll just log it and show an alert.
    console.log("Saving new shipping costs:", shippingCosts);
    alert("Frais de port sauvegardés avec succès !");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Gestion des Frais de Port</h2>
        <button 
          onClick={handleSaveChanges} 
          className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-md text-sm transition-colors"
        >
          Sauvegarder les changements
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {wilayaList.map(wilaya => (
            <div key={wilaya} className="flex items-center justify-between border-b pb-2">
              <label htmlFor={`shipping-${wilaya}`} className="text-sm font-medium text-gray-700">
                {wilaya}
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id={`shipping-${wilaya}`}
                  value={shippingCosts[wilaya] || 0}
                  onChange={(e) => handleCostChange(wilaya, e.target.value)}
                  className="w-24 p-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-accent focus:border-accent bg-white text-primary"
                  placeholder="Coût"
                />
                <span className="ml-2 text-sm text-gray-500">DA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageShipping;