"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreateLessonDto } from "@/types/lesson";
import { lessonService } from "@/services/lesson.service";
import { moduleService } from "@/services/module.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MultiFileUpload } from "@/components/multi-file-upload";

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.coerce.number().int().min(0, "Order must be a positive number"),
  textContent: z.string().optional(),
  videoUrls: z.array(z.string().url("Must be a valid URL")).optional(),
  fileUrls: z.array(z.string().url("Must be a valid URL")).optional(),
  isPreview: z.boolean(),
  isMandatory: z.boolean(),
});

export default function CreateLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const [files, setFiles] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get moduleId from URL query params
  const moduleId = params.moduleId as string;
  const courseId = params.courseId as string;
  
  // Fetch module details
  const { data: module } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => moduleId ? moduleService.getModuleById(courseId, moduleId) : null,
    enabled: !!moduleId,
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      textContent: "",
      videoUrls: [],
      fileUrls: [],
      isPreview: false,
      isMandatory: false,
    },
  });

  // Check if user has permission
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER) {
      toast.error("You don't have permission to create lessons.");
      router.push("/dashboard");
    }
    
    if (!moduleId) {
      toast.error("Module ID is required to create a lesson.");
      router.push(`/dashboard/courses/${courseId}/modules/${moduleId}`);
    }
  }, [user, router, moduleId]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!moduleId) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data based on content type
      const lessonData: CreateLessonDto = {
        ...values,
        fileUrls: files,
        videoUrls: videoUrls,
        textContent: values.textContent || "",
      };
      
      await lessonService.createLesson(moduleId, lessonData);
      
      toast.success("Lesson created successfully.");
      setTimeout(() => {
        router.push(`/dashboard/courses/${courseId}/modules/${moduleId}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Failed to create lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!moduleId) {
    return (
      <section className="container mx-auto py-10">
        <p>Redirecting to modules page...</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Create New Lesson</h1>
        {module && (
          <p className="text-gray-500 mt-2">
            Module: {module.title}
          </p>
        )}
      </div>

      {/* Lesson Form */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Lesson title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Order */}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        The display order of this lesson within the module.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the lesson" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Text Content */}
              <FormField
                control={form.control}
                name="textContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Lesson content or instructions" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images upload field */}
              <FormField
                control={form.control}
                name="videoUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URLs</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={setVideoUrls}
                        maxFiles={5}
                        acceptedFileTypes={["video/*"]}
                        maxSizeInMB={5}
                        prefix={`courses/${courseId}/modules/${moduleId || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 videos for this module. Videos will be displayed in the module card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={setFiles}
                        maxFiles={5}
                        acceptedFileTypes={["application/pdf", "image/*"]}
                        maxSizeInMB={5}
                        prefix={`courses/${courseId}/modules/${moduleId || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images for this module. Images will be displayed in the module card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview and Mandatory checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isPreview"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Preview Lesson
                        </FormLabel>
                        <FormDescription>
                          Make this lesson available as a preview for non-enrolled users.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isMandatory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Mandatory Lesson
                        </FormLabel>
                        <FormDescription>
                          Mark this lesson as mandatory for course completion.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Lesson"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
