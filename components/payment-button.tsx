import React from 'react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/hooks/usePayment';
import { PurchaseType } from '@/types/enums';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  type: PurchaseType;
  courseId?: string;
  testSeriesId?: string;
  examId?: string;
  amount: number;
  title: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onSuccess?: () => void;
  onError?: (error: any) => void;
  disabled?: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  type,
  courseId,
  testSeriesId,
  examId,
  amount,
  title,
  className,
  variant = 'default',
  onSuccess,
  onError,
  disabled = false,
}) => {
  const { handlePayment, isPending } = usePayment({
    onPaymentSuccess: onSuccess,
    onPaymentError: onError,
  });

  const handleClick = () => {
    handlePayment({
      type,
      courseId,
      testSeriesId,
      examId,
      notes: `Payment for ${title}`,
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || disabled}
      className={className}
      variant={variant}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        title
      )}
    </Button>
  );
};
