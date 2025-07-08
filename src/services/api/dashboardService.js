import { toast } from 'react-toastify';
import { cityService } from './cityService';
import { adsService } from './adsService';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  async getDashboardData() {
    await delay(300);
    try {
      // Fetch data from multiple services to build dashboard
      const [cities, adsData] = await Promise.all([
        cityService.getAll(),
        adsService.getAll()
      ]);

      // Calculate dashboard metrics
      const totalCities = cities.length;
      const activeCities = cities.filter(city => city.status === 'active').length;
      const totalRevenue = cities.reduce((sum, city) => sum + (city.revenue || 0), 0);
      const monthlyRevenue = totalRevenue * 0.25; // Mock calculation
      const grossRevenue = totalRevenue * 1.15; // Mock calculation
      const platformFee = grossRevenue * 0.15; // Mock calculation
      const netRevenue = grossRevenue - platformFee;
      const activeListings = cities.reduce((sum, city) => sum + (city.listings || 0), 0);

      // Mock available cities (would come from a different source in real app)
      const availableCities = [
        "Singapore", "Tokyo", "London", "New York", "Paris", 
        "Hong Kong", "Seoul", "Bangkok", "Sydney", "Berlin"
      ];

      return {
        totalCities,
        activeCities,
        totalRevenue,
        monthlyRevenue,
        grossRevenue,
        platformFee,
        netRevenue,
        activeListings,
        cities: cities.map(city => ({
          Id: city.Id,
          name: city.Name,
          subdomain: city.subdomain,
          status: city.status,
          revenue: city.revenue || 0,
          stations: city.stations || 0,
          listings: city.listings || 0
        })),
        availableCities
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
      return {
        totalCities: 0,
        activeCities: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        grossRevenue: 0,
        platformFee: 0,
        netRevenue: 0,
        activeListings: 0,
        cities: [],
        availableCities: []
      };
    }
  },

  async claimCity(cityData) {
    await delay(500);
    try {
      const result = await cityService.create(cityData);
      if (result) {
        toast.success('City claimed successfully');
        return { success: true, city: result };
      }
      return { success: false, message: 'Failed to claim city' };
    } catch (error) {
      console.error("Error claiming city:", error);
      toast.error("Failed to claim city");
      return { success: false, message: error.message };
    }
  }
};