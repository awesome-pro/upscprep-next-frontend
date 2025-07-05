"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AttemptQueryParams } from "@/types/exams";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { ExamService } from "@/services";
import { toast } from "sonner";
import { UserRole } from "@/types";
import attemptService from "@/services/attempt.service";

export default function ExamAttemptsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  
  // Get exam details
  const { data: exam } = useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      return ExamService.getExamById(examId);
    },
    enabled: !!examId,
  });

  // Get attempts for this exam
  const { data: attempts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['attempts', examId, page, pageSize, search],
    queryFn: async () => {
      const params: AttemptQueryParams = { 
        page, 
        pageSize, 
        examId, 
        search 
      };
      return attemptService.getAttemptsByExam(examId, params);
    },
    enabled: !!examId,
  });

  // Update pagination when data changes
  if (attempts && (
    pagination.currentPage !== attempts.meta.currentPage ||
    pagination.pageSize !== attempts.meta.pageSize ||
    pagination.totalItems !== attempts.meta.total ||
    pagination.totalPages !== attempts.meta.totalPages
  )) {
    setPagination({
      currentPage: attempts.meta.currentPage,
      pageSize: attempts.meta.pageSize,
      totalItems: attempts.meta.total,
      totalPages: attempts.meta.totalPages,
      hasNextPage: attempts.meta.hasNextPage,
      hasPreviousPage: attempts.meta.hasPreviousPage,
    });
  }


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

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Attempts refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh attempts: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle attempt actions
  const handleView = (id: string) => {
    router.push(`/dashboard/exams/${examId}/attempts/${id}`);
  };

  const handleViewAnswerSheet = (id: string) => {
    router.push(`/dashboard/exams/${examId}/attempts/${id}/answer-sheet`);
  };

  const handleDownloadResults = (id: string) => {
    toast.info('Downloading results...');
  };


  const attemptColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    onViewAttempt: handleView,
    onViewAnswerSheet: handleViewAnswerSheet,
    onDownloadResults: handleDownloadResults,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {exam?.title ? `${exam.title} - Attempts` : 'Exam Attempts'}
          </h1>
      </div>

      {/* Data Table */}
      <DataTable
        columns={attemptColumns}
        data={attempts?.data || []}
        isLoading={isLoading}
        searchKey="user.name"
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
        toolbar={{
          searchPlaceholder: "Search attempts by student name...",
        }}
      />

    </section>
  );
}
