"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseQueryParams } from "@/types/course";
import { courseService } from "@/services/course.service-1";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";
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

export default function CoursesPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  const router = useRouter();
  const { user } = useAuth();
  const { isEnrolled } = useCourseEnrollments();
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

  // Fetch courses
  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['courses', page, pageSize, search],
    queryFn: async () => {
      const params: CourseQueryParams = { page, pageSize, search };
      return courseService.getPaginatedCourses(params);
    },
  });

  // Update pagination when data changes
  if (courses && (
    pagination.currentPage !== courses.meta.currentPage ||
    pagination.pageSize !== courses.meta.pageSize ||
    pagination.totalItems !== courses.meta.total ||
    pagination.totalPages !== courses.meta.totalPages
  )) {
    setPagination({
      currentPage: courses.meta.currentPage,
      pageSize: courses.meta.pageSize,
      totalItems: courses.meta.total,
      totalPages: courses.meta.totalPages,
      hasNextPage: courses.meta.hasNextPage,
      hasPreviousPage: courses.meta.hasPreviousPage,
    });
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      toast.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (courseIds: string[]) => courseService.bulkDeleteCourses(courseIds),
    onSuccess: () => {
      toast.success('Courses deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete courses: ${error.message}`);
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
    setSelectedCourseId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (selectedCourseId) {
      deleteMutation.mutate(selectedCourseId);
      setDeleteDialogOpen(false);
      setSelectedCourseId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Courses refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh courses: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle course actions
  const handleView = (id: string) => {
    router.push(`/dashboard/courses/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/courses/${id}/edit`);
  };

  const handleViewModules = (id: string) => {
    router.push(`/dashboard/courses/${id}/modules`);
  };
  
  // Handle purchase course
  const handlePurchaseCourse = (id: string) => {
    // Redirect to purchase page
    router.push(`/dashboard/enrollments/${id}`);
  };
  
  // Handle continue learning
  const handleContinueLearning = (id: string) => {
    // Redirect to course learning page
    router.push(`/dashboard/courses/${id}`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => courses?.data[parseInt(index)].id
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
      (index) => courses?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Course" : "Courses"}
      </Button>
    ) : null
  );

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  const courseColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    onDeleteCourse: handleDelete,
    onViewCourse: handleView,
    onEditCourse: handleEdit,
    onViewModules: handleViewModules,
    onPurchaseCourse: handlePurchaseCourse,
    onContinueLearning: handleContinueLearning,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Button asChild>
            <Link href="/dashboard/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={courseColumns}
        data={courses?.data || []}
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
        rowSelection={true}
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
              onClick={confirmDeleteCourse}
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
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "course" : "courses"}
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
