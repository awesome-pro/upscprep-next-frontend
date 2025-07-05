import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, BookOpen, Users, Briefcase } from "lucide-react";
import { UserList, UserStatus } from "@/types/user";
import { UserRole } from "@/types/enums";
import Link from "next/link";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Define badge variants for user status
const getUserStatusBadgeVariant = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return "success";
    case UserStatus.VERIFICATION_PENDING:
      return "warning";
    case UserStatus.INACTIVE:
      return "secondary";
    case UserStatus.SUSPENDED:
      return "destructive";
    case UserStatus.DELETED:
      return "outline";
    default:
      return "default";
  };
};

// Define badge variants for user role
const getUserRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "destructive";
    case UserRole.TEACHER:
      return "secondary";
    case UserRole.STUDENT:
      return "default";
    default:
      return "outline";
  };
};

interface UserColumnProps {
  currentUserRole: UserRole;
  onDeleteUser?: (id: string) => void;
  onViewUser?: (id: string) => void;
  onEditUser?: (id: string) => void;
  onViewEnrollments?: (id: string) => void;
  onViewProgress?: (id: string) => void;
  onResetPassword?: (id: string) => void;
  onViewContent?: (id: string) => void;
  onViewStudents?: (id: string) => void;
}

export const getStudentColumns = ({
  currentUserRole,
  onDeleteUser,
  onViewUser,
  onEditUser,
  onViewEnrollments,
  onViewProgress,
}: UserColumnProps): ColumnDef<UserList>[] => {
  const columns: ColumnDef<UserList>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col">
            <Link 
              href={`/dashboard/users/students/${user.id}`}
              className="font-medium hover:underline"
            >
              {user.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.getValue("phoneNumber") || "N/A",
    },
    {
      accessorKey: "enrollmentDate",
      header: "Enrolled",
      cell: ({ row }) => {
        const date = row.getValue("enrollmentDate");
        if (!date) return "N/A";
        return format(new Date(date as string), "yyyy-MM-dd");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        return (
          <Badge variant={getUserStatusBadgeVariant(status)}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      id: "enrollments",
      header: "Enrollments",
      cell: ({ row }) => {
        const courseEnrollments = row.original._count?.courseEnrollments || 0;
        const testSeriesEnrollments = row.original._count?.testSeriesEnrollments || 0;
        return (
          <div className="flex flex-col">
            <span>Courses: {courseEnrollments}</span>
            <span>Test Series: {testSeriesEnrollments}</span>
          </div>
        );
      },
    },
    {
      id: "attempts",
      header: "Attempts",
      cell: ({ row }) => row.original._count?.attempts || 0,
    },
  ];

  // Add actions column
  columns.push({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewUser?.(user.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View profile</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewEnrollments?.(user.id)}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View enrollments</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewProgress?.(user.id)}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View progress</TooltipContent>
          </Tooltip>
          
          {currentUserRole === UserRole.ADMIN && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditUser?.(user.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Edit student</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => onDeleteUser?.(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Delete student</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  });

  return columns;
};

export const getTeacherColumns = ({
  currentUserRole,
  onDeleteUser,
  onViewUser,
  onEditUser,
  onViewContent,
  onViewStudents,
}: UserColumnProps): ColumnDef<UserList>[] => {
  const columns: ColumnDef<UserList>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col">
            <Link 
              href={`/dashboard/users/teachers/${user.id}`}
              className="font-medium hover:underline"
            >
              {user.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.getValue("phoneNumber") || "N/A",
    },
    {
      accessorKey: "enrollmentDate",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("enrollmentDate");
        if (!date) return "N/A";
        return format(new Date(date as string), "yyyy-MM-dd");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        return (
          <Badge variant={getUserStatusBadgeVariant(status)}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      id: "content",
      header: "Content",
      cell: ({ row }) => {
        const courses = row.original._count?.createdCourses || 0;
        const exams = row.original._count?.createdExams || 0;
        const testSeries = row.original._count?.createdTestSeries || 0;
        return (
          <div className="flex flex-col">
            <span>Courses: {courses}</span>
            <span>Test Series: {testSeries}</span>
            <span>Exams: {exams}</span>
          </div>
        );
      },
    },
  ];

  // Add actions column
  columns.push({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewUser?.(user.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View profile</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewContent?.(user.id)}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View content</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewStudents?.(user.id)}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View students</TooltipContent>
          </Tooltip>
          
          {currentUserRole === UserRole.ADMIN && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditUser?.(user.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Edit teacher</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => onDeleteUser?.(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Delete teacher</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  });

  return columns;
};

export const getUserColumns = ({
  currentUserRole,
  onDeleteUser,
  onViewUser,
  onEditUser,
  onResetPassword,
}: UserColumnProps): ColumnDef<UserList>[] => {
  const columns: ColumnDef<UserList>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col">
            <Link 
              href={`/dashboard/users/${user.id}`}
              className="font-medium hover:underline"
            >
              {user.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        return (
          <Badge variant={getUserRoleBadgeVariant(role)}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.getValue("phoneNumber") || "N/A",
    },
    {
      accessorKey: "enrollmentDate",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("enrollmentDate");
        if (!date) return "N/A";
        return format(new Date(date as string), "yyyy-MM-dd");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        return (
          <Badge variant={getUserStatusBadgeVariant(status)}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "walletBalance",
      header: "Wallet",
      cell: ({ row }) => {
        const balance = row.getValue("walletBalance");
        if (balance === undefined || balance === null) return "N/A";
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balance as number);
      },
    },
  ];

  // Add actions column
  columns.push({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewUser?.(user.id)}>
              <Eye className="mr-2 h-4 w-4" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditUser?.(user.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit user
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword?.(user.id)}>
              <Briefcase className="mr-2 h-4 w-4" /> Reset password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDeleteUser?.(user.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  return columns;
};
