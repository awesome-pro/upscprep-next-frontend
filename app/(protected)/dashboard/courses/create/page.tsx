"use client";

import { CourseForm } from "../components/course-form";

export default function CourseCreatePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground">
          Add a new course with details, features, and images.
        </p>
      </div>
      
      <CourseForm />
    </div>
  );
}
