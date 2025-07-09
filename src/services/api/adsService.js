import { toast } from "react-toastify";
import React from "react";

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'ad';

export const adsService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "placement" } },
          { field: { Name: "status" } },
          { field: { Name: "views" } },
          { field: { Name: "clicks" } },
          { field: { Name: "revenue" } },
          { field: { Name: "city" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Failed to fetch ads");
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "placement" } },
          { field: { Name: "status" } },
          { field: { Name: "views" } },
          { field: { Name: "clicks" } },
          { field: { Name: "revenue" } },
          { field: { Name: "city" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching ad with ID ${id}:`, error);
      toast.error("Failed to fetch ad");
      return null;
    }
  },

  async create(adData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: adData.Name,
          title: adData.title,
          placement: adData.placement,
          status: adData.status || 'active',
          views: adData.views || 0,
          clicks: adData.clicks || 0,
          revenue: adData.revenue || 0,
          city: adData.city
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Ad created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("Failed to create ad");
      return null;
    }
  },

  async update(id, adData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (adData.Name !== undefined) updateData.Name = adData.Name;
      if (adData.title !== undefined) updateData.title = adData.title;
      if (adData.placement !== undefined) updateData.placement = adData.placement;
      if (adData.status !== undefined) updateData.status = adData.status;
      if (adData.views !== undefined) updateData.views = adData.views;
      if (adData.clicks !== undefined) updateData.clicks = adData.clicks;
      if (adData.revenue !== undefined) updateData.revenue = adData.revenue;
      if (adData.city !== undefined) updateData.city = adData.city;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Ad updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating ad:", error);
      toast.error("Failed to update ad");
      return null;
    }
  },

  async delete(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Ad deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Failed to delete ad");
      return false;
    }
},

  // Aggregate ads data for revenue dashboard
  async getAdsData() {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "placement" } },
          { field: { Name: "status" } },
          { field: { Name: "views" } },
          { field: { Name: "clicks" } },
          { field: { Name: "revenue" } },
          { field: { Name: "city" } },
          { field: { Name: "contentType" } },
          { field: { Name: "content" } },
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return {
          totalRevenue: 0,
          totalAds: 0,
          activeAds: 0,
          ads: []
        };
      }
      
      const ads = response.data || [];
      
      // Calculate aggregate metrics
      const totalRevenue = ads.reduce((sum, ad) => sum + (ad.revenue || 0), 0);
      const totalAds = ads.length;
      const activeAds = ads.filter(ad => ad.status === 'active').length;
      
      // Calculate additional metrics
      const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
      const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
      const averageCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
      
      const result = {
        totalRevenue,
        totalAds,
        activeAds,
        totalViews,
        totalClicks,
        averageCTR: parseFloat(averageCTR.toFixed(2)),
        ads: ads.map(ad => ({
          Id: ad.Id,
          Name: ad.Name,
          title: ad.title,
          placement: ad.placement,
          status: ad.status,
          views: ad.views || 0,
          clicks: ad.clicks || 0,
          revenue: ad.revenue || 0,
          city: ad.city,
          contentType: ad.contentType,
          content: ad.content,
          startDate: ad.startDate,
          endDate: ad.endDate,
          ctr: ad.views > 0 ? parseFloat(((ad.clicks || 0) / ad.views * 100).toFixed(2)) : 0
        }))
      };
      
      return result;
    } catch (error) {
      console.error("Error fetching ads data:", error);
      toast.error("Failed to fetch ads data");
      return {
        totalRevenue: 0,
        totalAds: 0,
        activeAds: 0,
        ads: []
};
    }
  },

  // Legacy methods for backward compatibility
  async createAd(adData) {
    return await this.create(adData);
  },

  async updateAd(id, adData) {
    return await this.update(id, adData);
  }
};