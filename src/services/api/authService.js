import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'app_User';

export const authService = {
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
          { field: { Name: "email" } },
          { field: { Name: "email_verified" } },
          { field: { Name: "subscription_tier" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_login" } },
          { field: { Name: "billing_period" } },
          { field: { Name: "subscription_updated_at" } }
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
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
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
          { field: { Name: "email" } },
          { field: { Name: "email_verified" } },
          { field: { Name: "subscription_tier" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_login" } },
          { field: { Name: "billing_period" } },
          { field: { Name: "subscription_updated_at" } }
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
      console.error(`Error fetching user with ID ${id}:`, error);
      toast.error("Failed to fetch user");
      return null;
    }
  },

  async create(userData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: userData.Name,
          email: userData.email,
          password: userData.password,
          email_verified: userData.email_verified || false,
          subscription_tier: userData.subscription_tier || 'starter',
          created_at: new Date().toISOString(),
          last_login: null,
          verification_token: userData.verification_token || this.generateToken(),
          billing_period: userData.billing_period || 'monthly',
          subscription_updated_at: new Date().toISOString()
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
          toast.success('User created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
      return null;
    }
  },

  async update(id, userData) {
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
      if (userData.Name !== undefined) updateData.Name = userData.Name;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.password !== undefined) updateData.password = userData.password;
      if (userData.email_verified !== undefined) updateData.email_verified = userData.email_verified;
      if (userData.subscription_tier !== undefined) updateData.subscription_tier = userData.subscription_tier;
      if (userData.last_login !== undefined) updateData.last_login = userData.last_login;
      if (userData.verification_token !== undefined) updateData.verification_token = userData.verification_token;
      if (userData.reset_token !== undefined) updateData.reset_token = userData.reset_token;
      if (userData.reset_token_expires !== undefined) updateData.reset_token_expires = userData.reset_token_expires;
      if (userData.billing_period !== undefined) updateData.billing_period = userData.billing_period;
      if (userData.subscription_updated_at !== undefined) updateData.subscription_updated_at = userData.subscription_updated_at;
      
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
          toast.success('User updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
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
          toast.success('User deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      return false;
    }
  },

  // Generate random token
  generateToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  }
};