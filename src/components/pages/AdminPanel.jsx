import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import StatsCard from '@/components/molecules/StatsCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { adminService } from '@/services/api/adminService';

const AdminPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminData = await adminService.getAdminData();
      setData(adminData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'cities', label: 'Cities', icon: 'Globe' },
    { id: 'revenue', label: 'Revenue', icon: 'DollarSign' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Platform management and oversight</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="accent">
            <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
            Admin Actions
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={data.totalUsers}
              icon="Users"
              color="blue"
              change="+12%"
              trend="up"
            />
            <StatsCard
              title="Active Cities"
              value={data.activeCities}
              icon="Globe"
              color="green"
              change="+8%"
              trend="up"
            />
            <StatsCard
              title="Platform Revenue"
              value={`$${data.platformRevenue}`}
              icon="DollarSign"
              color="amber"
              change="+15%"
              trend="up"
            />
            <StatsCard
              title="Active Subscriptions"
              value={data.activeSubscriptions}
              icon="CreditCard"
              color="green"
              change="+5%"
              trend="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {data.recentActivity.map((activity) => (
                  <div key={activity.Id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ApperIcon name={activity.icon} className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities by Revenue</h3>
              <div className="space-y-3">
                {data.topCitiesByRevenue.map((city, index) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 font-medium text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{city.name}</p>
                        <p className="text-sm text-gray-600">{city.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${city.revenue}</p>
                      <p className="text-sm text-gray-600">{city.platformFee} fee</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SearchBar placeholder="Search users..." />
            <Button variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cities</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.subscriptionTier === 'enterprise' ? 'accent' : 'primary'}>
                          {user.subscriptionTier}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{user.cities}</td>
                      <td className="py-3 px-4 text-gray-900">${user.revenue}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Cities Tab */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SearchBar placeholder="Search cities..." />
            <Button variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">City</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Subdomain</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cities.map((city) => (
                    <tr key={city.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{city.name}</p>
                          <p className="text-sm text-gray-600">{city.listings} listings</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{city.owner}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{city.subdomain}.citylinesguide.com</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">${city.revenue}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={city.status === 'active' ? 'success' : 'warning'}>
                          {city.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <ApperIcon name="ExternalLink" className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ApperIcon name="Settings" className="w-4 h-4" />
                          </Button>
                          <Button variant="danger" size="sm">
                            <ApperIcon name="Trash" className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;