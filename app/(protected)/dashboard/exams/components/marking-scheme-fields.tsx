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
import { useEffect } from "react";

interface MarkingSchemeFieldsProps {
  control: Control<ExamFormValues>;
}

export function MarkingSchemeFields({ control }: MarkingSchemeFieldsProps) {

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="negativeMarking"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Negative Marking</FormLabel>
              <FormDescription>
                Enable negative marking for incorrect answers.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="correctMark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marks for Correct Answer</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter marks for correct answer" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Points awarded for each correct answer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="incorrectMark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marks for Incorrect Answer</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter marks for incorrect answer (negative or zero)" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  // disabled={!control._formValues.negativeMarking}
                />
              </FormControl>
              <FormDescription>
                Points deducted for each incorrect answer (use negative values).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
