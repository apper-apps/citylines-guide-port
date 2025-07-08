import { toast } from 'react-toastify';
import { revenueTrendService } from './revenueTrendService';
import { revenueByCityService } from './revenueByCityService';
import { popularStationService } from './popularStationService';
import { adPerformanceService } from './adPerformanceService';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getAnalytics(timeRange = '30d') {
    await delay(400);
    try {
      // Fetch data from multiple services to build analytics
      const [revenueTrends, revenueByCity, popularStations, adPerformance] = await Promise.all([
        revenueTrendService.getAll(),
        revenueByCityService.getAll(),
        popularStationService.getAll(),
        adPerformanceService.getAll()
      ]);

      // Calculate totals from the data
      const totalRevenue = revenueTrends.reduce((sum, trend) => sum + (trend.revenue || 0), 0);
      const totalAds = adPerformance.length;
      const totalClicks = adPerformance.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
      const totalViews = popularStations.reduce((sum, station) => sum + (station.views || 0), 0);

      // Build analytics response
      const analyticsData = {
        totalVisitors: totalViews,
        pageViews: totalViews * 2.5, // Mock calculation
        adClicks: totalClicks,
        revenue: totalRevenue,
        timeRange,
        chartData: {
          categories: revenueTrends.map(trend => trend.period),
          series: [
            {
              name: "Revenue",
              data: revenueTrends.map(trend => trend.revenue || 0)
            },
            {
              name: "Ads",
              data: revenueTrends.map(trend => trend.ads || 0)
            }
          ]
        },
        topCities: revenueByCity.map(city => ({
          name: city.Name,
          revenue: city.revenue || 0,
          growth: city.growth || 0,
          visitors: (city.revenue || 0) * 2 // Mock calculation
        })),
        popularStations: popularStations.map(station => ({
          name: station.Name,
          line: station.line,
          views: station.views || 0
        })),
        adPerformance: adPerformance.map(ad => ({
          Id: ad.Id,
          title: ad.title,
          views: ad.views || 0,
          clicks: ad.clicks || 0,
          ctr: ad.ctr || 0,
          revenue: ad.revenue || 0
        })),
        revenueTrends: revenueTrends.map(trend => ({
          period: trend.period,
          revenue: trend.revenue || 0,
          ads: trend.ads || 0,
          growth: trend.growth || 0
        }))
      };

      // Adjust data based on time range
      if (timeRange === '7d') {
        analyticsData.totalVisitors = Math.floor(analyticsData.totalVisitors * 0.15);
        analyticsData.pageViews = Math.floor(analyticsData.pageViews * 0.15);
        analyticsData.adClicks = Math.floor(analyticsData.adClicks * 0.15);
        analyticsData.revenue = Math.floor(analyticsData.revenue * 0.15);
      }

      return analyticsData;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics");
      return {
        totalVisitors: 0,
        pageViews: 0,
        adClicks: 0,
        revenue: 0,
        timeRange,
        chartData: { categories: [], series: [] },
        topCities: [],
        popularStations: [],
        adPerformance: [],
        revenueTrends: []
      };
    }
  }
};