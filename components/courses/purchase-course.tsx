'use client';

import { useState } from 'react';
import { Course } from '@/types/course';
import { enrollmentService } from '@/services/enrollment.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PurchaseCourseProps {
  course: Course;
  isEnrolled?: boolean;
}

export function PurchaseCourse({ course, isEnrolled = false }: PurchaseCourseProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (course.price > 0) {
        // For paid courses, redirect to payment page
        router.push(`/courses/${course.id}/checkout`);
        return;
      }
      
      // For free courses, directly enroll
      await enrollmentService.enrollInCourse(course.id);
      router.refresh(); // Refresh the page to show enrollment status
    } catch (err) {
      setError('Failed to enroll in the course. Please try again later.');
      console.error('Error enrolling in course:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Course Enrollment</CardTitle>
        <CardDescription>
          {isEnrolled ? 'You are enrolled in this course' : 'Enroll now to access all course content'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold text-lg">
            {formatPrice(course.price)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Access Duration</span>
          <span className="font-medium">
            {formatDuration(course.duration)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Course Type</span>
          <Badge variant="outline">{course.type}</Badge>
        </div>
        
        <div className="pt-4 space-y-3">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Full access to all {course.totalModules} modules</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Practice tests and quizzes</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Download study materials</span>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>{formatDuration(course.duration)} of access</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {isEnrolled ? (
          <Button className="w-full" variant="secondary" disabled>
            Already Enrolled
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleEnroll} 
            disabled={loading}
          >
            {loading ? 'Processing...' : course.price > 0 ? 'Purchase Course' : 'Enroll for Free'}
          </Button>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {course.price > 0 && (
          <div className="flex items-center justify-center text-xs text-muted-foreground w-full">
            <ShieldCheck className="h-3 w-3 mr-1" />
            <span>Secure payment</span>
            <CreditCard className="h-3 w-3 mx-1" />
            <span>Multiple payment options</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
