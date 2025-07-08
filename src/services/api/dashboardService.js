import mockData from '@/services/mockData/dashboard.json';

export const dashboardService = {
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  claimCity: async (cityData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would make an API call
    return { success: true, city: cityData };
  }
};