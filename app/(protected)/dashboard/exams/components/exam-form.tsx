"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Difficulty, Exam } from "@/types/exams";
import { ExamService } from "@/services/exam.service";
import { examFormSchema, ExamFormValues } from "./exam-form-schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BasicInfoFields } from "./basic-info-fields";
import { ExamSettingsFields } from "./exam-settings-fields";
import { MarkingSchemeFields } from "./marking-scheme-fields";
import { TestSeriesField } from "./test-series-field";
import { QuestionDataField } from "./question-data-field";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { MultiFileUpload } from "@/components/multi-file-upload";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ExamFormProps {
  exam?: Exam;
  isEditing?: boolean;
}

export function ExamForm({ exam, isEditing = false }: ExamFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<string[]>(exam?.fileUrls || []);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values or existing exam data
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: exam ? {
      title: exam.title,
      description: exam.description || "",
      type: exam.type,
      testType: exam.testType,
      subject: exam.subject || "",
      fileUrls: exam.fileUrls || [],
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      isActive: exam.isActive,
      isFree: exam.isFree,
      negativeMarking: exam.negativeMarking,
      correctMark: exam.correctMark,
      incorrectMark: exam.incorrectMark,
      difficulty: exam.difficulty,
      tags: exam.tags || [],
      totalQuestions: exam.totalQuestions,
      testSeriesId: exam.testSeriesId || "",
    } : {
      title: "",
      description: "",
      type: undefined,
      testType: undefined,
      subject: "",
      duration: 60,
      totalMarks: 100,
      isActive: true,
      isFree: false,
      negativeMarking: false,
      correctMark: 1,
      incorrectMark: 0,
      difficulty: Difficulty.EASY,
      tags: [],
      testSeriesId: "",
      totalQuestions: 0,
      fileUrls: [],
    },
  });

  // Form submission handler
  const onSubmit = async (data: ExamFormValues) => {
    setIsSubmitting(true);
    try {
      data.fileUrls = files;
      // Submit the form
      if (isEditing && exam) {
        await ExamService.updateExam(exam.id, data);
        toast.success("Exam updated successfully");
      } else {
        await ExamService.createExam(data);
        toast.success("Exam created successfully");
      }

      // Redirect to exams list
      router.push("/dashboard/exams");
      router.refresh();
    } catch (error) {
      console.error("Error submitting exam form:", error);
      toast.error("Failed to save the exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="marking">Marking Scheme</TabsTrigger>
            <TabsTrigger value="files-tags">Files & Tags</TabsTrigger>
            <TabsTrigger value="test-series">Test Series</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4">
            <CardContent className="pt-6">
              <TabsContent value="basic-info">
                <BasicInfoFields control={form.control} />
              </TabsContent>
              
              <TabsContent value="settings">
                <ExamSettingsFields control={form.control} />
              </TabsContent>
              
              <TabsContent value="marking">
                <MarkingSchemeFields control={form.control} />
              </TabsContent>
              
              <TabsContent value="files-tags">
              <FormField
                control={form.control}
                name="fileUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Series Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={setFiles}
                        maxFiles={5}
                        acceptedFileTypes={["image/*"]}
                        maxSizeInMB={5}
                        prefix={`exams/${exam?.id || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images for this exam. Images will be displayed in the exam card and details page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Questions</FormLabel>
                    <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter total questions" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    </FormControl>
                    <FormDescription>
                      The total number of questions in the exam.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newTags = [...(field.value || [])];
                                newTags.splice(index, 1);
                                field.onChange(newTags);
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
              
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              const value = input.value.trim();
                              if (value && (!field.value || !field.value.includes(value))) {
                                const newTags = [...(field.value || []), value];
                                field.onChange(newTags);
                              input.value = '';
                            }
                          }
                        }}
                      />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && (!field.value || !field.value.includes(value))) {
                              const newTags = [...(field.value || []), value];
                              field.onChange(newTags);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <FormDescription>
                      Add relevant tags to help categorize and find this exam.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </TabsContent>
              
              <TabsContent value="test-series">
                <TestSeriesField control={form.control} />
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/dashboard/exams")}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {activeTab !== "basic-info" && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const tabs = ["basic-info", "settings", "marking", "files-tags", "test-series"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}
                
                {activeTab !== "test-series" ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      const tabs = ["basic-info", "settings", "marking", "files-tags", "test-series"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      isEditing ? "Update Exam" : "Create Exam"
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </form>
    </Form>
  );
}
