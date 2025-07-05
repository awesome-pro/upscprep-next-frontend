import api from '../../lib/axios';
import { 
  CreatePaymentRequest, 
  OrderResponse, 
  PaymentResponse, 
  VerifyPaymentRequest 
} from '../../types/api/payment';

const BASE_URL = '/payments';

/**
 * Create a payment order
 * @param data Payment order creation data
 * @returns Order details for Razorpay integration
 */
export const createPaymentOrder = async (data: CreatePaymentRequest): Promise<OrderResponse> => {
  return await api.post<OrderResponse>(`${BASE_URL}/create-order`, data).then(response => response.data);
};

/**
 * Verify payment after completion
 * @param data Payment verification data
 * @returns Updated payment details
 */
export const verifyPayment = async (data: VerifyPaymentRequest): Promise<PaymentResponse> => {
  return await api.post<PaymentResponse>(`${BASE_URL}/verify`, data).then(response => response.data);
};

/**
 * Get all user purchases
 * @returns List of user purchases
 */
export const getUserPurchases = async (): Promise<PaymentResponse[]> => {
  return await api.get<PaymentResponse[]>(`${BASE_URL}/purchases`).then(response => response.data);
};

/**
 * Get purchase by ID
 * @param id Purchase ID
 * @returns Purchase details
 */
export const getPurchaseById = async (id: string): Promise<PaymentResponse> => {
  return await api.get<PaymentResponse>(`${BASE_URL}/purchases/${id}`).then(response => response.data);
};
