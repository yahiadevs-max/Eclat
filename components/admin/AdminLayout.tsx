import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-secondary">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;