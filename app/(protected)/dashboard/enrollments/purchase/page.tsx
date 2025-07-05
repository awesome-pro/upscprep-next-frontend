'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursePurchaseCard, TestSeriesPurchaseCard } from '@/components/payment';
import { CourseType, ExamType } from '@/types/enums';
import { toast } from 'sonner';
import { coursesApi, testSeriesApi } from '@/services';
import { CourseDetailDto, CourseListDto } from '@/types/courses';
import { TestSeriesDetailDto, TestSeriesListDto } from '@/types/test-series';
import { Loader2 } from 'lucide-react';

export default function PurchasePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<CourseListDto[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeriesListDto[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    testSeries: true
  });
  const [error, setError] = useState({
    courses: null as string | null,
    testSeries: null as string | null
  });

  // Fallback IDs in case API fails
  const fallbackCourseIds = {
    [CourseType.PRELIMS]: 'prelims-course-id',
    [CourseType.MAINS]: 'mains-course-id',
    [CourseType.PRELIMS_MAINS_COMBO]: 'combo-course-id',
  };

  const fallbackTestSeriesIds = {
    PRELIMS: 'prelims-test-series-id',
    MAINS: 'mains-test-series-id',
  };

  useEffect(() => {
    // Fetch all data on initial load only
    const fetchAllData = async () => {
      try {
        // Fetch courses
        setLoading(prev => ({ ...prev, courses: true }));
        const coursesPromise = coursesApi.getAllCourses();
        
        // Fetch test series
        setLoading(prev => ({ ...prev, testSeries: true }));
        const testSeriesPromise = testSeriesApi.getAllTestSeries();
        
        // Wait for both requests to complete
        const [coursesData, testSeriesData] = await Promise.all([coursesPromise, testSeriesPromise]);
        
        // Update state with fetched data
        setCourses(coursesData);
        setTestSeries(testSeriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError({
          courses: 'Failed to load courses',
          testSeries: 'Failed to load test series'
        });
      } finally {
        setLoading({
          courses: false,
          testSeries: false
        });
      }
    };

    fetchAllData();
  }, []);

  const handlePurchaseSuccess = () => {
    toast.success('Purchase successful!');
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };
  
  // Get course IDs from fetched courses or use fallback
  const getCourseId = (type: CourseType) => {
    const course = courses.find(c => c.type === type);
    return course?.id || fallbackCourseIds[type];
  };
  
  // Get test series IDs from fetched test series or use fallback
  const getTestSeriesId = (type: ExamType) => {
    const series = testSeries.find(ts => ts.type === type);
    return series?.id || fallbackTestSeriesIds[type as keyof typeof fallbackTestSeriesIds] || '';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Purchase UPSC Preparation Materials</h1>
      
      <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="test-series">Test Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          {loading.courses ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading courses...</p>
            </div>
          ) : error.courses ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              <p>{error.courses}</p>
              <p className="mt-2">Showing default course options.</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                // Find detailed course data if available
                const courseDetail = course as unknown as CourseDetailDto;
                return (
                  <CoursePurchaseCard 
                    key={course.id}
                    courseId={course.id}
                    courseType={course.type}
                    title={course.title}
                    description={course.description || undefined}
                    onPurchaseSuccess={handlePurchaseSuccess}
                    showFullDetails
                    courseData={courseDetail}
                  />
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoursePurchaseCard 
                courseId={getCourseId(CourseType.PRELIMS)}
                courseType={CourseType.PRELIMS}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
              
              <CoursePurchaseCard 
                courseId={getCourseId(CourseType.MAINS)}
                courseType={CourseType.MAINS}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
              
              <CoursePurchaseCard 
                courseId={getCourseId(CourseType.PRELIMS_MAINS_COMBO)}
                courseType={CourseType.PRELIMS_MAINS_COMBO}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="test-series" className="mt-6">
          {loading.testSeries ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading test series...</p>
            </div>
          ) : error.testSeries ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              <p>{error.testSeries}</p>
              <p className="mt-2">Showing default test series options.</p>
            </div>
          ) : testSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testSeries.map(series => {
                // Find detailed test series data if available
                const seriesDetail = series as unknown as TestSeriesDetailDto;
                return (
                  <TestSeriesPurchaseCard 
                    key={series.id}
                    testSeriesId={series.id}
                    testSeriesType={series.type}
                    title={series.title}
                    description={series.description || undefined}
                    onPurchaseSuccess={handlePurchaseSuccess}
                    showFullDetails
                    testSeriesData={seriesDetail}
                  />
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TestSeriesPurchaseCard 
                testSeriesId={getTestSeriesId(ExamType.PRELIMS)}
                testSeriesType={ExamType.PRELIMS}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
              
              <TestSeriesPurchaseCard 
                testSeriesId={getTestSeriesId(ExamType.MAINS)}
                testSeriesType={ExamType.MAINS}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
