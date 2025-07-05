import { useQuery } from '@tanstack/react-query';
import { getUserPurchases, getPurchaseById } from './apis';
import { PAYMENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch all user purchases
 */
export const useUserPurchases = () => {
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.PURCHASES],
    queryFn: () => getUserPurchases(),
  });
};

/**
 * Hook to fetch a specific purchase by ID
 */
export const usePurchaseById = (id: string) => {
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.PURCHASE, id],
    queryFn: () => getPurchaseById(id),
    enabled: !!id,
  });
};
