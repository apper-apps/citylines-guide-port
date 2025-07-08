import mockData from '@/services/mockData/analytics.json';

export const analyticsService = {
  getAnalytics: async (timeRange = '30d') => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      ...mockData,
      timeRange,
      // Simulate different data based on time range
      totalVisitors: timeRange === '7d' ? 1250 : mockData.totalVisitors,
      pageViews: timeRange === '7d' ? 5400 : mockData.pageViews,
      adClicks: timeRange === '7d' ? 320 : mockData.adClicks,
      revenue: timeRange === '7d' ? 280 : mockData.revenue
    };
  }
};