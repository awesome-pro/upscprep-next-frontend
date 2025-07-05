"use client";


import { notFound, useParams } from 'next/navigation';
import { CourseDetailComponent } from '@/components/courses/course-detail';
import { courseService } from '@/services/course.service';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/loading';
import Error from '@/components/error';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const {
      data: course,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['course', courseId],
      queryFn: async () => {
        return await courseService.getCourseById(courseId);
      },
      enabled: !!courseId,
    });

    if (error) {
      return <Error error={error} />;
    }

    if (isLoading) {
      return <Loading />
    }
    
    return (
        <CourseDetailComponent course={course!} />
    );
}
