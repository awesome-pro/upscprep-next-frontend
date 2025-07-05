'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowUpDown, Plus, RefreshCw, LoaderIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  createLink?: string;
  createButtonLabel?: string;
  additionalButtons?: React.ReactNode;
}

interface ServerPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null;
  searchKey?: string;
  onRowClick?: (row: TData) => void;
  rowSelection?: boolean;
  defaultPageSize?: number;
  toolbar?: DataTableToolbarProps;
  onRowSelectionChange?: (value: any) => void;
  rowSelectionState?: any;
  additionalToolbarContent?: React.ReactNode;
  serverPagination?: ServerPaginationProps;
  // Server-side search props
  serverSideSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  searchLoading?: boolean;
  // Refresh functionality
  onRefresh?: () => void;
  refreshLoading?: boolean;
}

// Enhanced Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  maxVisiblePages = 5,
}) => {
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = [];
    
    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center space-x-1">
      {/* First page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={!hasPreviousPage}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page number buttons */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      {/* Next page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={!hasNextPage}
        className="h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  error,
  searchKey,
  onRowClick,
  rowSelection = false,
  defaultPageSize = 10,
  toolbar,
  onRowSelectionChange,
  rowSelectionState,
  additionalToolbarContent,
  serverPagination,
  serverSideSearch = false,
  onSearchChange,
  searchValue = '',
  searchLoading = false,
  onRefresh,
  refreshLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [internalRowSelectionState, setInternalRowSelectionState] = React.useState({});

  // Handle row selection changes
  const handleRowSelectionChange = React.useCallback(
    (value: any) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(value);
      } else {
        setInternalRowSelectionState(value);
      }
    },
    [onRowSelectionChange]
  );

  const effectiveRowSelectionState = rowSelectionState || internalRowSelectionState;

  // Initialize pagination state based on server pagination or default values
  const [pagination, setPagination] = React.useState({
    pageIndex: serverPagination ? serverPagination.currentPage - 1 : 0,
    pageSize: serverPagination ? serverPagination.pageSize : defaultPageSize,
  });

  // Update pagination state when server pagination changes
  React.useEffect(() => {
    if (serverPagination) {
      setPagination({
        pageIndex: serverPagination.currentPage - 1,
        pageSize: serverPagination.pageSize,
      });
    }
  }, [serverPagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    manualPagination: !!serverPagination,
    pageCount: serverPagination?.totalPages || 0,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: effectiveRowSelectionState,
      pagination,
    },
    enableRowSelection: rowSelection,
  });

  return (
    <div className="space-y-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row w-full md:w-auto flex-1 items-start sm:items-center gap-4">
          {searchKey && (
            <div className="relative w-full sm:max-w-md">
              <Input
                placeholder={toolbar?.searchPlaceholder || `Search ${searchKey}...`}
                value={serverSideSearch ? searchValue : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                onChange={(event) => {
                  if (serverSideSearch) {
                    if (onSearchChange) {
                      onSearchChange(event.target.value);
                    }
                  } else {
                    table.getColumn(searchKey)?.setFilterValue(event.target.value);
                  }
                }}
                className="w-full"
                // disabled={searchLoading}
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {toolbar?.additionalButtons}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          {additionalToolbarContent}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={refreshLoading || isLoading}
              className="ml-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {toolbar?.createLink && (
            <Button asChild size="sm">
              <Link href={toolbar.createLink}>
                <Plus className="mr-1 h-4 w-4" />
                {toolbar.createButtonLabel || 'Create New'}
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-0">
                <span className="hidden sm:inline-block">Columns</span> <ChevronDown className="ml-0 sm:ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-scroll">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {rowSelection && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                      }
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort() ? 'cursor-pointer' : ''
                        }`}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
                >
                  {rowSelection && (
                    <TableCell className="w-[40px]">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {rowSelection && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="mr-4">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          )}
          {serverPagination && (
            <span>
              Showing {Math.min((serverPagination.currentPage - 1) * serverPagination.pageSize + 1, serverPagination.totalItems)} to{' '}
              {Math.min(serverPagination.currentPage * serverPagination.pageSize, serverPagination.totalItems)} of{' '}
              {serverPagination.totalItems} entries
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
          {serverPagination ? (
            <Pagination
              currentPage={serverPagination.currentPage}
              totalPages={serverPagination.totalPages}
              onPageChange={serverPagination.onPageChange}
              hasNextPage={serverPagination.hasNextPage}
              hasPreviousPage={serverPagination.hasPreviousPage}
              maxVisiblePages={5}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground mr-4">
                Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}