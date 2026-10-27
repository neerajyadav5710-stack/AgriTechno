import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FarmPlots from './pages/FarmPlots';
import SoilAnalytics from './pages/SoilAnalytics';
import CropMonitoring from './pages/CropMonitoring';
import WeatherAdvisory from './pages/WeatherAdvisory';
import Marketplace from './pages/Marketplace';
import CartCheckout from './pages/CartCheckout';
import OrderHistory from './pages/OrderHistory';
import AskDoctor from './pages/AskDoctor';
import CommunityForum from './pages/CommunityForum';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="main-content flex-grow-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/weather" element={<WeatherAdvisory />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/community" element={<CommunityForum />} />

                  {/* Protected Farmer/User routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farms"
                    element={
                      <ProtectedRoute>
                        <FarmPlots />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soil-analytics"
                    element={
                      <ProtectedRoute>
                        <SoilAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/crops"
                    element={
                      <ProtectedRoute>
                        <CropMonitoring />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartCheckout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ask-doctor"
                    element={
                      <ProtectedRoute>
                        <AskDoctor />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Only Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminPortal />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
