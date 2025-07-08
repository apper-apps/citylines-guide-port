import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      const userData = await authService.signup(email, password, name);
      toast.success('Account created! Please verify your email.');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      toast.success('Password reset successful!');
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
      throw error;
    }
  };

  const verifyEmail = async (token) => {
    try {
      const userData = await authService.verifyEmail(token);
      setUser(userData);
      toast.success('Email verified successfully!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Email verification failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};