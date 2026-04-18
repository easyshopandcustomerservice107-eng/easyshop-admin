import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Admin Imports
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import AdManagement from './pages/admin/AdManagement';
import WishlistManagement from './pages/admin/WishlistManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import ReturnManagement from './pages/admin/ReturnManagement';
import SettingsOverview from './pages/admin/SettingsOverview';
import ShippingSettings from './pages/admin/ShippingSettings';
import AdminLogin from './pages/admin/AdminLogin';

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/inventory" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/returns" element={<ReturnManagement />} />
            <Route path="/settings" element={<SettingsOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/reviews" element={<ReviewManagement />} />
            <Route path="/ads" element={<AdManagement />} />
            <Route path="/wishlist" element={<WishlistManagement />} />
            <Route path="/testimonials" element={<TestimonialManagement />} />
            <Route path="/shipping" element={<ShippingSettings />} />
          </Route>
        </Route>

        {/* Redirect any other path to admin root or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
