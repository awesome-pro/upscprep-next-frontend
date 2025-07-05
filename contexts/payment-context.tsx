import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentResponse } from '@/types/api/payment';
import { useUserPurchases } from '@/services/payment';

interface PaymentContextType {
  isLoadingPurchases: boolean;
  purchases: PaymentResponse[];
  refreshPurchases: () => void;
  hasPurchased: (type: 'COURSE' | 'TEST_SERIES', itemId: string) => boolean;
  isPurchaseActive: (purchaseId: string) => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    data: purchases = [], 
    isLoading: isLoadingPurchases,
    refetch: refreshPurchases 
  } = useUserPurchases();

  /**
   * Check if user has purchased a specific item
   */
  const hasPurchased = (type: 'COURSE' | 'TEST_SERIES', itemId: string): boolean => {
    const now = new Date();
    
    return purchases.some(purchase => {
      // Check if purchase is completed and still valid
      const isActive = purchase.status === 'COMPLETED' && 
                       new Date(purchase.validTill) > now;
      
      if (!isActive) return false;
      
      // Check if the purchase matches the requested item
      if (type === 'COURSE' && purchase.type === 'COURSE') {
        return purchase.courseDetails?.id === itemId;
      }
      
      if (type === 'TEST_SERIES' && purchase.type === 'TEST_SERIES') {
        return purchase.testSeriesDetails?.id === itemId;
      }
      
      return false;
    });
  };

  /**
   * Check if a specific purchase is still active
   */
  const isPurchaseActive = (purchaseId: string): boolean => {
    const purchase = purchases.find(p => p.id === purchaseId);
    if (!purchase) return false;
    
    const now = new Date();
    return purchase.status === 'COMPLETED' && new Date(purchase.validTill) > now;
  };

  const value = {
    isLoadingPurchases,
    purchases,
    refreshPurchases,
    hasPurchased,
    isPurchaseActive,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
