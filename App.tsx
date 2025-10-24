import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import Account from './pages/Account';
import About from './pages/About';
import Blog from './pages/Blog';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageStock from './pages/admin/ManageStock';
import ManageDeliveries from './pages/admin/ManageDeliveries';
import ManagePayments from './pages/admin/ManagePayments';
import ManageReturns from './pages/admin/ManageReturns';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageShipping from './pages/admin/ManageShipping';

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen font-sans bg-secondary text-primary">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="stock" element={<ManageStock />} />
            <Route path="deliveries" element={<ManageDeliveries />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="returns" element={<ManageReturns />} />
            <Route path="admins" element={<ManageAdmins />} />
            <Route path="shipping" element={<ManageShipping />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;