import { PurchaseStatus, PurchaseType } from '../enums';

export interface CreatePaymentRequest {
  type: PurchaseType;
  courseId?: string;
  testSeriesId?: string;
  examId?: string;
  notes?: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrderResponse {
  id: string;
  purchaseId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  name: string;
  description: string;
  prefillEmail: string;
  prefillName: string;
}

export interface PaymentResponse {
  id: string;
  userId: string;
  type: PurchaseType;
  amount: number;
  finalAmount: number;
  status: PurchaseStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  validFrom: string;
  validTill: string;
  createdAt: string;
  updatedAt: string;
  courseDetails?: {
    id: string;
    title: string;
    type: string;
  };
  testSeriesDetails?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface PurchaseHistory {
  purchases: PaymentResponse[];
}
