import { TestSeries } from "@/types/exams";
import Link from "next/link";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, BookOpen, ShoppingCart, PlayCircle } from "lucide-react";
import { useTestSeriesEnrollments } from "@/hooks/use-test-series-enrollments";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type TestSeriesColumnProps = {
  onViewTestSeries: (id: string) => void;
  onEditTestSeries: (id: string) => void;
  onDeleteTestSeries: (id: string) => void;
  onViewExams: (id: string) => void;
  onPurchaseTestSeries?: (id: string) => void;
  onContinueLearning?: (id: string) => void;
  userRole: UserRole;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export const getColumns = (props: TestSeriesColumnProps) => {
  // Use the test series enrollments hook
  const { isEnrolled } = useTestSeriesEnrollments();
  
  return [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      const testSeries = row.original;
      return (
        <Link 
          href={`/dashboard/test-series/${testSeries.id}`}
          className="font-medium hover:underline"
        >
          {testSeries.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      const description = row.original.description || "";
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.type}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      return formatCurrency(row.original.price / 100); // Convert from paisa to rupees
    },
  },
  {
    accessorKey: "exams",
    header: "Exams",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      const examCount = row.original.exams?.length || 0;
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {examCount}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      return row.original.isActive ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: TestSeries } }) => {
      const testSeries = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => props.onViewTestSeries(testSeries.id)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => props.onViewExams(testSeries.id)}>
            <BookOpen className="mr-2 h-4 w-4" /> Exams
          </Button>
          
          {/* Show purchase or continue learning button for students */}
          {props.userRole === UserRole.STUDENT && (
            isEnrolled(testSeries.id) ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => props.onContinueLearning?.(testSeries.id)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Continue
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  Continue with this test series
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => props.onPurchaseTestSeries?.(testSeries.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Purchase
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  Purchase this test series
                </TooltipContent>
              </Tooltip>
            )
          )}
          
          {/* Admin and teacher actions */}
          {(props.userRole === UserRole.ADMIN || props.userRole === UserRole.TEACHER) && (
            <>
              <Button variant="outline" size="sm" onClick={() => props.onEditTestSeries(testSeries.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => props.onDeleteTestSeries(testSeries.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
};
