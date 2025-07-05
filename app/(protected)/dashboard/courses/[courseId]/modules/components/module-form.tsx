"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { MultiFileUpload } from "@/components/multi-file-upload";

import { moduleFormSchema, type ModuleFormValues } from "../schema";
import { moduleService } from "@/services/module.service";
import type { CourseModule } from "@/types/models";

interface ModuleFormProps {
  courseId: string;
  moduleId?: string;
  initialData?: CourseModule;
}

export function ModuleForm({ courseId, moduleId, initialData }: ModuleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      order: initialData?.order || 1,
      isActive: initialData?.isActive ?? true,
      images: initialData?.images || [],
    },
  });

  // Handle form submission
  const onSubmit = async (values: ModuleFormValues) => {
    try {
      setIsLoading(true);
      
      values.images = files;
      if (moduleId) {
        // Update existing module
        await moduleService.updateModule(courseId, moduleId, values);
        toast.success("Module updated successfully");
      } else {
        // Create new module
        await moduleService.createModule(courseId, values);
        toast.success("Module created successfully");
      }
      
      // Redirect back to course page
      router.push(`/dashboard/courses/${courseId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving module:", error);
      toast.error("Failed to save module. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image uploads
  const handleImagesUploaded = (urls: string[]) => {
    setFiles(urls);
    // form.setValue("images", urls, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Title field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter module title" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of the module that will be displayed to students.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter module description" 
                        {...field} 
                        value={field.value || ""}
                        disabled={isLoading}
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of what this module covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Order field */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        value={field.value}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The order in which this module appears in the course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Active status field */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <FormDescription>
                        When active, this module will be visible to students.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Images upload field */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={setFiles}
                        maxFiles={5}
                        acceptedFileTypes={["image/*"]}
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
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : moduleId ? "Update Module" : "Create Module"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
