import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPurchases } from '@/services/payment';
import { PurchaseStatus, PurchaseType } from '@/types/enums';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const PaymentHistory: React.FC = () => {
  const { data: purchases, isLoading, error } = useUserPurchases();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load purchase history. Please try again later.
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-muted-foreground">
            You haven't made any purchases yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your recent purchases</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid Till</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  {format(new Date(purchase.createdAt), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {purchase.courseDetails?.title || 
                   purchase.testSeriesDetails?.title || 
                   'Unknown Item'}
                </TableCell>
                <TableCell>
                  {purchase.type === PurchaseType.COURSE
                    ? 'Course'
                    : purchase.type === PurchaseType.TEST_SERIES
                    ? 'Test Series'
                    : 'Exam'}
                </TableCell>
                <TableCell className="text-right">
                  ₹{(purchase.finalAmount / 100).toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={purchase.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(purchase.validTill), 'dd MMM yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: PurchaseStatus }> = ({ status }) => {
  switch (status) {
    case PurchaseStatus.COMPLETED:
      return <Badge variant="default">Completed</Badge>;
    case PurchaseStatus.PENDING:
      return <Badge variant="outline">Pending</Badge>;
    case PurchaseStatus.FAILED:
      return <Badge variant="destructive">Failed</Badge>;
    case PurchaseStatus.REFUNDED:
      return <Badge variant="secondary">Refunded</Badge>;
    case PurchaseStatus.CANCELLED:
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
