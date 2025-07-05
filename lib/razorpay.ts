import { OrderResponse, VerifyPaymentRequest } from '../types/api/payment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment
 */
export const initializeRazorpayPayment = (
  orderData: OrderResponse,
  onSuccess: (data: VerifyPaymentRequest) => void,
  onFailure: (error: any) => void
): void => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount * 100, // Amount in paisa
    currency: orderData.currency,
    name: orderData.name,
    description: orderData.description,
    order_id: orderData.orderId,
    prefill: {
      name: orderData.prefillName,
      email: orderData.prefillEmail,
    },
    theme: {
      color: '#3399cc',
    },
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      // Handle successful payment
      onSuccess({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: () => {
        console.log('Payment modal closed without completing payment');
      },
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    onFailure(error);
  }
};
