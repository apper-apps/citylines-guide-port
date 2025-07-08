import mockData from '@/services/mockData/cities.json';

export const cityService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockData.find(city => city.Id === id);
  },

  create: async (cityData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCity = {
      ...cityData,
      Id: Math.max(...mockData.map(c => c.Id)) + 1,
      claimedAt: new Date().toISOString(),
      revenue: 0,
      stations: 0,
      listings: 0
    };
    mockData.push(newCity);
    return newCity;
  },

  update: async (id, cityData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(city => city.Id === id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...cityData };
      return mockData[index];
    }
    throw new Error('City not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(city => city.Id === id);
    if (index !== -1) {
      const deletedCity = mockData.splice(index, 1)[0];
      return deletedCity;
    }
    throw new Error('City not found');
  }
};