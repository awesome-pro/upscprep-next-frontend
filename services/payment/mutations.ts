import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPaymentOrder, verifyPayment } from './apis';
import { CreatePaymentRequest, VerifyPaymentRequest } from '../../types/api/payment';
import { PAYMENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to create a payment order
 */
export const useCreatePaymentOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPaymentOrder(data),
    onSuccess: () => {
      // Invalidate purchases query to refetch after successful order creation
      queryClient.invalidateQueries({ queryKey: [PAYMENT_QUERY_KEYS.PURCHASES] });
    },
  });
};

/**
 * Hook to verify payment after completion
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => verifyPayment(data),
    onSuccess: () => {
      // Invalidate purchases query to refetch after successful verification
      queryClient.invalidateQueries({ queryKey: [PAYMENT_QUERY_KEYS.PURCHASES] });
    },
  });
};
