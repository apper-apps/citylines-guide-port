import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'ad_performance';

export const adPerformanceService = {
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
          { field: { Name: "views" } },
          { field: { Name: "clicks" } },
          { field: { Name: "ctr" } },
          { field: { Name: "revenue" } }
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
      console.error("Error fetching ad performance:", error);
      toast.error("Failed to fetch ad performance");
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
          { field: { Name: "views" } },
          { field: { Name: "clicks" } },
          { field: { Name: "ctr" } },
          { field: { Name: "revenue" } }
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
      console.error(`Error fetching ad performance with ID ${id}:`, error);
      toast.error("Failed to fetch ad performance");
      return null;
    }
  },

  async create(performanceData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: performanceData.Name,
          title: performanceData.title,
          views: performanceData.views,
          clicks: performanceData.clicks,
          ctr: performanceData.ctr,
          revenue: performanceData.revenue
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
          toast.success('Ad performance created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating ad performance:", error);
      toast.error("Failed to create ad performance");
      return null;
    }
  },

  async update(id, performanceData) {
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
      if (performanceData.Name !== undefined) updateData.Name = performanceData.Name;
      if (performanceData.title !== undefined) updateData.title = performanceData.title;
      if (performanceData.views !== undefined) updateData.views = performanceData.views;
      if (performanceData.clicks !== undefined) updateData.clicks = performanceData.clicks;
      if (performanceData.ctr !== undefined) updateData.ctr = performanceData.ctr;
      if (performanceData.revenue !== undefined) updateData.revenue = performanceData.revenue;
      
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
          toast.success('Ad performance updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating ad performance:", error);
      toast.error("Failed to update ad performance");
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
          toast.success('Ad performance deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting ad performance:", error);
      toast.error("Failed to delete ad performance");
      return false;
    }
  }
};