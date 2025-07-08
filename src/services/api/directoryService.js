import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";
import { stationService } from "@/services/api/stationService";
import { cityService } from "@/services/api/cityService";
import { listingService } from "@/services/api/listingService";

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const directoryService = {
  async getBuilderData() {
    await delay(300);
try {
      // Fetch data from multiple services to build directory
      const [cities, stations, listings] = await Promise.all([
        cityService.getAll(),
        stationService.getAll(),
        listingService.getAll()
      ]);

      return {
        cities: cities.map(city => ({
          Id: city.Id,
          name: city.Name,
          subdomain: city.subdomain,
          status: city.status,
          revenue: city.revenue || 0,
          stations: city.stations || 0,
          listings: city.listings || 0
        })),
        stations: stations.map(station => ({
          Id: station.Id,
          cityId: station.city_id?.Id || station.city_id,
          name: station.Name,
          line: station.line,
          description: station.description,
          order: station.order
        })),
        listings: listings.map(listing => ({
          Id: listing.Id,
          cityId: listing.city_id?.Id || listing.city_id,
          stationId: listing.station_id?.Id || listing.station_id,
          type: listing.type,
          title: listing.title,
          description: listing.description,
          imageUrl: listing.image_url,
          link: listing.link,
isFeatured: listing.is_featured === "featured",
          isSponsored: listing.is_sponsored === "sponsored"
        })),
events: [] // Events are now handled by eventListingService
      };
    } catch (error) {
      console.error("Error fetching builder data:", error);
      toast.error("Failed to fetch builder data");
      return {
        cities: [],
        stations: [],
        listings: [],
        events: []
      };
    }
  },

  async createStation(stationData) {
    await delay(500);
    try {
      const result = await stationService.create({
        Name: stationData.name,
        line: stationData.line,
        description: stationData.description,
        order: stationData.order,
        city_id: stationData.cityId
      });
      
      if (result) {
        toast.success('Station created successfully');
        return {
          Id: result.Id,
          cityId: result.city_id?.Id || result.city_id,
          name: result.Name,
          line: result.line,
          description: result.description,
          order: result.order
        };
      }
      return null;
    } catch (error) {
      console.error("Error creating station:", error);
      toast.error("Failed to create station");
      return null;
    }
  },

  async createListing(listingData) {
    await delay(500);
    try {
      const result = await listingService.create({
        Name: listingData.title,
        type: listingData.type,
        title: listingData.title,
        description: listingData.description,
        image_url: listingData.imageUrl,
        link: listingData.link,
        is_featured: listingData.isFeatured,
        is_sponsored: listingData.isSponsored,
        city_id: listingData.cityId,
        station_id: listingData.stationId
      });
      
      if (result) {
        toast.success('Listing created successfully');
        return {
          Id: result.Id,
          cityId: result.city_id?.Id || result.city_id,
          stationId: result.station_id?.Id || result.station_id,
          type: result.type,
          title: result.title,
          description: result.description,
          imageUrl: result.image_url,
          link: result.link,
          isFeatured: result.is_featured === "featured",
          isSponsored: result.is_sponsored === "sponsored"
        };
      }
      return null;
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
      return null;
    }
  },

  async updateStation(id, stationData) {
    await delay(300);
    try {
      const result = await stationService.update(id, {
        Name: stationData.name,
        line: stationData.line,
        description: stationData.description,
        order: stationData.order,
        city_id: stationData.cityId
      });
      
      if (result) {
        toast.success('Station updated successfully');
        return {
          Id: result.Id,
          cityId: result.city_id?.Id || result.city_id,
          name: result.Name,
          line: result.line,
          description: result.description,
          order: result.order
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating station:", error);
      toast.error("Failed to update station");
      return null;
    }
  },

  async updateListing(id, listingData) {
    await delay(300);
    try {
      const result = await listingService.update(id, {
        Name: listingData.title,
        type: listingData.type,
        title: listingData.title,
        description: listingData.description,
        image_url: listingData.imageUrl,
        link: listingData.link,
        is_featured: listingData.isFeatured,
        is_sponsored: listingData.isSponsored,
        city_id: listingData.cityId,
        station_id: listingData.stationId
      });
      
      if (result) {
        toast.success('Listing updated successfully');
        return {
          Id: result.Id,
          cityId: result.city_id?.Id || result.city_id,
          stationId: result.station_id?.Id || result.station_id,
          type: result.type,
          title: result.title,
          description: result.description,
          imageUrl: result.image_url,
          link: result.link,
          isFeatured: result.is_featured === "featured",
          isSponsored: result.is_sponsored === "sponsored"
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
      return null;
    }
  },

  async delete(id) {
    await delay(300);
    try {
      // Try to delete from stations first
      const stationResult = await stationService.delete(id);
      if (stationResult) {
        toast.success('Station deleted successfully');
        return { success: true, type: 'station' };
      }
      
      // Try to delete from listings
      const listingResult = await listingService.delete(id);
      if (listingResult) {
        toast.success('Listing deleted successfully');
        return { success: true, type: 'listing' };
      }
      
      throw new Error('Item not found');
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
      return { success: false, message: error.message };
    }
},

  async deleteListing(id) {
    await delay(300);
    try {
      const result = await listingService.delete(id);
      if (result) {
        toast.success('Listing deleted successfully');
        return { success: true, type: 'listing' };
      }
      throw new Error('Listing not found');
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
      return { success: false, message: error.message };
    }
  },

// Event operations are now handled by eventListingService
  // These methods are deprecated and should not be used
};