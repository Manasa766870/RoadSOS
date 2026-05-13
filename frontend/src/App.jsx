import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SOS from './pages/SOS';
import MapView from './pages/MapView';
import Offline from './pages/Offline';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import './index.css';

function App() {
  return (
    <LanguageProvider>
      <EmergencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
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
