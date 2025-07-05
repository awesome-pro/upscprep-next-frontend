"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ModuleForm } from "../../components/module-form";
import { moduleService } from "@/services/module.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CourseModuleEditPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const data = await moduleService.getModuleById(courseId, moduleId);
        setModule(data);
      } catch (error) {
        console.error("Error fetching module:", error);
        toast.error("Failed to load module data");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseId, moduleId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Module</h1>
        <p className="text-muted-foreground">
          Update module details and content.
        </p>
      </div>
      
      {module && (
        <ModuleForm 
          courseId={courseId} 
          moduleId={moduleId} 
          initialData={module} 
        />
      )}
    </div>
  );
}
