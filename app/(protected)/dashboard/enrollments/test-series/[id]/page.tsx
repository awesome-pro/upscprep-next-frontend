"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// Icons
import { ArrowLeft, BookOpen, CheckCircle2, Clock, FileText, GraduationCap, Users, AlertCircle, LockIcon, UnlockIcon, ExternalLink, ArrowRight } from 'lucide-react';

// Hooks & Services
import { useTestSeriesEnrollments } from '@/hooks/use-test-series-enrollments';

// Types
import { TestSeriesDetailDto } from '@/types/test-series';
import { testSeriesApi } from '@/services';
import { PaymentButton } from '@/components/payment-button';
import { PurchaseType } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function TestSeriesEnrollmentPage() {
  const params = useParams<{ id: string }>();
  const { getEnrollmentById, isLoading: isLoadingEnrollment } = useTestSeriesEnrollments();
  const router = useRouter();

  // Fetch test series details
  const { data: testSeries, isLoading, error } = useQuery<TestSeriesDetailDto>({
    queryKey: ['test-series', params.id],
    queryFn: () => params.id ? 
      testSeriesApi.getTestSeriesById(params.id).then(res => res) : 
      Promise.reject('No test series ID found'),
    enabled: !!params.id,
  });

  const handlePurchaseSuccess = () => {
      toast.success('Purchase successful!');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    };
  

  // Handle loading state
  if (isLoadingEnrollment || isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content - left side */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="exams">Exams</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Skeleton className="h-32 w-full" />
              </TabsContent>
              
              <TabsContent value="exams" className="space-y-4 mt-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - right side */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !testSeries) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600 dark:text-amber-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Test Series
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>We couldn't load the test series details. Please try again later.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/enrollments">Return to Enrollments</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate progress
  const progress = 0;
  const completedTests = 0;
  const totalTests = testSeries.totalTests || 0;
  
  return (
    <div className="container p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - left side */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{testSeries.title}</h1>
            <p className="text-muted-foreground mt-1">{testSeries.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {testSeries.type}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {testSeries.duration} days
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {testSeries.totalTests} exams
              </Badge>
            </div>
            
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-1" />
              <span className="mr-4">Instructor: {testSeries.teacherName}</span>
              
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated: {new Date(testSeries.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exams">Exams ({testSeries.exams.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About this Test Series</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {testSeries.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{testSeries.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exams" className="space-y-4 mt-4">
              {testSeries.exams.length > 0 ? (
                <div className="space-y-3">
                  {testSeries.exams.map((exam) => (
                    <Card key={exam.id} className={!exam.isAccessible ? "opacity-80" : ""}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          {exam.isAccessible ? (
                            <UnlockIcon className="h-5 w-5 mr-3 text-green-500" />
                          ) : (
                            <LockIcon className="h-5 w-5 mr-3 text-amber-500" />
                          )}
                          <div>
                            <h3 className="font-medium">{exam.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="mr-3">{exam.duration} mins</span>
                              <FileText className="h-3 w-3 mr-1" />
                              <span className="mr-3">{exam.totalQuestions} questions</span>
                              <span>{exam.totalMarks} marks</span>
                            </div>
                          </div>
                        </div>
                        
                        {exam.isAccessible ? (
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/exams/${exam.id}`}>
                              Start
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No exams available in this test series.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - right side */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Your Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4 text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {/* <span>Access granted {testSeries?.endDate ? `until ${new Date(testSeries.endDate).toLocaleDateString()}` : 'with lifetime access'}</span> */}
              </div>
              
              <div className="space-y-4">
                  

                  {
                    testSeries?.isPurchased ? (
                      <Button className="w-full" asChild>
                        <Link href={`/dashboard/test-series/${testSeries.id}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                    ) : (
                     <PaymentButton
                               type={PurchaseType.TEST_SERIES}
                               testSeriesId={testSeries.id}
                               amount={testSeries.price}
                               title={testSeries.title}
                               className="w-full"
                               onSuccess={handlePurchaseSuccess}
                               disabled={testSeries?.isPurchased}
                             />
                    )
                  }
                </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">What you get:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">{testSeries.totalTests} practice exams</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Detailed performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Access for {testSeries.duration} days</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TestSeriesEnrollmentPage;