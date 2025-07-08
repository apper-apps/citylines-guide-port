import { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionService } from '@/services/api/subscriptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const SubscriptionContext = createContext({});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionContextProvider');
  }
  return context;
};

export const SubscriptionContextProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    } else {
      setCurrentPlan(null);
      setUsageStats(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [plan, stats] = await Promise.all([
        subscriptionService.getCurrentPlan(),
        subscriptionService.getUsageStats()
      ]);
      setCurrentPlan(plan);
      setUsageStats(stats);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (planId, billingPeriod = 'monthly') => {
    try {
      setLoading(true);
      const result = await subscriptionService.changePlan(planId, billingPeriod);
      await loadSubscriptionData();
      toast.success(result.message);
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to change subscription plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = async (resource, currentCount) => {
    try {
      return await subscriptionService.checkLimit(resource, currentCount);
    } catch (err) {
      toast.error(err.message || 'Failed to check subscription limit');
      throw err;
    }
  };

  const validateAction = async (resource, currentCount) => {
    try {
      return await subscriptionService.validateAction(resource, currentCount);
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const canPerformAction = (resource, currentCount) => {
    if (!currentPlan) return false;
    
    const limit = currentPlan.limits[resource];
    if (limit === 'unlimited') return true;
    
    return currentCount < limit;
  };

  const getRemainingQuota = (resource, currentCount) => {
    if (!currentPlan) return 0;
    
    const limit = currentPlan.limits[resource];
    if (limit === 'unlimited') return 'unlimited';
    
    return Math.max(0, limit - currentCount);
  };

  const getUsagePercentage = (resource, currentCount) => {
    if (!currentPlan) return 0;
    
    const limit = currentPlan.limits[resource];
    if (limit === 'unlimited') return 0;
    
    return (currentCount / limit) * 100;
  };

  const value = {
    currentPlan,
    usageStats,
    loading,
    error,
    changePlan,
    checkLimit,
    validateAction,
    canPerformAction,
    getRemainingQuota,
    getUsagePercentage,
    refreshData: loadSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};