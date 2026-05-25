import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SOS from './pages/SOS';
import MapView from './pages/MapView';
import Offline from './pages/Offline';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import './index.css';

// Protected Route Component
const RequireAuth = ({ children }) => {
  const isAuthenticated =
    localStorage.getItem('roadSOSLoggedIn') === 'true';

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <EmergencyProvider>
        <BrowserRouter>
          <Routes>

            {/* Login */}
            <Route path="/" element={<Login />} />

            {/* Home */}
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            {/* Protected Layout Routes */}
            <Route
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </EmergencyProvider>
    </LanguageProvider>
  );
}

export default App;