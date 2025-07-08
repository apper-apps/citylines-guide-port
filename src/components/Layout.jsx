import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

// Mock user data - enhanced with role-based permissions
  const user = {
    name: "John Chen",
    email: "john@example.com",
    subscriptionTier: "pro",
    role: "admin", // Enhanced for admin capabilities
    userId: 1
  };

  // Current city context for multi-tenant system
  const currentCity = {
    name: "Singapore",
    subdomain: "singapore",
    Id: 1,
    status: "active"
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        currentCity={currentCity}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          isOpen={sidebarOpen}
          user={user}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;