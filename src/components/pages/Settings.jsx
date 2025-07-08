import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import SubscriptionPlanSelector from '@/components/organisms/SubscriptionPlanSelector';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { settingsService } from '@/services/api/settingsService';

const Settings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await settingsService.getSettings();
      setData(settingsData);
      setFormData({
        name: settingsData.user.name,
        email: settingsData.user.email,
        company: settingsData.user.company || '',
        website: settingsData.user.website || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateProfile(formData);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlanChange = async (plan) => {
    try {
      await settingsService.updateSubscription(plan);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'subscription', label: 'Subscription', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
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
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-600">Update your avatar</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <Input
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit">
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <p className="text-sm text-gray-600">
                  You are currently on the {data.user.subscriptionTier} plan
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${data.subscription.price}</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.subscription.usage.cities}</p>
                  <p className="text-sm text-gray-600">Cities Used</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{data.subscription.usage.ads}</p>
                  <p className="text-sm text-gray-600">Active Ads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{data.subscription.usage.listings}</p>
                  <p className="text-sm text-gray-600">Listings</p>
                </div>
              </div>
            </div>
          </Card>

          <SubscriptionPlanSelector
            currentPlan={data.user.subscriptionTier}
            onPlanChange={handlePlanChange}
          />
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
          <div className="space-y-6">
            {data.notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notification.enabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notification.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
            <form className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
              />
              <Input
                label="New Password"
                type="password"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
              />
              <Button type="submit">
                <ApperIcon name="Lock" className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Enable 2FA for additional security</p>
                <p className="text-sm text-gray-600">Secure your account with an authenticator app</p>
              </div>
              <Button variant="outline">
                <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;