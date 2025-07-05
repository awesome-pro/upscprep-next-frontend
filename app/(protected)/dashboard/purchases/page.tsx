'use client';

import React from 'react';
import { PaymentHistory } from '@/components/payment';
import { Separator } from '@/components/ui/separator';

export default function PurchasesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          View your purchase history and active subscriptions
        </p>
      </div>
      <Separator className="my-6" />
      
      <PaymentHistory />
    </div>
  );
}
