import { authService } from '@/services/api/authService';
import { toast } from 'react-toastify';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Subscription plan definitions
const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter',
    price: { monthly: 19, yearly: 190 },
    limits: {
      cities: 1,
      ads: 5,
      listings: 10
    },
    features: [
      '1 city',
      'Up to 5 banner ads',
      '10 listings',
      'Basic support',
      'Email notifications'
    ]
  },
  pro: {
    name: 'Pro',
    price: { monthly: 39, yearly: 390 },
    limits: {
      cities: 3,
      ads: 25,
      listings: 50
    },
    features: [
      'Up to 3 cities',
      '25 banner ads',
      '50 listings',
      'Analytics dashboard',
      'Priority support',
      'Custom pages'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    limits: {
      cities: 'unlimited',
      ads: 'unlimited',
      listings: 'unlimited'
    },
    features: [
      'Unlimited cities',
      'Unlimited ads',
      'Unlimited listings',
      'White-label option',
      'API access',
      'Dedicated support',
      'Custom integrations'
    ]
  }
};

// Get users from localStorage
const getUsersFromStorage = () => {
  const users = localStorage.getItem('citylines_users');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsersToStorage = (users) => {
  localStorage.setItem('citylines_users', JSON.stringify(users));
};

// Update current user in auth storage
const updateCurrentUser = (updatedUser) => {
  const authUser = { ...updatedUser };
  delete authUser.password;
  localStorage.setItem('citylines_auth_user', JSON.stringify(authUser));
};

export const subscriptionService = {
  // Get current user's subscription plan
  async getCurrentPlan() {
    await delay(200);
    try {
      const user = await authService.getCurrentUser();
      return SUBSCRIPTION_PLANS[user.subscriptionTier] || SUBSCRIPTION_PLANS.starter;
    } catch (error) {
      throw new Error('Failed to get current subscription plan');
    }
  },

  // Get all available plans
  async getPlans() {
    await delay(200);
    return Object.keys(SUBSCRIPTION_PLANS).map(key => ({
      id: key,
      ...SUBSCRIPTION_PLANS[key]
    }));
  },

  // Change subscription plan
  async changePlan(planId, billingPeriod = 'monthly') {
    await delay(500);
    
    if (!SUBSCRIPTION_PLANS[planId]) {
      throw new Error('Invalid subscription plan');
    }

    try {
      const user = await authService.getCurrentUser();
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(u => u.Id === user.Id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user's subscription
      users[userIndex].subscriptionTier = planId;
      users[userIndex].billingPeriod = billingPeriod;
      users[userIndex].subscriptionUpdatedAt = new Date().toISOString();
      
      saveUsersToStorage(users);
      updateCurrentUser(users[userIndex]);

      return {
        success: true,
        plan: SUBSCRIPTION_PLANS[planId],
        message: `Successfully upgraded to ${SUBSCRIPTION_PLANS[planId].name} plan`
      };
    } catch (error) {
      throw new Error('Failed to change subscription plan');
    }
  },

  // Check if user can perform action based on limits
  async checkLimit(resource, currentCount) {
    await delay(100);
    
    try {
      const user = await authService.getCurrentUser();
      const plan = SUBSCRIPTION_PLANS[user.subscriptionTier] || SUBSCRIPTION_PLANS.starter;
      const limit = plan.limits[resource];

      if (limit === 'unlimited') {
        return { allowed: true, limit: 'unlimited', current: currentCount };
      }

      const allowed = currentCount < limit;
      return {
        allowed,
        limit,
        current: currentCount,
        remaining: Math.max(0, limit - currentCount)
      };
    } catch (error) {
      throw new Error('Failed to check subscription limit');
    }
  },

  // Get usage statistics
  async getUsageStats() {
    await delay(300);
    
    try {
      const user = await authService.getCurrentUser();
      const plan = SUBSCRIPTION_PLANS[user.subscriptionTier] || SUBSCRIPTION_PLANS.starter;
      
      // Mock current usage - in real app, this would come from actual data
      const mockUsage = {
        cities: 1,
        ads: 3,
        listings: 7
      };

      return {
        plan,
        usage: mockUsage,
        limits: plan.limits,
        percentageUsed: {
          cities: plan.limits.cities === 'unlimited' ? 0 : (mockUsage.cities / plan.limits.cities) * 100,
          ads: plan.limits.ads === 'unlimited' ? 0 : (mockUsage.ads / plan.limits.ads) * 100,
          listings: plan.limits.listings === 'unlimited' ? 0 : (mockUsage.listings / plan.limits.listings) * 100
        }
      };
    } catch (error) {
      throw new Error('Failed to get usage statistics');
    }
  },

  // Validate action before performing
  async validateAction(resource, currentCount) {
    const limitCheck = await this.checkLimit(resource, currentCount);
    
    if (!limitCheck.allowed) {
      const plan = await this.getCurrentPlan();
      throw new Error(`You've reached the limit of ${limitCheck.limit} ${resource} for your ${plan.name} plan. Please upgrade to add more.`);
    }
    
    return limitCheck;
  }
};