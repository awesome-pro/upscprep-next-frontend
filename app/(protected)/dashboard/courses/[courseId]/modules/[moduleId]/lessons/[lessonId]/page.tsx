"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { lessonService } from "@/services/lesson.service";
import { moduleService } from "@/services/module.service";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Link from "next/link";
import { Edit, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LessonDetail } from "@/components/courses/lesson-detail";
import { useProgress } from "@/hooks/useProgress";
import { EntityType } from "@/types/progress";

export default function LessonDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const lessonId = params.lessonId as string;
  const moduleId = params.moduleId as string;
  const courseId = params.courseId as string;
  const { getProgress, updateProgress } = useProgress();
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Fetch lesson details
  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId, moduleId],
    queryFn: () => lessonService.getLessonById(lessonId, moduleId),
    enabled: !!lessonId && !!moduleId && !!courseId,
  });

  // Fetch module details if moduleId is provided
  const { data: module } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => moduleId ? moduleService.getModuleById(courseId, moduleId) : null,
    enabled: !!moduleId && !!courseId,
  });

  // Load progress data
  useEffect(() => {
    if (lessonId) {
      const fetchProgress = async () => {
        try {
          const progressData = await getProgress(lessonId, EntityType.LESSON);
          if (progressData) {
            setIsCompleted(progressData.isCompleted);
            setTimeSpent(progressData.timeSpent || 0);
          }
        } catch (err) {
          console.error("Error fetching progress data:", err);
        }
      };
      fetchProgress();
    }
  }, [lessonId]);

  // Render content based on content type
  const renderContent = () => {
    if (!lesson) return (
      <section>
        <div className="flex items-center space-x-4">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
          <p className="text-gray-500 mb-4">The lesson you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild variant="outline">
            <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`}>
              Back to Lessons
            </Link>
          </Button>
        </div>
      </section>
    )


    return (
      <section>
        <LessonDetail lesson={lesson} moduleId={moduleId} courseId={courseId} />
      </section>
    );
  };

  if(error){
    return (
      <section className="container mx-auto py-10 space-y-6">
        <div className="flex items-center space-x-4">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
          <p className="text-gray-500 mb-4">The lesson you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild variant="outline">
            <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`}>
              Back to Lessons
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="container mx-auto py-10 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full" />
      </section>
    );
  }

  if (!lesson) {
    return (
      <section className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
          <p className="text-gray-500 mb-4">The lesson you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild variant="outline">
            <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`}>
              Back to Lessons
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-6">
      {/* Lesson Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {lesson.isPreview && (
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                Preview
              </Badge>
            )}
            {lesson.isMandatory && (
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                Mandatory
              </Badge>
            )}
            <Badge variant="outline">
              Order: {lesson.order}
            </Badge>
          </div>
        </div>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Button asChild>
            <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Lesson
            </Link>
          </Button>
        )}
      </div>

      {/* Lesson Description */}
      {lesson.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{lesson.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Module Info */}
      {/* {module && (
        <Card>
          <CardHeader>
            <CardTitle>Module Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Module:</span>
                <Link 
                  href={`/dashboard/courses/${courseId}/modules/${module.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {module.title}
                </Link>
              </div>
              {module.description && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Module Description:</span>
                  <span className="text-right">{module.description.length > 50 ? `${module.description.substring(0, 50)}...` : module.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Lesson Content */}
      {renderContent()}

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">Progress:</span>
              <div className="flex items-center mt-1">
                <div className="text-sm text-muted-foreground">
                  {isCompleted ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Completed
                    </span>
                  ) : (
                    <span>Not completed</span>
                  )}
                </div>
                <div className="mx-4 text-sm text-muted-foreground">
                  Time spent: {Math.floor(timeSpent / 60)} min {timeSpent % 60} sec
                </div>
              </div>
            </div>
            <Button 
              variant={isCompleted ? "outline" : "default"} 
              className={`gap-2 ${isCompleted ? "bg-green-50" : ""}`}
              disabled={isCompleted}
              onClick={async () => {
                try {
                  await updateProgress({
                    entityId: lessonId,
                    entityType: EntityType.LESSON,
                    isCompleted: true,
                    timeSpent: timeSpent
                  });
                  setIsCompleted(true);
                  toast.success("Lesson marked as completed!");
                } catch (err) {
                  toast.error("Failed to mark lesson as completed");
                }
              }}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
