import mockData from '@/services/mockData/admin.json';

export const adminService = {
  getAdminData: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockData;
  },

  updateUser: async (userId, userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockData.users.findIndex(user => user.Id === userId);
    if (index !== -1) {
      mockData.users[index] = { ...mockData.users[index], ...userData };
      return mockData.users[index];
    }
    throw new Error('User not found');
  },

  deleteUser: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.users.findIndex(user => user.Id === userId);
    if (index !== -1) {
      const deletedUser = mockData.users.splice(index, 1)[0];
      return deletedUser;
    }
    throw new Error('User not found');
  },

  releaseCity: async (cityId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockData.cities.findIndex(city => city.Id === cityId);
    if (index !== -1) {
      mockData.cities[index].status = 'released';
      return mockData.cities[index];
    }
    throw new Error('City not found');
  }
};