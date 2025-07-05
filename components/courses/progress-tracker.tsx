'use client';

import { useState, useEffect } from 'react';
import { EnrollmentWithCourse } from '@/types/enrollment';
import { enrollmentService } from '@/services/enrollment.service';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ProgressTrackerProps {
  userId?: string;
  limit?: number;
}

export function ProgressTracker({ userId, limit = 3 }: ProgressTrackerProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, [userId, limit]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enrollmentService.getUserEnrollments();
      // Sort by progress percentage (descending) and limit the number of results
      const sortedEnrollments = data
        .sort((a, b) => b.progressPercentage - a.progressPercentage)
        .slice(0, limit);
      setEnrollments(sortedEnrollments);
    } catch (err) {
      setError('Failed to load your course progress. Please try again later.');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="mb-4">You haven't enrolled in any courses yet.</p>
          <Link href="/courses" className="text-primary hover:underline flex items-center justify-center">
            <span>Browse Courses</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enrollment) => (
        <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
          <Link href={`/courses/${enrollment.courseId}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{enrollment.course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-1">
                <span>{Math.round(enrollment.progressPercentage)}% complete</span>
                <span>{enrollment.completedLessons}/{enrollment.totalLessons} lessons</span>
              </div>
              <Progress value={enrollment.progressPercentage} className="h-2 mb-4" />
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>
                    {enrollment.progressPercentage === 100 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      `${enrollment.totalLessons - enrollment.completedLessons} lessons remaining`
                    )}
                  </span>
                </div>
                <span className="text-primary">Continue</span>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
      
      {enrollments.length > 0 && (
        <div className="text-center pt-2">
          <Link href="/dashboard/enrollments" className="text-primary hover:underline text-sm flex items-center justify-center">
            <span>View all enrollments</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
