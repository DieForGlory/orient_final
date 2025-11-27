import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { GoogleTagManager } from './components/GoogleTagManager';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Collections } from './pages/Collections';
import { CollectionDetail } from './pages/CollectionDetail';
import { BrandHistory } from './pages/BrandHistory';
import { Boutique } from './pages/Boutique';
import { Cart } from './pages/Cart';
// Admin imports
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLogin } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { ProductForm } from './pages/admin/ProductForm';
import { AdminCollections } from './pages/admin/Collections';
import { AdminFilters } from './pages/admin/Filters';
import { AdminOrders } from './pages/admin/Orders';
import { AdminBookings } from './pages/admin/Bookings';
import { AdminUsers } from './pages/admin/Users';
import { AdminContent } from './pages/admin/Content';
import { AdminSettings } from './pages/admin/Settings';
// Context
import { CartProvider } from './contexts/CartContext';
export function App() {
  return <CartProvider>
      <BrowserRouter>
        <GoogleTagManager />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </div>} />

          <Route path="/catalog" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <Catalog />
                </main>
                <Footer />
              </div>} />

          <Route path="/collections" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <Collections />
                </main>
                <Footer />
              </div>} />

          <Route path="/product/:id" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <ProductDetail />
                </main>
                <Footer />
              </div>} />

          <Route path="/collection/:id" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <CollectionDetail />
                </main>
                <Footer />
              </div>} />

          <Route path="/history" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <BrandHistory />
                </main>
                <Footer />
              </div>} />

          <Route path="/boutique" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <Boutique />
                </main>
                <Footer />
              </div>} />

          <Route path="/cart" element={<div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                  <Cart />
                </main>
                <Footer />
              </div>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="filters" element={<AdminFilters />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>;
}