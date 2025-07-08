import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/components/pages/auth/LoginPage";
import SignupPage from "@/components/pages/auth/SignupPage";
import ForgotPasswordPage from "@/components/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/components/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/components/pages/auth/VerifyEmailPage";
import React from "react";
import Layout from "@/components/Layout";
import AdminPanel from "@/components/pages/AdminPanel";
import Settings from "@/components/pages/Settings";
import Analytics from "@/components/pages/Analytics";
import Dashboard from "@/components/pages/Dashboard";
import DirectoryBuilder from "@/components/pages/DirectoryBuilder";
import MyCities from "@/components/pages/MyCities";
import AdsRevenue from "@/components/pages/AdsRevenue";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
            
{/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cities" element={<MyCities />} />
              <Route path="builder" element={<DirectoryBuilder />} />
              <Route path="ads" element={<AdsRevenue />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="admin/users" element={<AdminPanel />} />
              <Route path="admin/cities" element={<AdminPanel />} />
            </Route>
          </Routes>
        
<ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App