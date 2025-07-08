import { toast } from 'react-toastify';
import { authService } from './authService';
import { cityService } from './cityService';
import { recentActivityService } from './recentActivityService';
import { topCityService } from './topCityService';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  async getAdminData() {
    await delay(400);
    try {
      // Fetch data from multiple services to build admin dashboard
      const [users, cities, recentActivity, topCities] = await Promise.all([
        authService.getAll(),
        cityService.getAll(),
        recentActivityService.getAll(),
        topCityService.getAll()
      ]);

      // Calculate admin metrics
      const totalUsers = users.length;
      const activeCities = cities.filter(city => city.status === 'active').length;
      const platformRevenue = cities.reduce((sum, city) => sum + (city.revenue || 0), 0) * 0.15; // 15% platform fee
      const activeSubscriptions = users.filter(user => user.subscription_tier && user.subscription_tier !== 'starter').length;

      return {
        totalUsers,
        activeCities,
        platformRevenue,
        activeSubscriptions,
        recentActivity: recentActivity.map(activity => ({
          Id: activity.Id,
          action: activity.action,
          user: activity.user,
          time: activity.time,
          icon: activity.icon
        })),
        topCitiesByRevenue: topCities.map(city => ({
          name: city.Name,
          revenue: city.revenue || 0,
          platformFee: city.platform_fee || 0,
          owner: 'Unknown' // Would need to join with user data
        })),
        users: users.map(user => ({
          Id: user.Id,
          name: user.Name,
          email: user.email,
          subscriptionTier: user.subscription_tier,
          cities: 0, // Would need to count cities per user
          revenue: 0, // Would need to calculate revenue per user
          status: 'active'
        })),
        cities: cities.map(city => ({
          Id: city.Id,
          name: city.Name,
          owner: 'Unknown', // Would need to join with user data
          subdomain: city.subdomain,
          listings: city.listings || 0,
          revenue: city.revenue || 0,
          status: city.status
        }))
      };
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to fetch admin data");
      return {
        totalUsers: 0,
        activeCities: 0,
        platformRevenue: 0,
        activeSubscriptions: 0,
        recentActivity: [],
        topCitiesByRevenue: [],
        users: [],
        cities: []
      };
    }
  },

  async updateUser(userId, userData) {
    await delay(500);
    try {
      const result = await authService.update(userId, userData);
      if (result) {
        toast.success('User updated successfully');
        return {
          Id: result.Id,
          name: result.Name,
          email: result.email,
          subscriptionTier: result.subscription_tier,
          cities: 0, // Would need to count cities per user
          revenue: 0, // Would need to calculate revenue per user
          status: 'active'
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
      throw error;
    }
  },

  async deleteUser(userId) {
    await delay(300);
    try {
      const result = await authService.delete(userId);
      if (result) {
        toast.success('User deleted successfully');
        return { success: true };
      }
      return null;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      throw error;
    }
  },

  async releaseCity(cityId) {
    await delay(500);
    try {
      const result = await cityService.update(cityId, { status: 'released' });
      if (result) {
        toast.success('City released successfully');
        return {
          Id: result.Id,
          name: result.Name,
          owner: 'Unknown', // Would need to join with user data
          subdomain: result.subdomain,
          listings: result.listings || 0,
          revenue: result.revenue || 0,
          status: result.status
        };
      }
      return null;
    } catch (error) {
      console.error("Error releasing city:", error);
      toast.error("Failed to release city");
      throw error;
    }
  }
};