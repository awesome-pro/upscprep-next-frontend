"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import { ExamQueryParams } from "@/types/exams";
import Link from "next/link";
import { RowSelectionState } from "@tanstack/react-table";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExamService } from "@/services";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ExamsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const { user } = useAuth();
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
  
  const { data: exams, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['exams', page, pageSize, search],
    queryFn: async () => {
      const params: ExamQueryParams = { page, pageSize, search };
      return ExamService.getExams(params);
    },
  });

  // Update pagination when data changes
  if (exams && (
    pagination.currentPage !== exams.meta.currentPage ||
    pagination.pageSize !== exams.meta.pageSize ||
    pagination.totalItems !== exams.meta.total ||
    pagination.totalPages !== exams.meta.totalPages
  )) {
    setPagination({
      currentPage: exams.meta.currentPage,
      pageSize: exams.meta.pageSize,
      totalItems: exams.meta.total,
      totalPages: exams.meta.totalPages,
      hasNextPage: exams.meta.hasNextPage,
      hasPreviousPage: exams.meta.hasPreviousPage,
    });
  }


 // Delete mutation
 const deleteMutation = useMutation({
  mutationFn: (examId: string) =>ExamService.deleteExam(examId),
  onSuccess: () => {
    toast.success('Exam deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['exams'] });
    setSelectedRowCount(0);
  },
  onError: (error: any) => {
    toast.error(`Failed to delete exam: ${error.message}`);
  },
});


  // Bulk delete mutation
    const bulkDeleteMutation = useMutation({
      mutationFn: (examIds: string[]) => ExamService.bulkDeleteExams(examIds),
      onSuccess: () => {
        toast.success('Exams deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['exams'] });
        setRowSelection({});
        setSelectedRowCount(0);
      },
      onError: (error: any) => {
        toast.error(`Failed to delete exams: ${error.message}`);
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
    setSelectedExamId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExam = () => {
    if (selectedExamId) {
      deleteMutation.mutate(selectedExamId);
      setDeleteDialogOpen(false);
      setSelectedExamId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Exams refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh exams: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle course actions
  const handleView = (id: string) => {
    router.push(`/dashboard/exams/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/exams/${id}/edit`);
  };

  const handleViewAttempts = (id: string) => {
    router.push(`/dashboard/exams/${id}/attempts`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => exams?.data[parseInt(index)].id
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
      (index) => exams?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Exam" : "Exams"}
      </Button>
    ) : null
  );

  // Update row selection count
    const handleRowSelectionChange = (newSelection: RowSelectionState) => {
      setRowSelection(newSelection);
      setSelectedRowCount(Object.keys(newSelection).length);
    };
  
    const examColumns = getColumns({
      userRole: user?.role || UserRole.STUDENT,
      onDeleteExam: handleDelete,
      onViewExam: handleView,
      onEditExam: handleEdit,
      onViewAttempts: handleViewAttempts,
    });


    return (
      <section className="container mx-auto py-10 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exams</h1>
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
            <Button asChild>
              <Link href="/dashboard/exams/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Exam
              </Link>
            </Button>
          )}
        </div>
  
        {/* Data Table */}
        <DataTable
          columns={examColumns}
          data={exams?.data || []}
          isLoading={isLoading}
          searchKey="title"
          searchValue={search}
          serverSideSearch={true}
          onSearchChange={handleSearchChange}
          searchLoading={searchLoading}
          onRefresh={handleRefresh}
          refreshLoading={isRefetching}
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
          rowSelection={user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER}
          rowSelectionState={rowSelection}
          onRowSelectionChange={handleRowSelectionChange}
          toolbar={{
            searchPlaceholder: "Search courses by title, description...",
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
                This action cannot be undone. This will permanently delete the course
                and all associated modules, lessons, and resources.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteExam}
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
                This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "exam" : "exams"}
                and all associated modules, lessons, and resources.
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
