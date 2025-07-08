import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, user }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Cities', href: '/cities', icon: 'Building' },
    { name: 'Directory Builder', href: '/builder', icon: 'MapPin' },
    { name: 'Ads & Revenue', href: '/ads', icon: 'Target' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: 'Shield' },
    { name: 'User Management', href: '/admin/users', icon: 'Users' },
    { name: 'City Management', href: '/admin/cities', icon: 'Globe' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <ApperIcon name="Train" className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">CityLines</span>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            {user.role === 'admin' && (
              <>
                <hr className="my-4" />
                <div className="space-y-2">
                  {adminNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )
                      }
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />
        )}
        
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
        >
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <ApperIcon name="Train" className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">CityLines</span>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {user.role === 'admin' && (
                <>
                  <hr className="my-4" />
                  <div className="space-y-2">
                    {adminNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-accent text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          )
                        }
                      >
                        <ApperIcon name={item.icon} className="w-5 h-5" />
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </nav>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;