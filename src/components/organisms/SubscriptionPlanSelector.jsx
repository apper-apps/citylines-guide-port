import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const SubscriptionPlanSelector = ({ currentPlan, onPlanChange }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 19, yearly: 190 },
      features: [
        '1 city',
        'Up to 5 banner ads',
        '10 listings',
        'Basic support',
        'Email notifications'
      ],
      limits: {
        cities: 1,
        ads: 5,
        listings: 10
      },
      color: 'primary'
    },
    {
      name: 'Pro',
      price: { monthly: 39, yearly: 390 },
      features: [
        'Up to 3 cities',
        '25 banner ads',
        '50 listings',
        'Analytics dashboard',
        'Priority support',
        'Custom pages'
      ],
      limits: {
        cities: 3,
        ads: 25,
        listings: 50
      },
      color: 'secondary',
      popular: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Unlimited cities',
        'Unlimited ads',
        'Unlimited listings',
        'White-label option',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      limits: {
        cities: 'unlimited',
        ads: 'unlimited',
        listings: 'unlimited'
      },
      color: 'accent'
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      primary: isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-300',
      secondary: isSelected ? 'border-secondary bg-green-50' : 'border-gray-200 hover:border-green-300',
      accent: isSelected ? 'border-accent bg-amber-50' : 'border-gray-200 hover:border-amber-300'
    };
    return colors[color] || colors.primary;
};

const handlePlanChange = (planName) => {
    if (currentPlan === planName) return;
    
    if (onPlanChange) {
      onPlanChange(planName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Select the plan that best fits your needs</p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          Yearly
        </span>
        {billingPeriod === 'yearly' && (
          <span className="text-sm text-green-600 font-medium">Save 20%</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <Card className={`h-full border-2 ${getColorClasses(plan.color, currentPlan === plan.name.toLowerCase())}`}>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price[billingPeriod]}
                    </span>
                    <span className="text-gray-600">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <ApperIcon name="Check" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

<Button
                  variant={currentPlan === plan.name.toLowerCase() ? 'outline' : plan.color}
                  onClick={() => handlePlanChange(plan.name.toLowerCase())}
                  className="w-full"
                >
                  {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlanSelector;