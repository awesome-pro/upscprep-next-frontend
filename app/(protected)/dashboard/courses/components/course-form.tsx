"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { courseFormSchema, type CourseFormValues } from "../schema";
import { courseService } from "@/services/course.service";
import type { Course } from "@/types/models";
import { CourseType } from "@/types/enums";
import { SelectButtons } from "@/components/select-button";

interface CourseFormProps {
  courseId?: string;
  initialData?: Course;
}

export function CourseForm({ courseId, initialData }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>(initialData?.images || []);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [featureInput, setFeatureInput] = useState("");
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || CourseType.PRELIMS,
      subject: initialData?.subject || "",
      price: initialData?.price || 0,
      duration: initialData?.duration || 1,
      features: initialData?.features || [],
      images: initialData?.images || [],
      isActive: initialData?.isActive ?? true,
      isPremium: initialData?.isPremium ?? false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: CourseFormValues) => {
    try {
      setIsLoading(true);
      
      // Update values with current state
      values.images = files;
      values.features = features;
      
      if (courseId) {
        // Update existing course
        await courseService.updateCourse(courseId, values);
        toast.success("Course updated successfully");
      } else {
        // Create new course
        await courseService.createCourse(values);
        toast.success("Course created successfully");
      }
      
      // Redirect back to courses page
      router.push("/dashboard/courses");
      router.refresh();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image uploads
  const handleImagesUploaded = (urls: string[]) => {
    setFiles(urls);
  };

  // Handle adding features
  const handleAddFeature = () => {
    if (featureInput.trim() !== "" && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  // Handle removing features
  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
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
                        placeholder="Enter course title" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of the course that will be displayed to students.
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
                        placeholder="Enter course description" 
                        {...field} 
                        value={field.value || ""}
                        disabled={isLoading}
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of what this course covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Course Type field */}
             <SelectButtons
                control={form.control}
                name="type"
                label="Course Type"
                options={CourseType}
                description="The category of the course."
                gridCols={{ default: 3 }}
              />
              
              {/* Subject field */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter course subject" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The main subject or category of the course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The price of the course in Indian Rupees.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Duration field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
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
                      The total duration of the course in hours.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Features field */}
              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <FormLabel>Course Features</FormLabel>
                    <div className="flex flex-col space-y-4">
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Add a feature"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            disabled={isLoading}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeature();
                              }
                            }}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          onClick={handleAddFeature}
                          disabled={isLoading}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {features.length > 0 && (
                        <div className="bg-muted p-3 rounded-md">
                          <ul className="space-y-2">
                            {features.map((feature, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <span>{feature}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(feature)}
                                  disabled={isLoading}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Add key features of your course to highlight its benefits.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Images upload field */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={handleImagesUploaded}
                        maxFiles={5}
                        acceptedFileTypes={["image/*"]}
                        maxSizeInMB={5}
                        prefix={`courses/${courseId || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images for this course. Images will be displayed in the course card and details page.
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
                        When active, this course will be visible to students.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Premium status field */}
              <FormField
                control={form.control}
                name="isPremium"
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
                        Premium
                      </FormLabel>
                      <FormDescription>
                        Mark this course as premium to highlight its value.
                      </FormDescription>
                    </div>
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
            {isLoading ? "Saving..." : courseId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
