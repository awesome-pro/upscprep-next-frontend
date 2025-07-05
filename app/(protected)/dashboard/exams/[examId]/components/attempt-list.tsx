"use client";

import { useState, useEffect } from "react";
import { Attempt, AttemptStatus } from "@/types/exams";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/useProgress";
import { EntityType } from "@/types/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Eye, Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface AttemptListProps {
  attempts: Attempt[];
  examId: string;
}

export function AttemptList({ attempts, examId }: AttemptListProps) {
  const [page, setPage] = useState(1);
  const { getProgress, updateProgress } = useProgress();
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  
  // Fetch progress data for this exam when component mounts
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progress = await getProgress(examId, EntityType.EXAM);
        setProgressData(progress || {});
      } catch (error) {
        console.error("Error fetching exam progress:", error);
      }
    };
    
    fetchProgressData();
  }, [examId, getProgress]);
  
  // Track when user views the attempts list
  useEffect(() => {
    const trackAttemptListView = async () => {
      try {
        await updateProgress({
          entityId: examId,
          entityType: EntityType.EXAM,
          metadata: {
            viewedAttempts: true,
            attemptListViewedAt: new Date().toISOString(),
            attemptCount: attempts.length
          }
        });
      } catch (error) {
        console.error("Error updating exam progress:", error);
      }
    };
    
    trackAttemptListView();
  }, [examId, attempts.length, updateProgress]);
  
  const attemptColumns = [
    {
      accessorKey: "user.name",
      header: "Student",
      cell: ({ row }: { row: any }) => {
        const attempt = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{attempt.user?.name || "Unknown"}</span>
            <span className="text-xs text-muted-foreground">{attempt.user?.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status as AttemptStatus;
        const statusMap: Record<AttemptStatus, { label: string; variant: string; icon: React.ReactNode }> = {
          [AttemptStatus.IN_PROGRESS]: {
            label: "In Progress",
            variant: "outline",
            icon: <Clock className="h-4 w-4 mr-1" />,
          },
          [AttemptStatus.COMPLETED]: {
            label: "Completed",
            variant: "default",
            icon: <CheckCircle className="h-4 w-4 mr-1" />,
          },
          [AttemptStatus.SUBMITTED]: {
            label: "Submitted",
            variant: "secondary",
            icon: <CheckCircle className="h-4 w-4 mr-1" />,
          },
          [AttemptStatus.EVALUATED]: {
            label: "Evaluated",
            variant: "success",
            icon: <CheckCircle className="h-4 w-4 mr-1" />,
          },
          [AttemptStatus.ABANDONED]: {
            label: "Abandoned",
            variant: "destructive",
            icon: <AlertCircle className="h-4 w-4 mr-1" />,
          },
        };
        
        const statusInfo = statusMap[status] || {
          label: status,
          variant: "outline",
          icon: null,
        };
        
        return (
          <Badge variant={statusInfo.variant as any}>
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: "Started",
      cell: ({ row }: { row: any }  ) => {
        return format(new Date(row.original.startTime), "MMM d, yyyy HH:mm");
      },
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }: { row: any }) => {
        const attempt = row.original;
        if (attempt.score === null || attempt.score === undefined) {
          return <span className="text-muted-foreground">Not evaluated</span>;
        }
        
        return (
          <div className="flex flex-col">
            <span className="font-medium">{attempt.score} / {attempt.maxScore}</span>
            {attempt.percentage !== null && attempt.percentage !== undefined && (
              <span className="text-xs text-muted-foreground">
                {attempt.percentage.toFixed(2)}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const attempt = row.original;
        
        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild
                    onClick={() => {
                      // Track when user views a specific attempt
                      updateProgress({
                        entityId: examId,
                        entityType: EntityType.EXAM,
                        metadata: {
                          viewedAttemptId: attempt.id,
                          viewedAttemptAt: new Date().toISOString()
                        }
                      });
                    }}
                  >
                    <Link href={`/dashboard/attempts/${attempt.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View attempt details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {attempt.answerSheetUrl && (
              <Button size="sm" variant="ghost" asChild>
                <a href={attempt.answerSheetUrl} download>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </a>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Student Attempts</CardTitle>
          <CardDescription>
            View and manage student attempts for this exam
          </CardDescription>
          {progressData && progressData.timeSpent > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              You've spent {Math.floor(progressData.timeSpent / 60)} minutes reviewing this exam
            </p>
          )}
        </div>
       <div className="flex gap-2">
        <Button asChild>
            <Link href={`/dashboard/exams/${examId}/attempts/create`}>
              Attempt
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/exams/${examId}/attempts`}>
              View All Attempts
            </Link>
          </Button>
       </div>
      </CardHeader>
      <CardContent>
        {attempts.length > 0 ? (
          <DataTable
            columns={attemptColumns}
            data={attempts}
            defaultPageSize={5}
          />
        ) : (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">No attempts yet for this exam</p>
            <Button asChild>
              <Link href={`/dashboard/exams/${examId}/attempts/create`}>
                Create Attempt
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
