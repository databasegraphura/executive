// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProspectFormPage from './pages/ProspectFormPage';
import UserDataPage from './pages/UserDataPage';
import ReportPage from './pages/ReportPage';
import SalesReportPage from './pages/SalesReportPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './pages/ProtectedRoute'; // Our custom protected route component
import Layout from './components/Layout/Layout'; // Our main layout component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected routes - these will use our Layout component */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}> {/* Layout wraps pages that have sidebar/navbar */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/prospect-form" element={<ProspectFormPage />} />
            <Route path="/my-profile" element={<UserDataPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/sales-report" element={<SalesReportPage />} />
          </Route>
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;