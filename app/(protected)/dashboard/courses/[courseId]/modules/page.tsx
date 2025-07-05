"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleQueryParams } from "@/types/models";
import { moduleService } from "@/services/module.service";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
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

export default function ModuleListPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  // Get params
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
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

  // Fetch modules
  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['modules', page, pageSize, search, courseId],
    queryFn: async () => {
      const params: ModuleQueryParams = { page, pageSize, search };
      return moduleService.getPaginatedModules(courseId, params);
    },
  });

  // Update pagination when data changes
  if (modules && (
    pagination.currentPage !== modules.meta.currentPage ||
    pagination.pageSize !== modules.meta.pageSize ||
    pagination.totalItems !== modules.meta.total ||
    pagination.totalPages !== modules.meta.totalPages
  )) {
    setPagination({
      currentPage: modules.meta.currentPage,
      pageSize: modules.meta.pageSize,
      totalItems: modules.meta.total,
      totalPages: modules.meta.totalPages,
      hasNextPage: modules.meta.hasNextPage,
      hasPreviousPage: modules.meta.hasPreviousPage,
    });
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ courseId, moduleId }: { courseId: string, moduleId: string }) => 
      moduleService.deleteModule(courseId, moduleId),
    onSuccess: () => {
      toast.success('Module deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete module: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: ({ courseId, moduleIds }: { courseId: string, moduleIds: string[] }) => 
      Promise.all(moduleIds.map(moduleId => moduleService.deleteModule(courseId, moduleId))),
    onSuccess: () => {
      toast.success('Modules deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete modules: ${error.message}`);
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
    setSelectedModuleId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteModule = () => {
    if (selectedModuleId) {
      deleteMutation.mutate({ courseId, moduleId: selectedModuleId });
      setDeleteDialogOpen(false);
      setSelectedModuleId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Modules refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh modules: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle module actions
  const handleView = (id: string) => {
    router.push(`/dashboard/courses/${courseId}/modules/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/courses/${courseId}/modules/${id}/edit`);
  };

  const handleViewLessons = (id: string) => {
    router.push(`/dashboard/courses/${courseId}/modules/${id}/lessons`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => modules?.data[parseInt(index)].id
    ).filter((id) => id !== undefined) as string[];
    
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate({ courseId, moduleIds: selectedIds });
      setBulkDeleteDialogOpen(false);
      setRowSelection({});
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => modules?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Module" : "Modules"}
      </Button>
    ) : null
  );

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  const moduleColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    courseId,
    onDeleteModule: handleDelete,
    onViewModule: handleView,
    onEditModule: handleEdit,
    onViewLessons: handleViewLessons,
  });

  if (!courseId) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p>Redirecting to courses...</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Modules</h1>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Button asChild>
            <Link href={`/dashboard/courses/${courseId}/modules/create`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Module
            </Link>
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={moduleColumns}
        data={modules?.data || []}
        isLoading={isLoading}
        searchKey="title"
        searchValue={search}
        serverSideSearch={true}
        onSearchChange={handleSearchChange}
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
        rowSelection={user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER}
        rowSelectionState={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        toolbar={{
          searchPlaceholder: "Search modules by title, description...",
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
              This action cannot be undone. This will permanently delete the module
              and all associated lessons and resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteModule}
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
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "module" : "modules"}
              and all associated lessons and resources.
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
