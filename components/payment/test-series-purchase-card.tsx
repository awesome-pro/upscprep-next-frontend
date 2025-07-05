import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseType } from '@/types/enums';
import { Check, Loader2 } from 'lucide-react';
import { TestSeriesDetailDto } from '@/types/test-series';
import { PaymentButton } from '../payment-button';

interface TestSeriesPurchaseCardProps {
  testSeriesId: string;
  testSeriesType: string;
  title?: string;
  description?: string;
  onPurchaseSuccess?: () => void;
  showFullDetails?: boolean;
  testSeriesData?: TestSeriesDetailDto;
}

export const TestSeriesPurchaseCard: React.FC<TestSeriesPurchaseCardProps> = ({
  testSeriesId,
  testSeriesType,
  title,
  description,
  onPurchaseSuccess,
  showFullDetails = false,
  testSeriesData
}) => {
  const [loading, setLoading] = useState(true);
  const [testSeries, setTestSeries] = useState<TestSeriesDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (testSeriesData) {
      setTestSeries(testSeriesData);
      setLoading(false);
      return;
    }
    
  }, [testSeriesId]);
  
  const displayTitle = testSeries?.title || title || getTestSeriesTypeTitle(testSeriesType);
  const displayDescription = testSeries?.description || description || 'Access to comprehensive test series for UPSC preparation';
  const displayPrice = testSeries?.price || 0
  const displayFeatures = testSeries?.features || []
  
  if (loading) {
    return (
      <Card className="w-full max-w-md flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading test series details...</p>
      </Card>
    );
  }
  
  if (error && !testSeries) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Using default pricing information.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{displayTitle}</CardTitle>
        <CardDescription>
          {displayDescription}
        </CardDescription>
        <div className="mt-4 text-3xl font-bold">
          ₹{(displayPrice / 100).toLocaleString('en-IN')}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            for 1 year access
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {showFullDetails && testSeries && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2">Test Series Details</h4>
            <p className="text-sm text-muted-foreground mb-2">Total Tests: {testSeries.totalTests}</p>
            {testSeries.exams && (
              <p className="text-sm text-muted-foreground mb-2">
                Free Tests: {testSeries.exams.filter(exam => exam.isFree).length}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className='flex flex-col items-center justify-center'>
        <PaymentButton
          type={PurchaseType.TEST_SERIES}
          testSeriesId={testSeriesId}
          amount={displayPrice}
          title={displayTitle}
          className="w-full"
          onSuccess={onPurchaseSuccess}
          disabled={testSeries?.isPurchased}
        />
        {testSeries?.isPurchased && (
          <p className="text-sm text-green-600 mt-2">You already have access to this test series</p>
        )}
      </CardFooter>
    </Card>
  );
};

function getTestSeriesTypeTitle(type: string): string {
  switch (type) {
    case 'PRELIMS':
      return 'UPSC Prelims Test Series';
    case 'MAINS':
      return 'UPSC Mains Test Series';
    case 'MOCK_TEST':
      return 'UPSC Mock Test Series';
    default:
      return 'UPSC Test Series';
  }
}
