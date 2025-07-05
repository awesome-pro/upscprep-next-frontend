'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CoursePurchaseCard } from '@/components/payment';
import { useCourseEnrollments } from '@/hooks/use-course-enrollments';
import { Loader2, BookOpen, CheckCircle2, Clock, Users, Calendar, Award, PlayCircle, ShoppingCart } from 'lucide-react';
import { coursesApi } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PaymentButton } from '@/components/payment-button';
import { PurchaseType } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


export default function CourseDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { isEnrolled, getEnrollmentByCourseId } = useCourseEnrollments();
  
  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
  
  // Get enrollment details if enrolled
  const enrollment = course ? getEnrollmentByCourseId(course.id) : undefined;
  const hasAccess = course ? isEnrolled(course.id) : false;
  
  // Calculate progress if enrolled
  const progress = enrollment ? Math.round((enrollment.completedLessons / (enrollment.totalLessons || 1)) * 100) : 0;

  // Handle course purchase
  const handlePurchase = () => {
    router.push(`/enrollments/${id}`);
  };

  // Handle continue learning
  const handleContinueLearning = () => {
    router.push(`/dashboard/courses/${id}`);
  };

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-10 w-3/4 bg-muted rounded-md animate-pulse mb-4"></div>
            <div className="h-6 w-1/2 bg-muted rounded-md animate-pulse mb-8"></div>
            
            <div className="h-10 w-full bg-muted rounded-md animate-pulse mb-4"></div>
            <div className="h-64 w-full bg-muted rounded-md animate-pulse"></div>
          </div>
          <div>
            <div className="h-64 w-full bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load course</h2>
            <p className="text-red-500 dark:text-red-300">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No course found
  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-2">Course not found</h2>
            <p className="text-amber-500 dark:text-amber-300">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => router.push('/dashboard/courses')}
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePurchaseSuccess = () => {
      toast.success('Course purchase successful!', {
        description: 'You now have access to this course',
        duration: 5000,
      });
      
      setTimeout(() => {
        router.refresh();
      }, 2000);
    };
    

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={course.isPremium ? "secondary" : "outline"}>
                {course.isPremium ? "Premium" : "Standard"}
              </Badge>
              <Badge variant="outline">{course.type}</Badge>
              <Badge variant="outline">{course.subject}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                  <CardDescription>What you'll learn in this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      <span>{course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} Lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span>{course.totalDuration || course.duration} Hours</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>{course.totalStudents} Students</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {hasAccess ? (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 dark:text-green-500" />
                        <h3 className="font-semibold text-green-800 dark:text-green-400">You have access to this course</h3>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        You can access all lessons and materials in this course.
                      </p>
                      
                      {enrollment && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Your progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="mt-3 text-sm text-green-700 dark:text-green-300">
                            {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="mt-4 w-full" 
                        onClick={handleContinueLearning}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-semibold mb-2">Course Content Preview</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Purchase this course to access all lessons and materials.
                      </p>
                      <ul className="space-y-2">
                        {course.modules.slice(0, 2).map((module, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{module.title} (Preview)</span>
                          </li>
                        ))}
                        {course.modules.slice(2).map((module, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{module.title} (Locked)</span>
                          </li>
                        ))}
                      </ul>
                      
                      <PaymentButton
                          type={PurchaseType.COURSE}
                          courseId={course.id}
                          amount={course.price}
                          title={`Purchase ${course.title}`}
                          className={cn(
                            "w-full transition-all", 
                            course?.isPurchased ? "bg-green-600 hover:bg-green-700" : ""
                          )}
                          onSuccess={handlePurchaseSuccess}
                          disabled={course?.isPurchased}
                        />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="syllabus" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Syllabus</CardTitle>
                  <CardDescription>Detailed breakdown of course content</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasAccess ? (
                    <ul className="space-y-4">
                      {course.modules.map((module, index) => (
                        <li key={index} className="border-b pb-4 last:border-0">
                          <div className="font-medium flex items-center">
                            <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                              {index + 1}
                            </span>
                            {module.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {module.lessons?.length || 0} lessons • {module.lessons?.reduce((acc, lesson) => acc + (lesson.videoDuration || 0), 0)} minutes
                          </div>
                          {module.description && (
                            <div className="text-sm mt-1">{module.description}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p className="text-muted-foreground mb-4">
                        Purchase this course to see the full syllabus.
                      </p>
                      <ul className="space-y-4">
                        {course.modules.slice(0, 2).map((module, index) => (
                          <li key={index} className="border-b pb-4 last:border-0">
                            <div className="font-medium flex items-center">
                              <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                                {index + 1}
                              </span>
                              {module.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {module.lessons?.length || 0} lessons • Preview available
                            </div>
                          </li>
                        ))}
                        {course.modules.slice(2).map((module, index) => (
                          <li key={index} className="border-b pb-4 last:border-0 opacity-60">
                            <div className="font-medium flex items-center">
                              <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                                {index + 2 + 1}
                              </span>
                              {module.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {module.lessons?.length || 0} lessons • Locked
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full" 
                        onClick={handlePurchase}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase to Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructors" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Instructors</CardTitle>
                  <CardDescription>Learn from the best in the field</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                        {course.teacherName?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <div className="font-medium text-lg">{course.teacherName || 'Expert Instructor'}</div>
                        <div className="text-sm text-muted-foreground mb-2">Lead Instructor</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" /> UPSC Expert
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" /> {course.totalStudents}+ students
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm">
                          Experienced educator specialized in {course.subject} with a proven track record of helping students succeed in competitive exams.
                        </p>
                      </div>
                    </div>
                    
                    {hasAccess ? (
                      <Button 
                        className="mt-4 w-full" 
                        onClick={handleContinueLearning}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full" 
                        onClick={handlePurchase}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase Course
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-4">
            {hasAccess ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle>Continue Your Learning</CardTitle>
                  <CardDescription>You have full access to this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4 text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Access granted {enrollment?.endDate ? `until ${new Date(enrollment.endDate).toLocaleDateString()}` : 'with lifetime access'}</span>
                  </div>
                  
                  {enrollment && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Your progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="mt-2 text-xs text-muted-foreground">
                        {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <Button className="w-full" onClick={handleContinueLearning}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-2">What you get:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Full lifetime access
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          {course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} on-demand lessons
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Progress tracking
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Downloadable resources
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Enroll in this course</CardTitle>
                    <Badge>{course.type}</Badge>
                  </div>
                  <CardDescription>Get full access to all course materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-1">
                      ₹{course.price.toLocaleString()}
                    </div>
                    {course.isPremium && (
                      <Badge variant="secondary" className="mt-1">
                        Premium Course
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <PaymentButton
                      type={PurchaseType.COURSE}
                      courseId={course.id}
                      amount={course.price}
                      title={`Purchase ${course.title}`}
                      className={cn(
                        "w-full transition-all", 
                        course?.isPurchased ? "bg-green-600 hover:bg-green-700" : ""
                      )}
                      onSuccess={handlePurchaseSuccess}
                      disabled={course?.isPurchased}
                    />
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-2">What you'll get:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Full access to all {course.modules.length} modules
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          {course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} on-demand lessons
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Progress tracking
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                          Downloadable resources
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
