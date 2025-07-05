"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Download, Trash2 } from "lucide-react";
import { Attempt, AttemptStatus } from "@/types/exams";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { UserRole } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AttemptColumnProps {
  userRole: UserRole;
  onViewAttempt?: (id: string) => void;
  onViewAnswerSheet?: (id: string) => void;
  onDownloadResults?: (id: string) => void;
}

// Helper function to get badge variant based on attempt status
const getStatusBadgeVariant = (status: AttemptStatus) => {
  switch (status) {
    case AttemptStatus.COMPLETED:
      return "success";
    case AttemptStatus.IN_PROGRESS:
      return "warning";
    case AttemptStatus.SUBMITTED:
      return "default";
    case AttemptStatus.EVALUATED:
      return "default";
    default:
      return "outline";
  }
};

export const getColumns = ({
  userRole,
  onViewAttempt,
  onViewAnswerSheet,
  onDownloadResults,
}: AttemptColumnProps): ColumnDef<Attempt>[] => {
  const columns: ColumnDef<Attempt>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => {
        const attempt = row.original;
        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-medium truncate">{attempt.user?.name || "Unknown"}</span>
            <span className="text-xs text-muted-foreground truncate">
              {attempt.user?.email || "No email"}
            </span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const badgeVariant = getStatusBadgeVariant(status);
        
        return (
          <Badge variant={badgeVariant}>{status}</Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Started" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.startTime);
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "submitTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Submitted" />
      ),
      cell: ({ row }) => {
        const submitTime = row.original.submitTime;
        if (!submitTime) return <span className="text-muted-foreground text-sm">Not submitted</span>;
        
        const date = new Date(submitTime);
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Score" />
      ),
      cell: ({ row }) => {
        const attempt = row.original;
        if (attempt.score === undefined) return <span className="text-muted-foreground text-sm">Not evaluated</span>;
        
        return (
          <div className="font-medium">
            {attempt.score} / {attempt.maxScore}
            {attempt.percentage !== undefined && (
              <div className="text-xs text-muted-foreground">
                {attempt.percentage.toFixed(1)}%
              </div>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "accuracy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Accuracy" />
      ),
      cell: ({ row }) => {
        const accuracy = row.original.accuracy;
        if (accuracy === undefined) return <span className="text-muted-foreground text-sm">N/A</span>;
        
        return (
          <div className="font-medium">
            {(accuracy * 100).toFixed(1)}%
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "rank",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rank" />
      ),
      cell: ({ row }) => {
        const rank = row.original.rank;
        if (rank === undefined) return <span className="text-muted-foreground text-sm">N/A</span>;
        
        return (
          <div className="font-medium">
            #{rank}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <div className="text-right">
          <DataTableColumnHeader column={column} title="Actions" />
        </div>
      ),
      cell: ({ row }) => {
        const attempt = row.original;

        return (
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>  
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onViewAttempt?.(attempt.id)}
                  title="View attempt details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={5}>
                View attempt details
              </TooltipContent>
            </Tooltip>

            {attempt.answerSheetUrl && (
              <Tooltip>
                <TooltipTrigger asChild>  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onViewAnswerSheet?.(attempt.id)}
                    title="View answer sheet"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  View answer sheet
                </TooltipContent>
              </Tooltip>
            )}

            {(attempt.status === AttemptStatus.EVALUATED || attempt.status === AttemptStatus.COMPLETED) && (
              <Tooltip>
                <TooltipTrigger asChild>  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDownloadResults?.(attempt.id)}
                    title="Download results"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  Download results
                </TooltipContent>
              </Tooltip>
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
