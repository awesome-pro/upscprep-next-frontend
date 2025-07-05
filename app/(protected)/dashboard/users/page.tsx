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
import { getUserColumns } from "./columns";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UsersPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if current user is admin
  const isAdmin = user?.role === UserRole.ADMIN;

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users', page, pageSize, search],
    queryFn: async () => {
      const params: UserQueryParams = { 
        page, 
        pageSize, 
        search
      };
      return userService.getAllUsers(params);
    },
    enabled: isAdmin, // Only fetch if user is admin
  });

  // Update pagination when data changes
  if (users && (
    pagination.currentPage !== users.meta.currentPage ||
    pagination.pageSize !== users.meta.pageSize ||
    pagination.totalItems !== users.meta.total ||
    pagination.totalPages !== users.meta.totalPages
  )) {
    setPagination({
      currentPage: users.meta.currentPage,
      pageSize: users.meta.pageSize,
      totalItems: users.meta.total,
      totalPages: users.meta.totalPages,
      hasNextPage: users.meta.hasNextPage,
      hasPreviousPage: users.meta.hasPreviousPage,
    });
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (userIds: string[]) => userService.bulkDeleteUsers(userIds),
    onSuccess: () => {
      toast.success('Users deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete users: ${error.message}`);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => 
      userService.resetUserPassword(id, password),
    onSuccess: () => {
      toast.success('Password reset successfully');
      setResetPasswordDialogOpen(false);
      setNewPassword("");
    },
    onError: (error: any) => {
      toast.error(`Failed to reset password: ${error.message}`);
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
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUserId) {
      deleteMutation.mutate(selectedUserId);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  // Handle reset password
  const handleResetPassword = (id: string) => {
    setSelectedUserId(id);
    setResetPasswordDialogOpen(true);
  };

  const confirmResetPassword = () => {
    if (selectedUserId && newPassword) {
      resetPasswordMutation.mutate({ id: selectedUserId, password: newPassword });
    } else {
      toast.error('Please enter a new password');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Users list refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh users: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle user actions
  const handleView = (id: string) => {
    router.push(`/dashboard/users/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/users/${id}/edit`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => users?.data[parseInt(index)].id
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
      (index) => users?.data[parseInt(index)].id
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
        Delete {selectedRowCount} {selectedRowCount === 1 ? "User" : "Users"}
      </Button>
    ) : null
  );

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  const userColumns = getUserColumns({
    currentUserRole: user?.role || UserRole.STUDENT,
    onDeleteUser: handleDelete,
    onViewUser: handleView,
    onEditUser: handleEdit,
    onResetPassword: handleResetPassword,
  });

  // If not admin, redirect or show access denied
  if (!isAdmin) {
    return (
      <section className="container mx-auto py-10 space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Button asChild>
          <Link href="/dashboard/users/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New User
          </Link>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={userColumns}
        data={users?.data || []}
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
        rowSelection={true}
        rowSelectionState={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        toolbar={{
          searchPlaceholder: "Search users by name, email, role...",
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
              This action cannot be undone. This will permanently delete the user
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
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
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "user" : "users"}
              and all associated data.
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

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setResetPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmResetPassword}>
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
