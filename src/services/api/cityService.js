import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'city';

export const cityService = {
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
          { field: { Name: "subdomain" } },
          { field: { Name: "status" } },
          { field: { Name: "claimed_at" } },
          { field: { Name: "revenue" } },
          { field: { Name: "stations" } },
          { field: { Name: "listings" } }
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
      console.error("Error fetching cities:", error);
      toast.error("Failed to fetch cities");
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
          { field: { Name: "subdomain" } },
          { field: { Name: "status" } },
          { field: { Name: "claimed_at" } },
          { field: { Name: "revenue" } },
          { field: { Name: "stations" } },
          { field: { Name: "listings" } }
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
      console.error(`Error fetching city with ID ${id}:`, error);
      toast.error("Failed to fetch city");
      return null;
    }
  },

  async create(cityData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cityData.Name,
          subdomain: cityData.subdomain,
          status: cityData.status || 'active',
          claimed_at: new Date().toISOString(),
          revenue: 0,
          stations: 0,
          listings: 0
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
          toast.success('City created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating city:", error);
      toast.error("Failed to create city");
      return null;
    }
  },

  async update(id, cityData) {
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
      if (cityData.Name !== undefined) updateData.Name = cityData.Name;
      if (cityData.subdomain !== undefined) updateData.subdomain = cityData.subdomain;
      if (cityData.status !== undefined) updateData.status = cityData.status;
      if (cityData.claimed_at !== undefined) updateData.claimed_at = cityData.claimed_at;
      if (cityData.revenue !== undefined) updateData.revenue = cityData.revenue;
      if (cityData.stations !== undefined) updateData.stations = cityData.stations;
      if (cityData.listings !== undefined) updateData.listings = cityData.listings;
      
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
          toast.success('City updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating city:", error);
      toast.error("Failed to update city");
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
          toast.success('City deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Failed to delete city");
      return false;
    }
  },

  // Legacy methods for backward compatibility
  async validateSubdomain(subdomain) {
    await delay(300);
    
    if (!subdomain || subdomain.length < 2) {
      return {
        available: false,
        message: 'Subdomain must be at least 2 characters long'
      };
    }

    if (!/^[a-z0-9]+$/.test(subdomain)) {
      return {
        available: false,
        message: 'Subdomain can only contain lowercase letters and numbers'
      };
    }

    // Check if subdomain exists in database
    try {
      const cities = await this.getAll();
      const existingCity = cities.find(city => 
        city.subdomain?.toLowerCase() === subdomain.toLowerCase()
      );

      if (existingCity) {
        return {
          available: false,
          message: `This subdomain is already claimed by ${existingCity.Name}`
        };
      }

      return {
        available: true,
        message: 'Subdomain is available'
      };
    } catch (error) {
      return {
        available: false,
        message: 'Error checking subdomain availability'
      };
    }
  },

  async checkAvailability(subdomain) {
    const validation = await this.validateSubdomain(subdomain);
    return validation.available;
  },

  async releaseCity(id) {
    // This is essentially a delete operation
    return await this.delete(id);
  }
};