import { useState } from 'react';
import { useCreatePaymentOrder, useVerifyPayment } from '@/services/payment';
import { loadRazorpayScript, initializeRazorpayPayment } from '@/lib/razorpay';
import { CreatePaymentRequest, VerifyPaymentRequest } from '@/types/api/payment';
import { PurchaseType } from '@/types/enums';
import { toast } from 'sonner';

interface UsePaymentOptions {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
}

export const usePayment = (options?: UsePaymentOptions) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  /**
   * Handle the entire payment flow
   */
  const handlePayment = async (paymentDetails: {
    type: PurchaseType;
    courseId?: string;
    testSeriesId?: string;
    examId?: string;
    notes?: string;
  }) => {
    try {
      setIsProcessing(true);
      
      // 1. Create payment order
      const orderData = await createOrderMutation.mutateAsync(paymentDetails as CreatePaymentRequest);
      
      // 2. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }
      
      // 3. Initialize Razorpay payment
      initializeRazorpayPayment(
        orderData,
        // Success callback
        async (paymentData: VerifyPaymentRequest) => {
          try {
            // 4. Verify payment with backend
            await verifyPaymentMutation.mutateAsync(paymentData);
            
            toast.success('Payment successful!');
            
            // Call success callback if provided
            options?.onPaymentSuccess?.();
          } catch (error) {
            handlePaymentError(error);
          } finally {
            setIsProcessing(false);
          }
        },
        // Error callback
        (error) => {
          handlePaymentError(error);
          setIsProcessing(false);
        }
      );
    } catch (error) {
      handlePaymentError(error);
      setIsProcessing(false);
    }
  };
  
  /**
   * Handle payment errors
   */
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    
    toast.error(error?.message || 'There was an error processing your payment. Please try again.');
    
    // Call error callback if provided
    options?.onPaymentError?.(error);
  };
  
  return {
    handlePayment,
    isProcessing,
    isPending: isProcessing || createOrderMutation.isPending || verifyPaymentMutation.isPending,
  };
};
