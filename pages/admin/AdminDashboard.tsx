import React from 'react';
import { products } from '../../data/products';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'superadmin') {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Seuls les super administrateurs peuvent accéder au tableau de bord.</p>
        </div>
    );
  }

  // Mock data for dashboard
  const totalSales = products.reduce((acc, p) => acc + p.price * (100 - p.stock), 0); // Faking sales data
  const totalOrders = 150;
  const totalProducts = products.length;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Tableau de Bord</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Ventes Totales</p>
            <p className="text-2xl font-bold">{totalSales.toFixed(2)} DA</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
          <div className="p-3 bg-indigo-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Produits en Ligne</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Activité Récente</h3>
        <p className="text-gray-600">Le journal d'activité sera affiché ici...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;