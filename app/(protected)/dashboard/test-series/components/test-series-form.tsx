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
import { ExamSelector } from "@/components/exam-selector";

import { testSeriesFormSchema, type TestSeriesFormValues } from "../schema";
import { TestSeriesService } from "@/services/test-series-service";
import type { TestSeries } from "@/types/exams";
import { ExamType } from "@/types/enums";
import { SelectButtons } from "@/components/select-button";

interface TestSeriesFormProps {
  testSeriesId?: string;
  initialData?: TestSeries;
}

export function TestSeriesForm({ testSeriesId, initialData }: TestSeriesFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>(initialData?.images || []);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [featureInput, setFeatureInput] = useState("");
  const [examIds, setExamIds] = useState<string[]>(
    initialData?.exams?.map(exam => exam.id) || []
  );
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<TestSeriesFormValues>({
    resolver: zodResolver(testSeriesFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || ExamType.PRELIMS,
      price: initialData?.price || 0,
      features: initialData?.features || [],
      images: initialData?.images || [],
      examIds: initialData?.exams?.map(exam => exam.id) || [],
      isActive: initialData?.isActive ?? true,
    },
  });

  // Handle form submission
  const onSubmit = async (values: TestSeriesFormValues) => {
    try {
      setIsLoading(true);
      
      // Update values with current state
      values.images = files;
      values.features = features;
      values.examIds = examIds;
      
      if (testSeriesId) {
        // Update existing test series
        await TestSeriesService.updateTestSeries(testSeriesId, values);
        toast.success("Test series updated successfully");
      } else {
        // Create new test series
        await TestSeriesService.createTestSeries(values);
        toast.success("Test series created successfully");
      }
      
      // Redirect back to test series page
      router.push("/dashboard/test-series");
      router.refresh();
    } catch (error) {
      console.error("Error saving test series:", error);
      toast.error("Failed to save test series. Please try again.");
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

  // Handle exam selection
  const handleExamSelection = (selectedExamIds: string[]) => {
    setExamIds(selectedExamIds);
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
                        placeholder="Enter test series title" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of the test series that will be displayed to students.
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
                        placeholder="Enter test series description" 
                        {...field} 
                        value={field.value || ""}
                        disabled={isLoading}
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of what this test series covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Exam Type field */}
             <SelectButtons
                control={form.control}
                name="type"
                label="Exam Type"
                options={ExamType}
                description="The category of the exam."
                gridCols={{ default: 3 }}
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
                      The price of the test series in Indian Rupees.
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
                    <FormLabel>Test Series Features</FormLabel>
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
                      Add key features of your test series to highlight its benefits.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Exams selector field */}
              <FormField
                control={form.control}
                name="examIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Exams</FormLabel>
                    <FormControl>
                      <ExamSelector
                        selectedExamIds={examIds}
                        onChange={handleExamSelection}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Select the exams to include in this test series.
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
                    <FormLabel>Test Series Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={handleImagesUploaded}
                        maxFiles={5}
                        acceptedFileTypes={["image/*"]}
                        maxSizeInMB={5}
                        prefix={`test-series/${testSeriesId || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images for this test series. Images will be displayed in the test series card and details page.
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
                        When active, this test series will be visible to students.
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
            {isLoading ? "Saving..." : testSeriesId ? "Update Test Series" : "Create Test Series"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
