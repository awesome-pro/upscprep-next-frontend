'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePurchaseById } from '@/services/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PurchaseStatus, PurchaseType } from '@/types/enums';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function PurchaseDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: purchase, isLoading, error } = usePurchaseById(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading purchase details...</div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">Failed to load purchase details.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // This would typically call an API endpoint to generate and download an invoice
    toast.success('Invoice download started');
  };

  const getStatusColor = (status: PurchaseStatus) => {
    switch (status) {
      case PurchaseStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PurchaseStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PurchaseStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PurchaseStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800';
      case PurchaseStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPurchaseTypeLabel = (type: PurchaseType) => {
    switch (type) {
      case PurchaseType.COURSE:
        return 'Course';
      case PurchaseType.TEST_SERIES:
        return 'Test Series';
      case PurchaseType.INDIVIDUAL_EXAM:
        return 'Individual Exam';
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Purchase Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {purchase.courseDetails?.title || 
                     purchase.testSeriesDetails?.title || 
                     'Purchase'}
                  </CardTitle>
                  <CardDescription>
                    {getPurchaseTypeLabel(purchase.type)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(purchase.status)}>
                  {purchase.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Purchase Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase ID</p>
                      <p className="font-medium">{purchase.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium">
                        {format(new Date(purchase.createdAt), 'dd MMM yyyy, HH:mm')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">₹{(purchase.finalAmount / 100).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">Razorpay</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Validity</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Valid from {format(new Date(purchase.validFrom), 'dd MMM yyyy')} to{' '}
                      {format(new Date(purchase.validTill), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
                
                {purchase.status === PurchaseStatus.COMPLETED && (
                  <>
                    <Separator />
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Your purchase was successful and your access has been activated
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              
              {purchase.type === PurchaseType.COURSE && purchase.courseDetails && (
                <Button onClick={() => router.push(`/courses/${purchase.courseDetails?.id}`)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Course
                </Button>
              )}
              
              {purchase.type === PurchaseType.TEST_SERIES && purchase.testSeriesDetails && (
                <Button onClick={() => router.push(`/test-series/${purchase.testSeriesDetails?.id}`)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Test Series
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Razorpay Order ID</p>
                  <p className="font-mono text-xs break-all">{purchase.razorpayOrderId}</p>
                </div>
                
                {purchase.razorpayPaymentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Razorpay Payment ID</p>
                    <p className="font-mono text-xs break-all">{purchase.razorpayPaymentId}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Original Price</span>
                    <span>₹{(purchase.amount / 100).toLocaleString('en-IN')}</span>
                  </div>
                  
                  {purchase.amount !== purchase.finalAmount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{((purchase.amount - purchase.finalAmount) / 100).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total Paid</span>
                    <span>₹{(purchase.finalAmount / 100).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
