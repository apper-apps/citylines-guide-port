import mockData from '@/services/mockData/ads.json';

export const adsService = {
  getAdsData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  createAd: async (adData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAd = {
      ...adData,
      Id: Math.max(...mockData.ads.map(a => a.Id)) + 1,
      views: 0,
      clicks: 0,
      revenue: 0,
      status: 'active'
    };
    mockData.ads.push(newAd);
    return newAd;
  },

  updateAd: async (id, adData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.ads.findIndex(ad => ad.Id === id);
    if (index !== -1) {
      mockData.ads[index] = { ...mockData.ads[index], ...adData };
      return mockData.ads[index];
    }
    throw new Error('Ad not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.ads.findIndex(ad => ad.Id === id);
    if (index !== -1) {
      const deletedAd = mockData.ads.splice(index, 1)[0];
      return deletedAd;
    }
    throw new Error('Ad not found');
  }
};