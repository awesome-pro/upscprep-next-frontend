"use client";

import { useState, useEffect } from "react";
import { DirectFileUpload } from "@/components/file-upload/direct-upload";
import { useParams, useRouter } from "next/navigation";
import { UpdateLessonDto } from "@/types/lesson";
import { lessonService } from "@/services/lesson.service";
import { moduleService } from "@/services/module.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Link from "next/link";
import { ArrowLeft, Save, Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";

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

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const lessonId = params.lessonId as string;
  const moduleId = params.moduleId as string;
  const courseId = params.courseId as string;
  
  // Fetch lesson details
  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId, moduleId],
    queryFn: () => lessonService.getLessonById(lessonId, moduleId),
    enabled: !!lessonId,
  });

  // Fetch module details
  const { data: module, isLoading: moduleLoading, error: moduleError } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => moduleService.getModuleById(courseId, moduleId),
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


  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER) {
      toast.error("You don't have permission to edit lessons.");
      router.push("/dashboard");
    }
  }, [user, router, toast]);

  // Populate form when lesson data is loaded
  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        description: lesson.description || "",
        order: lesson.order,
        textContent: lesson.textContent || "",
        videoUrls: lesson.videoUrls || [],
        fileUrls: lesson.fileUrls || [],
        isPreview: lesson.isPreview,
        isMandatory: lesson.isMandatory,
      });
    }
  }, [lesson, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!moduleId || !lessonId) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data based on content type
      const lessonData: UpdateLessonDto = {
        ...values,
        textContent: values.textContent,
        videoUrls: values.videoUrls,
        fileUrls: values.fileUrls,
      };
      
      await lessonService.updateLesson(moduleId, lessonId, lessonData);
      
      toast("Lesson updated successfully.");
      
      // Redirect back to lesson details page
      router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle lesson deletion
  const handleDelete = async () => {
    if (!moduleId || !lessonId) return;
    
    setIsDeleting(true);
    try {
      await lessonService.deleteLesson(moduleId, lessonId);
      
      toast("Lesson deleted successfully.");
      
      // Redirect back to module page or lessons list
      if (courseId) {
        router.push(`/dashboard/courses/${courseId}/modules/${moduleId}`);
      } else {
        router.push(`/dashboard/courses/${courseId}/modules/${moduleId}`);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract S3 URL from presigned URL
  const extractS3Url = (presignedUrl: string): string => {
    try {
      // Parse the URL
      const url = new URL(presignedUrl);
      // Get the pathname (e.g., /bucket-name/path/to/file.ext)
      const pathname = url.pathname;
      // Construct the direct S3 URL
      return `https://${url.hostname}${pathname}`;
    } catch (error) {
      console.error('Error extracting S3 URL:', error);
      return presignedUrl; // Return original URL if parsing fails
    }
  };

  // Render video URL inputs
  const renderVideoUrlInputs = () => {
    return (
      <FormField
        control={form.control}
        name="videoUrls"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>Video URLs</FormLabel>
            
            {/* Direct file upload component */}
            <DirectFileUpload
              accept="video/*"
              prefix="videos/"
              buttonText="Upload Video"
              onUploadComplete={(url) => {
                // Extract the S3 URL from the presigned URL
                const s3Url = extractS3Url(url);
                // Add to existing URLs
                const updatedUrls = [...(field.value || []), s3Url];
                field.onChange(updatedUrls);
              }}
            />
            
            {/* Manual URL input option */}
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter video URL"
                className="flex-1"
                id="manual-video-url"
              />
              <Button 
                type="button" 
                onClick={() => {
                  const input = document.getElementById('manual-video-url') as HTMLInputElement;
                  if (input.value) {
                    const updatedUrls = [...(field.value || []), input.value];
                    field.onChange(updatedUrls);
                    input.value = '';
                  }
                }}
              >
                Add URL
              </Button>
            </div>
            
            {/* Display list of added URLs */}
            {field.value && field.value.length > 0 && (
              <div className="space-y-2">
                <FormLabel className="text-sm">Added Videos:</FormLabel>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {field.value.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate flex-1">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedUrls = field.value?.filter((_, i) => i !== index) || [];
                          field.onChange(updatedUrls);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <FormDescription>
              Upload videos or enter URLs manually. You can add multiple videos.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Render file URL inputs
  const renderFileUrlInputs = () => {
    return (
      <FormField
        control={form.control}
        name="fileUrls"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>PDF URLs</FormLabel>
            
            {/* Direct file upload component */}
            <DirectFileUpload
              accept="application/pdf"
              prefix="pdfs/"
              buttonText="Upload PDF"
              onUploadComplete={(url) => {
                // Extract the S3 URL from the presigned URL
                const s3Url = extractS3Url(url);
                // Add to existing URLs
                const updatedUrls = [...(field.value || []), s3Url];
                field.onChange(updatedUrls);
              }}
            />
            
            {/* Manual URL input option */}
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter PDF URL"
                className="flex-1"
                id="manual-pdf-url"
              />
              <Button 
                type="button" 
                onClick={() => {
                  const input = document.getElementById('manual-pdf-url') as HTMLInputElement;
                  if (input.value) {
                    const updatedUrls = [...(field.value || []), input.value];
                    field.onChange(updatedUrls);
                    input.value = '';
                  }
                }}
              >
                Add URL
              </Button>
            </div>
            
            {/* Display list of added URLs */}
            {field.value && field.value.length > 0 && (
              <div className="space-y-2">
                <FormLabel className="text-sm">Added PDFs:</FormLabel>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {field.value.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate flex-1">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedUrls = field.value?.filter((_, i) => i !== index) || [];
                          field.onChange(updatedUrls);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <FormDescription>
              Upload PDFs or enter URLs manually. You can add multiple PDFs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (isLoading || moduleLoading) {
    return (
      <section className="container mx-auto py-10">
        <p>Loading lesson details...</p>
      </section>
    );
  }

  if (error || !lesson) {
    return (
      <section className="container mx-auto py-10">
        <p>Error loading lesson details. Please try again.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}`}>
            Back to Module
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          {module && (
            <p className="text-gray-500 mt-2">
              Module: {module.title}
            </p>
          )}
        </div>
        
        {/* Delete button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Lesson
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the lesson
                and remove it from the module.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                        value={field.value || ""}
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
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video URL inputs */}
              {renderVideoUrlInputs()}

              {/* PDF URL inputs */}
              {renderFileUrlInputs()}

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
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
