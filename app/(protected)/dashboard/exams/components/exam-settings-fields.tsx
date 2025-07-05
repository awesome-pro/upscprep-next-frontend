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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Difficulty } from "@/types/exams";
import { SelectButtons } from "@/components/select-button";

interface ExamSettingsFieldsProps {
  control: Control<ExamFormValues>;
}

export function ExamSettingsFields({ control }: ExamSettingsFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter duration in minutes" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The time allowed for students to complete the exam.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="totalMarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter total marks" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The maximum possible score for the exam.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <SelectButtons
          control={control}
          name="difficulty"
          label="Difficulty Level"
          options={Difficulty}
          description="The relative difficulty of the exam."
          gridCols={{ default: 3 }}
        />
            

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Make this exam visible and available to students.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Free Access</FormLabel>
                <FormDescription>
                  Make this exam available for free to all students.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
