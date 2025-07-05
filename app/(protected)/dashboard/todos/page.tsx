'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { TodoService } from '@/services';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TodoStatistics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TodosPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch todos with pagination and filtering
  const {
    data: todosData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['todos', page, pageSize, searchTerm],
    queryFn: () =>
      TodoService.getTodos({
        page,
        pageSize,
        title: searchTerm || undefined,
      }),
  });

  // Fetch todo statistics
  const { data: statsData } = useQuery({
    queryKey: ['todoStats'],
    queryFn: () => TodoService.getTodoStatistics(),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  const handleRefresh = () => {
    refetch();
    toast('Todo list has been refreshed');
  };

  const renderStatistics = (stats: TodoStatistics) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Todos</h1>
        <Button asChild>
          <Link href="/dashboard/todos/create">
            <Plus className="mr-2 h-4 w-4" /> Create Todo
          </Link>
        </Button>
      </div>

      {statsData && renderStatistics(statsData)}
      <DataTable
          columns={columns}
          data={todosData?.data || []}
          isLoading={isLoading}
          error={error as Error}
          searchKey="title"
          rowSelection={true}
          serverPagination={{
            currentPage: page,
            pageSize: pageSize,
            totalItems: todosData?.meta.total || 0,
            totalPages: todosData?.meta.totalPages || 1,
            hasNextPage: todosData?.meta.hasNextPage || false,
            hasPreviousPage: todosData?.meta.hasPreviousPage || false,
            onPageChange: handlePageChange,
          }}
          serverSideSearch={true}
          onSearchChange={handleSearch}
          searchValue={searchTerm}
          onRefresh={handleRefresh}
          onRowClick={(row) => {
            window.location.href = `/dashboard/todos/${row.id}`;
          }}
          toolbar={{
            searchPlaceholder: 'Search todos...',
            createLink: '/dashboard/todos/create',
            createButtonLabel: 'Create Todo',
          }}
        />
    </div>
  );
}
