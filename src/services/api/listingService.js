import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'listing';

export const listingService = {
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "link" } },
          { field: { Name: "is_featured" } },
          { field: { Name: "is_sponsored" } },
          { 
            field: { Name: "city_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "station_id" },
            referenceField: { field: { Name: "Name" } }
          }
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
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch listings");
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "link" } },
          { field: { Name: "is_featured" } },
          { field: { Name: "is_sponsored" } },
          { 
            field: { Name: "city_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "station_id" },
            referenceField: { field: { Name: "Name" } }
          }
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
      console.error(`Error fetching listing with ID ${id}:`, error);
      toast.error("Failed to fetch listing");
      return null;
    }
  },

  async create(listingData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: listingData.Name,
          type: listingData.type,
          title: listingData.title,
          description: listingData.description,
          image_url: listingData.image_url,
          link: listingData.link,
          is_featured: listingData.is_featured ? "featured" : "",
          is_sponsored: listingData.is_sponsored ? "sponsored" : "",
          city_id: parseInt(listingData.city_id),
          station_id: parseInt(listingData.station_id)
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
          toast.success('Listing created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
      return null;
    }
  },

  async update(id, listingData) {
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
      if (listingData.Name !== undefined) updateData.Name = listingData.Name;
      if (listingData.type !== undefined) updateData.type = listingData.type;
      if (listingData.title !== undefined) updateData.title = listingData.title;
      if (listingData.description !== undefined) updateData.description = listingData.description;
      if (listingData.image_url !== undefined) updateData.image_url = listingData.image_url;
      if (listingData.link !== undefined) updateData.link = listingData.link;
      if (listingData.is_featured !== undefined) updateData.is_featured = listingData.is_featured ? "featured" : "";
      if (listingData.is_sponsored !== undefined) updateData.is_sponsored = listingData.is_sponsored ? "sponsored" : "";
      if (listingData.city_id !== undefined) updateData.city_id = parseInt(listingData.city_id);
      if (listingData.station_id !== undefined) updateData.station_id = parseInt(listingData.station_id);
      
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
          toast.success('Listing updated successfully');
          return successfulUpdates[0].data;
        }
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
          toast.success('Listing deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
      return false;
    }
  }
};