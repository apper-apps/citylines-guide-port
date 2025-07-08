import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'recent_activity';

export const recentActivityService = {
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
          { field: { Name: "user" } },
          { field: { Name: "time" } },
          { field: { Name: "icon" } },
          { field: { Name: "action" } }
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
      console.error("Error fetching recent activities:", error);
      toast.error("Failed to fetch recent activities");
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
          { field: { Name: "user" } },
          { field: { Name: "time" } },
          { field: { Name: "icon" } },
          { field: { Name: "action" } }
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
      console.error(`Error fetching recent activity with ID ${id}:`, error);
      toast.error("Failed to fetch recent activity");
      return null;
    }
  },

  async create(activityData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: activityData.Name,
          user: activityData.user,
          time: activityData.time,
          icon: activityData.icon,
          action: activityData.action
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
          toast.success('Recent activity created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating recent activity:", error);
      toast.error("Failed to create recent activity");
      return null;
    }
  },

  async update(id, activityData) {
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
      if (activityData.Name !== undefined) updateData.Name = activityData.Name;
      if (activityData.user !== undefined) updateData.user = activityData.user;
      if (activityData.time !== undefined) updateData.time = activityData.time;
      if (activityData.icon !== undefined) updateData.icon = activityData.icon;
      if (activityData.action !== undefined) updateData.action = activityData.action;
      
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
          toast.success('Recent activity updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating recent activity:", error);
      toast.error("Failed to update recent activity");
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
          toast.success('Recent activity deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting recent activity:", error);
      toast.error("Failed to delete recent activity");
      return false;
    }
  }
};