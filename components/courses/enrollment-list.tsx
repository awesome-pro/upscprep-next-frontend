'use client';

import { useState, useEffect } from 'react';
import { EnrollmentWithCourse } from '@/types/enrollment';
import { enrollmentService } from '@/services/enrollment.service';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { PaginatedResult } from '@/lib/pagination';

interface EnrollmentListProps {
  initialEnrollments?: PaginatedResult<EnrollmentWithCourse>;
}

export function EnrollmentList({ initialEnrollments }: EnrollmentListProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>(
    initialEnrollments?.data || []
  );
  const [loading, setLoading] = useState(!initialEnrollments);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: initialEnrollments?.meta.currentPage || 1,
    pageSize: initialEnrollments?.meta.pageSize || 10,
    totalItems: initialEnrollments?.meta.total || 0,
    totalPages: initialEnrollments?.meta.totalPages || 0,
    hasNextPage: initialEnrollments?.meta.hasNextPage || false,
    hasPreviousPage: initialEnrollments?.meta.hasPreviousPage || false,
  });

  useEffect(() => {
    if (!initialEnrollments) {
      fetchEnrollments();
    }
  }, [initialEnrollments]);

  const fetchEnrollments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await enrollmentService.getPaginatedUserEnrollments(page, pagination.pageSize);
      setEnrollments(data.data);
      setPagination({
        currentPage: data.meta.currentPage,
        pageSize: data.meta.pageSize,
        totalItems: data.meta.total,
        totalPages: data.meta.totalPages,
        hasNextPage: data.meta.hasNextPage,
        hasPreviousPage: data.meta.hasPreviousPage,
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchEnrollments(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: ColumnDef<EnrollmentWithCourse>[] = [
    {
      accessorKey: 'course.title',
      header: 'Course',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.course.title}</span>
          <span className="text-xs text-muted-foreground">{row.original.course.subject}</span>
        </div>
      ),
    },
    {
      accessorKey: 'course.type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.course.type}</Badge>
      ),
    },
    {
      accessorKey: 'progressPercentage',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="w-full max-w-[200px]">
          <div className="flex justify-between text-xs mb-1">
            <span>{Math.round(row.original.progressPercentage)}%</span>
            <span>{row.original.completedLessons}/{row.original.totalLessons} lessons</span>
          </div>
          <Progress value={row.original.progressPercentage} className="h-2" />
        </div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Valid Until',
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button asChild size="sm">
          <Link href={`/courses/${row.original.courseId}`} className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Continue
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={enrollments}
        isLoading={loading}
        error={error}
        onRowClick={(row) => window.location.href = `/courses/${row.courseId}`}
        serverPagination={{
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPreviousPage: pagination.hasPreviousPage,
          onPageChange: handlePageChange,
        }}
        toolbar={{
          searchPlaceholder: 'Search enrollments...',
        }}
      />
    </div>
  );
}
