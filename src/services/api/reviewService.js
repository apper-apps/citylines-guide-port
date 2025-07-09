import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  // TripAdvisor Reviews
  async getTripAdvisorReviews(listingId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "review_text" } },
          { field: { Name: "rating" } },
          { field: { Name: "author" } },
          { field: { Name: "listing_id" } }
        ],
        where: [
          {
            FieldName: "listing_id",
            Operator: "EqualTo",
            Values: [listingId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('tripadvisor_review', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching TripAdvisor reviews:", error);
      toast.error("Failed to fetch TripAdvisor reviews");
      return [];
    }
  },

  // Google Reviews
  async getGoogleReviews(listingId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "review_text" } },
          { field: { Name: "rating" } },
          { field: { Name: "author" } },
          { field: { Name: "listing_id" } }
        ],
        where: [
          {
            FieldName: "listing_id",
            Operator: "EqualTo",
            Values: [listingId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('google_review', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      toast.error("Failed to fetch Google reviews");
      return [];
    }
  },

  // Create TripAdvisor Review
  async createTripAdvisorReview(reviewData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Review by ${reviewData.author}`,
          review_text: reviewData.review_text,
          rating: parseInt(reviewData.rating),
          author: reviewData.author,
          listing_id: parseInt(reviewData.listing_id)
        }]
      };
      
      const response = await apperClient.createRecord('tripadvisor_review', params);
      
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
          toast.success('TripAdvisor review added successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating TripAdvisor review:", error);
      toast.error("Failed to create TripAdvisor review");
      return null;
    }
  },

  // Create Google Review
  async createGoogleReview(reviewData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Review by ${reviewData.author}`,
          review_text: reviewData.review_text,
          rating: parseInt(reviewData.rating),
          author: reviewData.author,
          listing_id: parseInt(reviewData.listing_id)
        }]
      };
      
      const response = await apperClient.createRecord('google_review', params);
      
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
          toast.success('Google review added successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating Google review:", error);
      toast.error("Failed to create Google review");
      return null;
    }
  },

  // Delete Review
  async deleteReview(reviewId, reviewType) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const tableName = reviewType === 'tripadvisor' ? 'tripadvisor_review' : 'google_review';
      
      const params = {
        RecordIds: [reviewId]
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
          toast.success('Review deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    }
  }
};