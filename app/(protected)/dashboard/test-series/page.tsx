"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TestSeriesQueryParams } from "@/types/exams";
import { TestSeriesService } from "@/services/test-series-service";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTestSeriesEnrollments } from "@/hooks/use-test-series-enrollments";
import { UserRole } from "@/types";
import Link from "next/link";
import { getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function TestSeriesListPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedTestSeriesId, setSelectedTestSeriesId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  const router = useRouter();
  const { user } = useAuth();
  const { isEnrolled } = useTestSeriesEnrollments();
  const queryClient = useQueryClient();

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch test series
  const { data: testSeries, isLoading, refetch } = useQuery({
    queryKey: ['test-series', page, pageSize, search],
    queryFn: async () => {
      const params: TestSeriesQueryParams = { page, pageSize, search };
      return TestSeriesService.getTestSeries(params);
    },
  });

  // Update pagination when data changes
  if (testSeries && (
    pagination.currentPage !== testSeries.meta.currentPage ||
    pagination.pageSize !== testSeries.meta.pageSize ||
    pagination.totalItems !== testSeries.meta.total ||
    pagination.totalPages !== testSeries.meta.totalPages
  )) {
    setPagination({
      currentPage: testSeries.meta.currentPage,
      pageSize: testSeries.meta.pageSize,
      totalItems: testSeries.meta.total,
      totalPages: testSeries.meta.totalPages,
      hasNextPage: testSeries.meta.hasNextPage,
      hasPreviousPage: testSeries.meta.hasPreviousPage,
    });
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (testSeriesId: string) => TestSeriesService.deleteTestSeries(testSeriesId),
    onSuccess: () => {
      toast.success('Test series deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['test-series'] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete test series: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (testSeriesIds: string[]) => {
      // Since there's no bulk delete endpoint in the service, we'll delete them one by one
      return Promise.all(testSeriesIds.map(id => TestSeriesService.deleteTestSeries(id)));
    },
    onSuccess: () => {
      toast.success('Test series deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['test-series'] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete test series: ${error.message}`);
    },
  });

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchLoading(true);
    setSearch(value);
    
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1);
      setSearchLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setSelectedTestSeriesId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTestSeries = () => {
    if (selectedTestSeriesId) {
      deleteMutation.mutate(selectedTestSeriesId);
      setDeleteDialogOpen(false);
      setSelectedTestSeriesId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Test series refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh test series: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle test series actions
  const handleView = (id: string) => {
    router.push(`/dashboard/test-series/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/test-series/${id}/edit`);
  };

  const handleViewExams = (id: string) => {
    router.push(`/dashboard/test-series/${id}/exams`);
  };
  
  // Handle purchase test series
  const handlePurchaseTestSeries = (id: string) => {
    // Redirect to purchase page
    router.push(`/dashboard/enrollments/test-series/${id}`);
  };
  
  // Handle continue learning
  const handleContinueLearning = (id: string) => {
    // Redirect to test series dashboard page
    router.push(`/dashboard/test-series/${id}`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => testSeries?.data[parseInt(index)].id
    ).filter((id) => id !== undefined) as string[];
    
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate(selectedIds);
      setBulkDeleteDialogOpen(false);
      setRowSelection({});
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => testSeries?.data[parseInt(index)].id
    );
    
    if (selectedIds.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  // Bulk delete button
  const BulkDeleteButton = () => (
    selectedRowCount > 0 ? (
      <Button 
        variant="destructive" 
        onClick={handleBulkDelete}
        className="flex items-center"
        size="sm"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Test Series" : "Test Series"}
      </Button>
    ) : null
  );

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  const testSeriesColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    onDeleteTestSeries: handleDelete,
    onViewTestSeries: handleView,
    onEditTestSeries: handleEdit,
    onViewExams: handleViewExams,
    onPurchaseTestSeries: handlePurchaseTestSeries,
    onContinueLearning: handleContinueLearning,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Series</h1>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Button asChild>
            <Link href="/dashboard/test-series/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Test Series
            </Link>
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={testSeriesColumns}
        data={testSeries?.data || []}
        isLoading={isLoading}
        searchKey="title"
        searchValue={search}
        onSearchChange={handleSearchChange}
        serverSideSearch={true}
        searchLoading={searchLoading}
        onRefresh={handleRefresh}
        refreshLoading={refreshing}
        serverPagination={{
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPreviousPage: pagination.hasPreviousPage,
          onPageChange: (page) => setPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
        rowSelection={true}
        rowSelectionState={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        toolbar={{
          searchPlaceholder: "Search test series by title, description...",
          additionalButtons: <BulkDeleteButton />
        }}
        additionalToolbarContent={<BulkDeleteButton />}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the test series
              and remove all associated exams from this series.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTestSeries}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "test series" : "test series"}
              and remove all associated exams from these series.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
