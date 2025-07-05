"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CourseForm } from "../../components/course-form";
import { courseService } from "@/services/course.service";
import { toast } from "sonner";
import { Loader2, Loader2Icon, LoaderIcon } from "lucide-react";

export default function CourseEditPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        <p className="text-muted-foreground">
          Update course details, features, and images.
        </p>
      </div>
      
      {course && (
        <CourseForm 
          courseId={courseId} 
          initialData={course} 
        />
      )}
    </div>
  );
}
