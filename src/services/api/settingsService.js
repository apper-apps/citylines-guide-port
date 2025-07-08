import mockData from '@/services/mockData/settings.json';

export const settingsService = {
  getSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockData.user = { ...mockData.user, ...profileData };
    return mockData.user;
  },

  updateSubscription: async (plan) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockData.user.subscriptionTier = plan;
    return mockData.user;
  },

  updateNotifications: async (notifications) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockData.notifications = notifications;
    return mockData.notifications;
  }
};