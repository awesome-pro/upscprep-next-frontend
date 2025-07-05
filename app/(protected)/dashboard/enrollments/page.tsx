'use client';

import React, { useState, useEffect } from 'react';
import { CoursePurchaseCard } from '@/components/payment';
import { toast } from 'sonner';
import { coursesApi } from '@/services';
import { CourseDetailDto, CourseListDto } from '@/types/courses';
import { BookOpen, Loader2, GraduationCap, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseType } from '@/types/enums';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListDto[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await coursesApi.getAllCourses();
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  // Filter courses based on search query and active tab
  useEffect(() => {
    let filtered = [...courses];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by course type
    if (activeTab !== 'all') {
      filtered = filtered.filter(course => {
        if (activeTab === 'prelims') return course.type === CourseType.PRELIMS;
        if (activeTab === 'mains') return course.type === CourseType.MAINS;
        if (activeTab === 'combo') return course.type === CourseType.PRELIMS_MAINS_COMBO;
        return true;
      });
    }
    
    setFilteredCourses(filtered);
  }, [courses, searchQuery, activeTab]);

  const handlePurchaseSuccess = () => {
    toast.success('Course purchase successful!', {
      description: 'You now have access to this course',
      duration: 5000,
    });
    
    // Refresh the courses data to update purchase status
    setTimeout(() => {
      coursesApi.getAllCourses().then(courses => {
        setCourses(courses);
        // Re-apply filters
        let filtered = [...courses];
        if (searchQuery) {
          filtered = filtered.filter(course => 
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        if (activeTab !== 'all') {
          filtered = filtered.filter(course => {
            if (activeTab === 'prelims') return course.type === CourseType.PRELIMS;
            if (activeTab === 'mains') return course.type === CourseType.MAINS;
            if (activeTab === 'combo') return course.type === CourseType.PRELIMS_MAINS_COMBO;
            return true;
          });
        }
        setFilteredCourses(filtered);
      });
    }, 2000);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-3">RPSC Preparation Courses</h1>
          <p className="text-lg text-muted-foreground mb-6">Comprehensive study materials designed to help you excel in your RPSC journey</p>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm">Join thousands of successful aspirants</span>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="prelims">Prelims</TabsTrigger>
            <TabsTrigger value="mains">Mains</TabsTrigger>
            <TabsTrigger value="combo">Combo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading courses...</p>
          <p className="text-sm text-muted-foreground">Please wait while we fetch the best courses for you</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-xl">
          <p className="text-lg font-medium">{error}</p>
          <p className="mt-2">We're experiencing some technical difficulties. Please try again later.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map(course => {
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
          
          {/* Course count */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            {searchQuery && ` for "${searchQuery}"`}
            {activeTab !== 'all' && ` in ${activeTab} category`}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `We couldn't find any courses matching "${searchQuery}"`
              : "There are no courses available in this category yet"}
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setActiveTab('all');
          }}>
            View all courses
          </Button>
        </div>
      )}
      
      {/* Additional info section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8">
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Expert Faculty</h3>
          <p className="text-sm text-muted-foreground">Learn from experienced educators who have helped thousands succeed</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Comprehensive Material</h3>
          <p className="text-sm text-muted-foreground">Access detailed notes, practice questions, and mock tests</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Filter className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Personalized Learning</h3>
          <p className="text-sm text-muted-foreground">Track your progress and get recommendations based on your performance</p>
        </div>
      </div>
    </div>
  );
}
