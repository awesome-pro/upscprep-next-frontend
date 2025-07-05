"use client";

import { useParams, notFound } from 'next/navigation';
import { moduleService } from '@/services/module.service';
import { lessonService } from '@/services/lesson.service';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText, 
  Film, 
  GraduationCap, 
  LayoutGrid, 
  List, 
  LoaderPinwheelIcon, 
  Lock, 
  PlusCircle, 
  Sparkles, 
  Video 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from "@/types";
import { LessonOrderBy, OrderDirection } from '@/types/lesson';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ModuleDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const moduleId = params.moduleId as string;
  const courseId = params.courseId as string;
  
  // Module data
  const {
    data: module,
    isLoading: moduleLoading,
    error: moduleError,
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      if (!courseId) return null;
      return await moduleService.getModuleById(courseId, moduleId);
    },
    enabled: !!moduleId && !!courseId,
  });

  // Top 5 lessons data
  const {
    data: topLessons,
    isLoading: lessonsLoading,
  } = useQuery({
    queryKey: ['topLessons', moduleId],
    queryFn: async () => {
      if (!moduleId) return { data: [], meta: { total: 0 } };
      return await lessonService.getPaginatedLessons(moduleId, {
        pageSize: 5,
        page: 1,
        orderBy: LessonOrderBy.ORDER,
        orderDirection: OrderDirection.ASC
      });
    },
    enabled: !!moduleId,
  });

  if (moduleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <LoaderPinwheelIcon className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading module details...</p>
      </div>
    );
  }

  if (moduleError || !module) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 sm:px-6">
      {/* Hero Section with Module Info */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative z-10">
          {/* Module Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
                  Module {module.order}
                </Badge>
                {module.isActive ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Inactive
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{module.title}</h1>
            </div>
            
            {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
              <div className="flex gap-3 self-start sm:self-center">
                <Button asChild variant="outline" size="sm" className="h-9">
                  <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/edit`}>
                    Edit Module
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-9">
                  <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/create`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Lesson
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Module Description */}
          {module.description && (
            <div className="mb-6 max-w-3xl">
              <p className="text-muted-foreground">{module.description}</p>
            </div>
          )}
          
          {/* Module Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{module.lessonCount || 0} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Created {new Date(module.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Updated {new Date(module.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Module Images Gallery */}
      {module.images?.length && module.images.length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Module Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {module.images.map((image, index) => (
                <div key={index} className="relative aspect-video group overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`Module Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="h-8">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Top Lessons Section */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Featured Lessons
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`}>
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardDescription>Start learning with these lessons</CardDescription>
        </CardHeader>
        
        <CardContent>
          {lessonsLoading ? (
            <div className="flex justify-center py-8">
              <LoaderPinwheelIcon className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : topLessons && topLessons.data.length > 0 ? (
            <div className="space-y-1">
              {topLessons.data.map((lesson, index) => (
                <div key={lesson.id}>
                  {index > 0 && <Separator className="my-2" />}
                  <Link 
                    href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                    className="group"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-full",
                          lesson.isPreview ? "bg-primary/20" : "bg-muted"
                        )}>
                        </div>
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                            </span>
                            {lesson.isPreview && (
                              <span className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                  Preview
                                </Badge>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {!lesson.isPreview && user?.role === UserRole.STUDENT && (
                          <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No lessons yet</h3>
              <p className="text-muted-foreground mb-4">This module doesn't have any lessons yet.</p>
              {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
                <Button asChild>
                  <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/create`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create First Lesson
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`}>
              View All Lessons
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
