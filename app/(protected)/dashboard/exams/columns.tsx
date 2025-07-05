"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash, FilePlus, BookOpen, Trash2 } from "lucide-react";
import { Exam } from "@/types/exams";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { 
  getExamTypeBadgeVariant, 
  getTestTypeBadgeVariant,
  formatDuration,
} from "./column-helpers";
import { UserRole } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ExamColumnProps {
  userRole: UserRole;
  onDeleteExam?: (id: string) => void;
  onViewExam?: (id: string) => void;
  onEditExam?: (id: string) => void;
  onViewAttempts?: (id: string) => void;
}

export const getColumns = ({
  userRole,
  onDeleteExam,
  onViewExam,
  onEditExam,
  onViewAttempts,
}: ExamColumnProps): ColumnDef<Exam>[] => {
  const columns: ColumnDef<Exam>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const exam = row.original;
      return (
        <div className="flex flex-col max-w-[500px]">
          <span className="font-medium truncate">{exam.title}</span>
          <span className="text-xs text-muted-foreground truncate">
            {exam.description || "No description"}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const exam = row.original;
      const examTypeBadgeVariant = getExamTypeBadgeVariant(exam.type);
      
      return (
          <Badge variant={examTypeBadgeVariant}>{exam.type}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "testType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Test Type" />
    ),
    cell: ({ row }) => {
      const testTypeBadgeVariant = getTestTypeBadgeVariant(row.original.testType);
      return (
          <Badge variant={testTypeBadgeVariant}>{row.original.testType}</Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate">
          {row.original.subject || "N/A"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const duration = row.original.duration;
      return formatDuration(duration);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalMarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marks" />
    ),
    cell: ({ row }) => {
      return row.original.totalMarks;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "isFree",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pricing" />
    ),
    cell: ({ row }) => {
      const exam = row.original;
      if (exam.isFree) {
        return <Badge variant="outline">Free</Badge>;
      }
      return (
        <h3 className="font-medium">
          ₹{(exam.cost / 100).toFixed(2)}
        </h3>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "free") return row.original.isFree;
      if (value === "paid") return !row.original.isFree;
      return true;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.original.isActive ? (
        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "active") return row.original.isActive;
      if (value === "inactive") return !row.original.isActive;
      return true;
    },
    enableSorting: true,
    enableHiding: true,
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Created" />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.original.createdAt);
  //     return (
  //       <h3 className="text-xs text-muted-foreground">
  //           {date.toLocaleDateString()}
  //       </h3>
  //     );
  //   },
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="text-right">
        <DataTableColumnHeader column={column} title="Actions" />
      </div>
    ),
    cell: ({ row }) => {
      const exam = row.original;

      return (
        <div className="flex justify-end">
          <Tooltip>
            <TooltipTrigger asChild>  
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onViewExam?.(exam.id)}
            title="View exam details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={5}>
            View exam details
          </TooltipContent>
          </Tooltip>

          
          <Tooltip>
            <TooltipTrigger asChild>  
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewAttempts?.(exam.id)}
                title="View attempts"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>
              View attempts
            </TooltipContent>
          </Tooltip>

          {(userRole === UserRole.ADMIN || userRole === UserRole.TEACHER) && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                          <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEditExam?.(exam.id)}
                          title="Edit exam"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={5}>
                            Edit course
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => onDeleteExam?.(exam.id)}
                          title="Delete exam"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={5}>
                            Delete course
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

return columns;
};
