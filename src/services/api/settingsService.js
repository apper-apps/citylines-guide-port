import { toast } from 'react-toastify';
import { authService } from './authService';
import { notificationService } from './notificationService';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings() {
    await delay(300);
    try {
      // Get current user data and notifications
      const [notifications] = await Promise.all([
        notificationService.getAll()
      ]);

      // Mock user data - in real app, this would come from authenticated user
      const mockUser = {
        Id: 1,
        name: "John Chen",
        email: "john@example.com",
        company: "Travel Guide Co",
        website: "https://travelguide.com",
        subscriptionTier: "pro",
        subscriptionStatus: "active",
        emailVerified: true,
        createdAt: "2024-01-01T00:00:00Z"
      };

      const mockSubscription = {
        price: 39,
        billingPeriod: "monthly",
        usage: {
          cities: 2,
          ads: 12,
          listings: 28
        },
        limits: {
          cities: 3,
          ads: 25,
          listings: 50
        }
      };

      return {
        user: mockUser,
        subscription: mockSubscription,
        notifications: notifications.map(notification => ({
          id: notification.Id,
          title: notification.title,
          description: notification.description,
          enabled: notification.enabled === "enabled"
        }))
      };
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
      return {
        user: null,
        subscription: null,
        notifications: []
      };
    }
  },

  async updateProfile(profileData) {
    await delay(500);
    try {
      // In real app, would update current user
      const result = await authService.update(1, {
        Name: profileData.name,
        email: profileData.email
      });
      
      if (result) {
        toast.success('Profile updated successfully');
        return {
          Id: result.Id,
          name: result.Name,
          email: result.email,
          company: profileData.company,
          website: profileData.website,
          subscriptionTier: result.subscription_tier,
          subscriptionStatus: "active",
          emailVerified: result.email_verified,
          createdAt: result.created_at
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  },

  async updateSubscription(plan) {
    await delay(500);
    try {
      // In real app, would update current user's subscription
      const result = await authService.update(1, {
        subscription_tier: plan
      });
      
      if (result) {
        toast.success('Subscription updated successfully');
        return {
          Id: result.Id,
          name: result.Name,
          email: result.email,
          subscriptionTier: result.subscription_tier,
          subscriptionStatus: "active",
          emailVerified: result.email_verified,
          createdAt: result.created_at
        };
      }
      return null;
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
      throw error;
    }
  },

  async updateNotifications(notifications) {
    await delay(300);
    try {
      // Update each notification
      const updatePromises = notifications.map(notification => 
        notificationService.update(notification.id, {
          title: notification.title,
          description: notification.description,
          enabled: notification.enabled
        })
      );

      const results = await Promise.all(updatePromises);
      
      if (results.every(result => result)) {
        toast.success('Notifications updated successfully');
        return notifications;
      }
      
      throw new Error('Some notifications failed to update');
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notifications");
      throw error;
    }
  }
};