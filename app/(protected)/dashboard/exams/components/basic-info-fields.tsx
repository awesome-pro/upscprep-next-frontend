"use client";

import { ExamType, TestType } from "@/types/exams";
import { Control } from "react-hook-form";
import { ExamFormValues } from "./exam-form-schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectButtons } from "@/components/select-button";

interface BasicInfoFieldsProps {
  control: Control<ExamFormValues>;
}

export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter exam title" {...field} />
            </FormControl>
            <FormDescription>
              The title of the exam as it will appear to students.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter exam description" 
                className="min-h-[100px]" 
                {...field} 
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              A brief description of the exam content and purpose.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectButtons
          control={control}
          name="type"
          label="Exam Type"
          options={ExamType}
          description="The category of the exam."
          gridCols={{ default: 3 }}
        />

        <SelectButtons
          control={control}
          name="testType"
          label="Test Type"
          options={TestType}
          description="The format of the test."
          gridCols={{ default: 3 }}
        />
      </div>

      <FormField
        control={control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input placeholder="Enter subject (optional)" {...field} value={field.value || ""} />
            </FormControl>
            <FormDescription>
              The subject or topic area of the exam.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
