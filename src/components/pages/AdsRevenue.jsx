import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import RevenueCard from '@/components/molecules/RevenueCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { adsService } from '@/services/api/adsService';

const AdsRevenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const adsData = await adsService.getAdsData();
      setData(adsData);
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
    { id: 'ads', label: 'Manage Ads', icon: 'Target' },
    { id: 'revenue', label: 'Revenue', icon: 'DollarSign' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ads & Revenue</h1>
          <p className="text-gray-600">Manage your advertising and track revenue</p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Ad
        </Button>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevenueCard
              title="Total Revenue"
              amount={data.totalRevenue}
              percentage={12}
              trend="up"
            />
            <RevenueCard
              title="This Month"
              amount={data.monthlyRevenue}
              percentage={8}
              trend="up"
            />
            <RevenueCard
              title="Platform Fee"
              amount={data.platformFee}
              percentage={-2}
              trend="down"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Ads</h3>
              <div className="space-y-3">
                {data.activeAds.map(ad => (
                  <div key={ad.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{ad.title}</p>
                      <p className="text-sm text-gray-600">{ad.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{ad.views} views</p>
                      <p className="text-sm text-gray-600">{ad.clicks} clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">First $100 (0% fee)</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">$100-$500 (10% fee)</span>
                  <span className="font-medium">$360.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">$500+ (15% fee)</span>
                  <span className="font-medium">$425.00</span>
                </div>
                <hr />
                <div className="flex justify-between items-center font-semibold">
                  <span>Your Earnings</span>
                  <span className="text-green-600">${data.netRevenue}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Ads Management Tab */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          {data.ads.length === 0 ? (
            <Empty
              title="No ads created"
              message="Create your first banner ad to start generating revenue."
              actionLabel="Create Ad"
              onAction={() => console.log('Create ad')}
              icon="Target"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.ads.map(ad => (
                <Card key={ad.Id} className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                        <p className="text-sm text-gray-600">{ad.placement}</p>
                      </div>
                      <Badge variant={ad.status === 'active' ? 'success' : 'warning'}>
                        {ad.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                        {ad.views}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="MousePointer" className="w-4 h-4 mr-1" />
                        {ad.clicks}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
                        ${ad.revenue}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="BarChart3" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by City</h3>
              <div className="space-y-3">
                {data.revenueByCity.map(city => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{city.name}</p>
                      <p className="text-sm text-gray-600">{city.ads} ads</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${city.revenue}</p>
                      <p className="text-sm text-gray-600">{city.growth > 0 ? '+' : ''}{city.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
              <div className="space-y-3">
                {data.payouts.map(payout => (
                  <div key={payout.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payout.period}</p>
                      <p className="text-sm text-gray-600">{payout.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${payout.amount}</p>
                      <Badge variant={payout.status === 'paid' ? 'success' : 'warning'}>
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsRevenue;