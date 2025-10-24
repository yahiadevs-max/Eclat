import React from 'react';
import { Navigate } from 'react-router-dom';

const Account: React.FC = () => {
  // The account page is now effectively the admin login/dashboard.
  // Redirect to the admin login page. The header icon will handle the logic.
  return <Navigate to="/admin/login" replace />;
};

export default Account;
