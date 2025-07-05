"use client";

import { useParams } from "next/navigation";
import { ModuleForm } from "../components/module-form";

export default function CourseModuleCreatePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="p-4 md:p-6 lg:p-8">
     <div>
      <h1 className="text-3xl font-bold tracking-tight">Create New Module</h1>
        <p className="text-muted-foreground">
          Add a new module to your course with lessons and content.
        </p>
     </div>
      
      <ModuleForm courseId={courseId} />
    </div>
  );
}
