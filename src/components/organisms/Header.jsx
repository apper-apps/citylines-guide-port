import React, { useState } from "react";
import { motion } from "framer-motion";
import { useContext } from 'react';
import { AuthContext } from '../../App';
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Settings from "@/components/pages/Settings";

const Header = ({ user, onMenuToggle, currentCity }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useContext(AuthContext);
  const getPlanColor = (plan) => {
    switch (plan) {
      case 'starter': return 'primary';
      case 'pro': return 'secondary';
      case 'enterprise': return 'accent';
      default: return 'default';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <ApperIcon name="Train" className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">CityLines Guide</span>
          </div>
          
          {currentCity && (
            <div className="hidden md:flex items-center space-x-2">
              <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{currentCity.name}</span>
              <Badge variant="active">Active</Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant={getPlanColor(user.subscriptionTier)}>
            {user.subscriptionTier} plan
          </Badge>
          
          <Button variant="outline" size="sm">
            <ApperIcon name="Bell" className="w-4 h-4 mr-1" />
            Notifications
          </Button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
            </button>
            
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
              >
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Billing & Plans
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Support
                </a>
                <hr className="my-1" />
<button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;