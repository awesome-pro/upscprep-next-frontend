import React, { ReactNode } from 'react';
import { usePaymentContext } from '@/contexts/payment-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LockIcon, ShieldAlert } from 'lucide-react';

interface PurchaseCheckProps {
  type: 'COURSE' | 'TEST_SERIES';
  itemId: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirectPath?: string;
  title?: string;
  description?: string;
}

/**
 * Component that conditionally renders content based on whether the user
 * has purchased access to the specified item
 */
export const PurchaseCheck: React.FC<PurchaseCheckProps> = ({
  type,
  itemId,
  children,
  fallback,
  redirectPath,
  title = 'Premium Content',
  description = 'This content requires a purchase to access',
}) => {
  const router = useRouter();
  const { hasPurchased, isLoadingPurchases } = usePaymentContext();
  
  const hasAccess = hasPurchased(type, itemId);
  
  // Show loading state while checking purchases
  if (isLoadingPurchases) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-muted-foreground">Checking access...</div>
      </div>
    );
  }
  
  // If user has access, show the children
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If fallback is provided, show that instead of default paywall
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default paywall UI
  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <LockIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          Purchase this {type === 'COURSE' ? 'course' : 'test series'} to unlock all content and features.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={() => {
            if (redirectPath) {
              router.push(redirectPath);
            } else {
              router.push(`/courses/purchase?type=${type.toLowerCase()}&id=${itemId}`);
            }
          }}
        >
          View Purchase Options
        </Button>
      </CardFooter>
    </Card>
  );
};
