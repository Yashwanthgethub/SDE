import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import SharedWithMePage from './pages/SharedWithMePage';
import TrashPage from './pages/TrashPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import NewDocumentPage from './pages/NewDocumentPage';
import DocumentDetailPage from './pages/DocumentDetailPage';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new-document" element={<NewDocumentPage />} />
            <Route path="/my-documents" element={<MyDocumentsPage />} />
            <Route path="/shared" element={<SharedWithMePage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/settings" element={<AccountSettingsPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
