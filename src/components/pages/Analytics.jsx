import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import StatsCard from '@/components/molecules/StatsCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { analyticsService } from '@/services/api/analyticsService';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await analyticsService.getAnalytics(timeRange);
      setData(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    colors: ['#2563EB', '#10B981', '#F59E0B'],
    xaxis: {
      categories: data?.chartData?.categories || [],
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: {
      labels: { style: { fontSize: '12px' } }
    },
    grid: { strokeDashArray: 3 },
    legend: { position: 'top' }
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your performance and revenue</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Visitors"
          value={data.totalVisitors}
          change="+12%"
          trend="up"
          icon="Users"
          color="blue"
        />
        <StatsCard
          title="Page Views"
          value={data.pageViews}
          change="+8%"
          trend="up"
          icon="Eye"
          color="green"
        />
        <StatsCard
          title="Ad Clicks"
          value={data.adClicks}
          change="+15%"
          trend="up"
          icon="MousePointer"
          color="amber"
        />
        <StatsCard
          title="Revenue"
          value={`$${data.revenue}`}
          change="+22%"
          trend="up"
          icon="DollarSign"
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitors & Revenue</h3>
          <Chart
            options={chartOptions}
            series={data.chartData.series}
            type="area"
            height={300}
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
          <div className="space-y-4">
            {data.topCities.map((city, index) => (
              <div key={city.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{city.name}</p>
                    <p className="text-sm text-gray-600">{city.visitors} visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${city.revenue}</p>
                  <p className="text-sm text-gray-600">{city.growth > 0 ? '+' : ''}{city.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Stations</h3>
          <div className="space-y-3">
            {data.popularStations.map((station, index) => (
              <div key={station.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{station.name}</p>
                    <p className="text-sm text-gray-600">{station.line}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">{station.views}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Performance</h3>
          <div className="space-y-3">
            {data.adPerformance.map((ad) => (
              <div key={ad.Id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{ad.title}</p>
                  <p className="text-sm text-gray-600">{ad.ctr}% CTR</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{ad.views} views</span>
                  <span>{ad.clicks} clicks</span>
                  <span>${ad.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="space-y-3">
            {data.revenueTrends.map((trend) => (
              <div key={trend.period} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{trend.period}</p>
                  <p className="text-sm text-gray-600">{trend.ads} ads</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${trend.revenue}</p>
                  <div className="flex items-center text-sm">
                    <ApperIcon 
                      name={trend.growth > 0 ? 'TrendingUp' : 'TrendingDown'} 
                      className={`w-3 h-3 mr-1 ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`} 
                    />
                    <span className={trend.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {trend.growth > 0 ? '+' : ''}{trend.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;