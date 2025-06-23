
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionContextType {
  credits: number;
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;
  upgradeSubscription: (tier: 'basic' | 'premium' | 'enterprise') => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('neuralforge-credits');
    return saved ? parseInt(saved) : 100; // Start with 100 free credits
  });

  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium' | 'enterprise'>(() => {
    const saved = localStorage.getItem('neuralforge-subscription');
    return (saved as any) || 'free';
  });

  const isSubscribed = subscriptionTier !== 'free';

  useEffect(() => {
    localStorage.setItem('neuralforge-credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('neuralforge-subscription', subscriptionTier);
  }, [subscriptionTier]);

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  const useCredits = (amount: number): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  };

  const upgradeSubscription = (tier: 'basic' | 'premium' | 'enterprise') => {
    setSubscriptionTier(tier);
    // Add bonus credits based on tier
    const bonusCredits = tier === 'basic' ? 500 : tier === 'premium' ? 1500 : 5000;
    addCredits(bonusCredits);
  };

  return (
    <SubscriptionContext.Provider value={{
      credits,
      isSubscribed,
      subscriptionTier,
      addCredits,
      useCredits,
      upgradeSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
