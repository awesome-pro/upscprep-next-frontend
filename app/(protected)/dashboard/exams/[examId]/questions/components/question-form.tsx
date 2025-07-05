"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusCircle, X, Trash2 } from "lucide-react";

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

import { questionFormSchema, type QuestionFormValues } from "../schema";
import { QuestionService } from "@/services/question.service";
import { QuestionType, Difficulty, type Question } from "@/types/exams";
import { SelectButtons } from "@/components/select-button";
import { Switch } from "@/components/ui/switch";

interface QuestionFormProps {
  examId: string;
  questionId?: string;
  initialData?: Question;
}

export function QuestionForm({ examId, questionId, initialData }: QuestionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>(initialData?.type || QuestionType.MCQ);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
  
  // For MCQ options
  const [options, setOptions] = useState<string[]>(initialData?.options || ["", ""]);
  const [optionInput, setOptionInput] = useState("");
  
  // For descriptive questions
  const [expectedPoints, setExpectedPoints] = useState<string[]>(initialData?.expectedAnswerPoints || []);
  const [pointInput, setPointInput] = useState("");
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      examId: examId,
      type: initialData?.type || QuestionType.MCQ,
      questionNumber: initialData?.questionNumber || 1,
      text: initialData?.text || "",
      marks: initialData?.marks || 1,
      options: initialData?.options || ["", ""],
      correctOption: initialData?.correctOption || "",
      explanation: initialData?.explanation || "",
      expectedAnswerPoints: initialData?.expectedAnswerPoints || [],
      wordLimit: initialData?.wordLimit || undefined,
      modelAnswer: initialData?.modelAnswer || "",
      difficulty: initialData?.difficulty || Difficulty.MEDIUM,
      topic: initialData?.topic || "",
      imageUrls: initialData?.imageUrls || [],
      isActive: initialData?.isActive ?? true,
    },
  });

  // Update form when question type changes
  useEffect(() => {
    form.setValue("type", questionType);
  }, [questionType, form]);

  // Update form when options change
  useEffect(() => {
    form.setValue("options", options);
  }, [options, form]);

  // Update form when expected points change
  useEffect(() => {
    form.setValue("expectedAnswerPoints", expectedPoints);
  }, [expectedPoints, form]);

  // Update form when image URLs change
  useEffect(() => {
    form.setValue("imageUrls", imageUrls);
  }, [imageUrls, form]);

  // Handle form submission
  const onSubmit = async (values: QuestionFormValues) => {
    try {
      setIsLoading(true);
      
      // Update values with current state
      values.imageUrls = imageUrls;
      values.options = questionType === QuestionType.MCQ ? options : undefined;
      values.expectedAnswerPoints = questionType === QuestionType.DESCRIPTIVE ? expectedPoints : undefined;
      
      if (questionId) {
        // Update existing question
        await QuestionService.updateQuestion(questionId, values);
        toast.success("Question updated successfully");
      } else {
        // Create new question
        await QuestionService.createQuestion(values);
        toast.success("Question created successfully");
      }
      
      // Redirect back to exam questions page
      router.push(`/dashboard/exams/${examId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image uploads
  const handleImagesUploaded = (urls: string[]) => {
    setImageUrls(urls);
  };

  // Handle adding an option for MCQ
  const handleAddOption = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  // Handle removing an option for MCQ
  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // If the removed option was the correct option, reset the correct option
    const correctOption = form.getValues("correctOption");
    if (correctOption === options[index]) {
      form.setValue("correctOption", "");
    }
  };

  // Handle adding an expected point for descriptive questions
  const handleAddPoint = () => {
    if (pointInput.trim() !== "") {
      setExpectedPoints([...expectedPoints, pointInput.trim()]);
      setPointInput("");
    }
  };

  // Handle removing an expected point for descriptive questions
  const handleRemovePoint = (index: number) => {
    const newPoints = [...expectedPoints];
    newPoints.splice(index, 1);
    setExpectedPoints(newPoints);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Question Type field */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setQuestionType(value as QuestionType);
                      }}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={QuestionType.MCQ}>Multiple Choice</SelectItem>
                        <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of question you want to create.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Question Number field */}
                  <FormField
                    control={form.control}
                    name="questionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter question number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          The sequence number of this question in the exam.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                {/* Marks field */}
                  <FormField
                    control={form.control}
                    name="marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter marks for this question"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          The number of marks allocated to this question.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              

              {/* Question Text field */}
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the question text"
                        className="min-h-32"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The main text of the question that will be displayed to students.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Difficulty field */}
              <SelectButtons
                control={form.control}
                name="difficulty"
                label="Difficulty"
                options={Difficulty}
                description="The category of the exam."
                gridCols={{ default: 3 }}
              />

              {/* Topic field */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the topic or subject area"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The topic or subject area this question covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MCQ specific fields */}
              {questionType === QuestionType.MCQ && (
                <>
                  {/* Options field */}
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="Add an option"
                                value={optionInput}
                                onChange={(e) => setOptionInput(e.target.value)}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={handleAddOption}
                              disabled={isLoading || !optionInput.trim()}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                          
                          {options.length > 0 && (
                            <div className="border rounded-md p-4">
                              <ul className="space-y-2">
                                {options.map((option, index) => (
                                  <li key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FormField
                                        control={form.control}
                                        name="correctOption"
                                        render={({ field }) => (
                                          <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                              <input
                                                type="radio"
                                                checked={field.value === option}
                                                onChange={() => field.onChange(option)}
                                                disabled={isLoading}
                                              />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                      <span>{option}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveOption(index)}
                                      disabled={isLoading || options.length <= 2}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          Add at least 2 options for the multiple choice question. Select the correct option.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Explanation field */}
                  <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explanation</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain why the correct option is the answer"
                            className="min-h-20"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide an explanation for the correct answer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Descriptive specific fields */}
              {questionType === QuestionType.DESCRIPTIVE && (
                <>
                  {/* Expected Answer Points field */}
                  <FormField
                    control={form.control}
                    name="expectedAnswerPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Answer Points</FormLabel>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="Add an expected point"
                                value={pointInput}
                                onChange={(e) => setPointInput(e.target.value)}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={handleAddPoint}
                              disabled={isLoading || !pointInput.trim()}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                          
                          {expectedPoints.length > 0 && (
                            <div className="border rounded-md p-4">
                              <ul className="space-y-2">
                                {expectedPoints.map((point, index) => (
                                  <li key={index} className="flex items-center justify-between">
                                    <span>{point}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemovePoint(index)}
                                      disabled={isLoading}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          Add key points that should be included in a good answer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Word Limit field */}
                  <FormField
                    control={form.control}
                    name="wordLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Word Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter word limit"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Set a maximum word limit for the answer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Model Answer field */}
                  <FormField
                    control={form.control}
                    name="modelAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Answer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a model answer for reference"
                            className="min-h-32"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          A sample answer that would receive full marks.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Images upload field */}
              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Images</FormLabel>
                    <FormControl>
                      <MultiFileUpload
                        initialUrls={field.value}
                        onUploadComplete={handleImagesUploaded}
                        maxFiles={3}
                        acceptedFileTypes={["image/*"]}
                        maxSizeInMB={5}
                        prefix={`exams/${examId}/questions/${questionId || 'new'}`}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 3 images for this question (diagrams, charts, etc.).
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
                      <Switch
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
                        When active, this question will be included in the exam.
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
            {isLoading ? "Saving..." : questionId ? "Update Question" : "Create Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
