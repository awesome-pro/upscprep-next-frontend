"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonOrderBy, OrderDirection, LessonQueryParams } from "@/types/lesson";
import { lessonService } from "@/services/lesson.service";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { toast } from "sonner";
import type { CourseLesson } from "@/types/models";
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
import { getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/react-table";

export default function LessonsListPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [pageSize, setPageSize] = useState(10);
  const [isMandatory, setIsMandatory] = useState<boolean | undefined>(undefined);
  const [isPreview, setIsPreview] = useState<boolean | undefined>(undefined);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Get params
  const params = useParams();
  const moduleId = params.moduleId as string;
  const courseId = params.courseId as string;
  const router = useRouter();
  const { user } = useAuth();

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

 
  // Fetch lessons
  const { data: lessons, isLoading, error, refetch } = useQuery({
    queryKey: ['lessons', page, pageSize, search, moduleId],
    queryFn: async () => {
      const params: LessonQueryParams = { page, pageSize, search, isMandatory, isPreview,};
      return lessonService.getPaginatedLessons(moduleId, params);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ moduleId, lessonId }: { moduleId: string, lessonId: string }) => 
      lessonService.deleteLesson(moduleId, lessonId),
    onSuccess: () => {
      toast.success('Lesson deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['lessons', moduleId] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete lesson: ${error.message}`);
    },
  });

  const deleteBulkMutation = useMutation({
    mutationFn: ({ moduleId, lessonIds }: { moduleId: string, lessonIds: string[] }) => 
      lessonService.bulkDeleteLessons(moduleId, lessonIds),
    onSuccess: () => {
      toast.success('Lessons deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['lessons', moduleId] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete lessons: ${error.message}`);
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

  const handleDelete = (id: string) => {
    setSelectedLessonId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLesson = () => {
    if (selectedLessonId) {
      deleteMutation.mutate({ moduleId, lessonId: selectedLessonId });
      setDeleteDialogOpen(false);
      setSelectedCourseId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Lessons refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh lessons: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  if (!moduleId) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p>Redirecting to modules...</p>
      </section>
    );
  }

  // Handle storefront product actions
  const handleView = (id: string) => {
    router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${id}/edit`);
  };

   // Confirm bulk delete
   const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => lessons?.data[parseInt(index)].id
    ).filter((id) => id !== undefined) as string[];
    
    if (selectedIds.length > 0) {
      deleteBulkMutation.mutate({ moduleId, lessonIds: selectedIds });
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => lessons?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Lesson" : "Lessons"}
      </Button>
    ) : null
  );

  const lessonColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    courseId,
    moduleId,
    onDeleteLesson: handleDelete,
    onViewLesson: handleView,
    onEditLesson: handleEdit,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex items-center justify-between w-full px-4">
        <h1 className="text-2xl font-bold">Lessons</h1>
        {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER && (
          <Button variant="default" size="sm" onClick={() => router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/create`)}>
            <Plus className="mr-2 h-4 w-4" /> Add Lesson
          </Button>
        )}
      </div>
      {/* Data Table */}
      <DataTable
        columns={lessonColumns}
        data={lessons?.data || []}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        searchKey="title"
        serverSideSearch={true}
        onSearchChange={handleSearchChange}
        searchValue={search}
        searchLoading={searchLoading}
        serverPagination={{
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPreviousPage: pagination.hasPreviousPage,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        toolbar={{
          searchPlaceholder: "Filter lessons...",
        }}
        rowSelection={user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER}
        onRowSelectionChange={setRowSelection}
        rowSelectionState={rowSelection}
        additionalToolbarContent={<BulkDeleteButton />}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lesson.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLesson}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedRowCount} {selectedRowCount === 1 ? "Blog" : "Blogs"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected {selectedRowCount === 1 ? "blog" : "blogs"} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
