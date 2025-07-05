"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserQueryParams } from "@/types/user";
import { userService } from "@/services/user.service";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";
import Link from "next/link";
import { getTeacherColumns } from "./columns";
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

export default function TeachersPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

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

  // Fetch teachers
  const { data: teachers, isLoading, refetch } = useQuery({
    queryKey: ['teachers', page, pageSize, search],
    queryFn: async () => {
      const params: UserQueryParams = { 
        page, 
        pageSize, 
        search,
        role: UserRole.TEACHER
      };
      return userService.getAllTeachers(params);
    },
  });

  // Update pagination when data changes
  if (teachers && (
    pagination.currentPage !== teachers.meta.currentPage ||
    pagination.pageSize !== teachers.meta.pageSize ||
    pagination.totalItems !== teachers.meta.total ||
    pagination.totalPages !== teachers.meta.totalPages
  )) {
    setPagination({
      currentPage: teachers.meta.currentPage,
      pageSize: teachers.meta.pageSize,
      totalItems: teachers.meta.total,
      totalPages: teachers.meta.totalPages,
      hasNextPage: teachers.meta.hasNextPage,
      hasPreviousPage: teachers.meta.hasPreviousPage,
    });
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (teacherId: string) => userService.deleteUser(teacherId),
    onSuccess: () => {
      toast.success('Teacher deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete teacher: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (teacherIds: string[]) => userService.bulkDeleteUsers(teacherIds),
    onSuccess: () => {
      toast.success('Teachers deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete teachers: ${error.message}`);
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
    setSelectedTeacherId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeacher = () => {
    if (selectedTeacherId) {
      deleteMutation.mutate(selectedTeacherId);
      setDeleteDialogOpen(false);
      setSelectedTeacherId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Teachers list refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh teachers: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle teacher actions
  const handleView = (id: string) => {
    router.push(`/dashboard/users/teachers/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/users/teachers/${id}/edit`);
  };

  const handleViewContent = (id: string) => {
    router.push(`/dashboard/users/teachers/${id}/content`);
  };

  const handleViewStudents = (id: string) => {
    router.push(`/dashboard/users/teachers/${id}/students`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => teachers?.data[parseInt(index)].id
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
      (index) => teachers?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Teacher" : "Teachers"}
      </Button>
    ) : null
  );

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  const teacherColumns = getTeacherColumns({
    currentUserRole: user?.role || UserRole.STUDENT,
    onDeleteUser: handleDelete,
    onViewUser: handleView,
    onEditUser: handleEdit,
    onViewContent: handleViewContent,
    onViewStudents: handleViewStudents,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teachers</h1>
        {user?.role === UserRole.ADMIN && (
          <Button asChild>
            <Link href="/dashboard/users/teachers/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Teacher
            </Link>
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={teacherColumns}
        data={teachers?.data || []}
        isLoading={isLoading}
        searchKey="name"
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
        rowSelection={user?.role === UserRole.ADMIN}
        rowSelectionState={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        toolbar={{
          searchPlaceholder: "Search teachers by name, email...",
          additionalButtons: user?.role === UserRole.ADMIN ? <BulkDeleteButton /> : undefined
        }}
        additionalToolbarContent={user?.role === UserRole.ADMIN ? <BulkDeleteButton /> : undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the teacher
              and all associated data including courses, exams, and test series.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTeacher}
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
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "teacher" : "teachers"}
              and all associated data including courses, exams, and test series.
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
