import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, AdminPermissions } from '../../context/AuthContext';
import {
  DashboardIcon,
  ProductIcon,
  OrderIcon,
  StockIcon,
  DeliveryIcon,
  PaymentIcon,
  ReturnIcon,
  AdminsIcon,
  LogoutIcon,
} from '../icons';

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const commonLinkClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors";
  const activeLinkClasses = "bg-accent text-white";
  const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  const navItems = [
    { to: "/admin/dashboard", icon: <DashboardIcon className="w-5 h-5 mr-3" />, label: "Tableau de Bord", permission: "dashboard" },
    { to: "/admin/products", icon: <ProductIcon className="w-5 h-5 mr-3" />, label: "Gestion des Produits", permission: "products" },
    { to: "/admin/orders", icon: <OrderIcon className="w-5 h-5 mr-3" />, label: "Gestion des Commandes", permission: "orders" },
    { to: "/admin/stock", icon: <StockIcon className="w-5 h-5 mr-3" />, label: "Gestion du Stock", permission: "stock" },
    { to: "/admin/deliveries", icon: <DeliveryIcon className="w-5 h-5 mr-3" />, label: "Gestion des Livraisons", permission: "deliveries" },
    { to: "/admin/shipping", icon: <DeliveryIcon className="w-5 h-5 mr-3" />, label: "Gestion des Frais de Port", permission: "shipping" },
    { to: "/admin/payments", icon: <PaymentIcon className="w-5 h-5 mr-3" />, label: "Gestion des Paiements", permission: "payments" },
    { to: "/admin/returns", icon: <ReturnIcon className="w-5 h-5 mr-3" />, label: "Gestion des Retours", permission: "returns" },
    { to: "/admin/admins", icon: <AdminsIcon className="w-5 h-5 mr-3" />, label: "Gestion des Admins", permission: "admins" },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (user?.role === 'superadmin') {
      return true; // Super admin sees everything
    }
    if (user?.role === 'admin') {
        // Hide dashboard and admin management from regular admins
        if (item.permission === 'dashboard' || item.permission === 'admins') {
            return false;
        }
        // Show other items based on permissions
        return user?.permissions?.[item.permission as keyof AdminPermissions] === true;
    }
    return false;
  });


  return (
    <aside className="w-64 bg-primary text-secondary flex flex-col sticky top-0 h-screen">
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">ÉCLAT - Admin</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleNavItems.map(item => (
            <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
            {item.icon}
            <span>{item.label}</span>
            </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`${commonLinkClasses} w-full ${inactiveLinkClasses}`}
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;