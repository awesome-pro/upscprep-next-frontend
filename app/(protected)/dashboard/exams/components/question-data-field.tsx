"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface QuestionDataFieldProps {
  control: Control<ExamFormValues>;
}

export function QuestionDataField({ control }: QuestionDataFieldProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Question Data</AlertTitle>
        <AlertDescription>
          For advanced question management, use the dedicated Question Editor after creating the exam.
          You can provide basic question data in JSON format here if needed.
        </AlertDescription>
      </Alert>
      
      <FormField
        control={control}
        name="questionData"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Data (Optional - JSON Format)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder='{"questions": [{"id": "q1", "text": "Sample question", "options": ["A", "B", "C", "D"], "correctOption": "A"}]}'
                className="min-h-[200px] font-mono text-sm"
                {...field}
                value={field.value ? JSON.stringify(field.value, null, 2) : ""}
                onChange={(e) => {
                  try {
                    // Try to parse as JSON if not empty
                    const value = e.target.value.trim() 
                      ? JSON.parse(e.target.value)
                      : undefined;
                    field.onChange(value);
                  } catch (error) {
                    // If not valid JSON, just store as string
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Provide question data in JSON format. This is for advanced users only.
              Most users should use the Question Editor after creating the exam.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
