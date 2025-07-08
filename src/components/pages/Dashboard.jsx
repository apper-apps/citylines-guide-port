import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatsCard from '@/components/molecules/StatsCard';
import RevenueCard from '@/components/molecules/RevenueCard';
import CityCard from '@/components/molecules/CityCard';
import CityClaimModal from '@/components/organisms/CityClaimModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { dashboardService } from '@/services/api/dashboardService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimCity = async (cityData) => {
    try {
      await dashboardService.claimCity(cityData);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your cities and revenue</p>
        </div>
        <Button onClick={() => setShowClaimModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Claim City
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cities"
          value={data.totalCities}
          icon="Building"
          color="blue"
        />
        <StatsCard
          title="Active Listings"
          value={data.activeListings}
          icon="MapPin"
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${data.totalRevenue}`}
          icon="DollarSign"
          color="amber"
          change="+12%"
          trend="up"
        />
        <StatsCard
          title="This Month"
          value={`$${data.monthlyRevenue}`}
          icon="TrendingUp"
          color="green"
          change="+8%"
          trend="up"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard
          title="Gross Revenue"
          amount={data.grossRevenue}
          percentage={15}
          trend="up"
        />
        <RevenueCard
          title="Platform Fee"
          amount={data.platformFee}
          percentage={5}
          trend="up"
        />
        <RevenueCard
          title="Your Earnings"
          amount={data.netRevenue}
          percentage={18}
          trend="up"
        />
      </div>

      {/* Recent Cities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Cities</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        {data.cities.length === 0 ? (
          <Empty
            title="No cities claimed yet"
            message="Start by claiming your first city to begin building your transit tourism directory."
            actionLabel="Claim Your First City"
            onAction={() => setShowClaimModal(true)}
            icon="Building"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cities.map((city) => (
              <CityCard
                key={city.Id}
                city={city}
                onEdit={() => console.log('Edit city:', city)}
                onViewSite={() => window.open(`https://${city.subdomain}.citylinesguide.com`, '_blank')}
                onManageAds={() => console.log('Manage ads:', city)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Directory Builder</h3>
              <p className="text-sm text-gray-600">Add stations, attractions, and listings</p>
            </div>
            <Button variant="outline" size="sm">
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Ad Manager</h3>
              <p className="text-sm text-gray-600">Create and manage banner ads</p>
            </div>
            <Button variant="outline" size="sm">
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <CityClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onClaim={handleClaimCity}
        availableCities={data.availableCities}
      />
    </div>
  );
};

export default Dashboard;