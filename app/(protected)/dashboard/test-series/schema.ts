import * as z from "zod";
import { ExamType } from "@/types/enums";

export const testSeriesFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z
    .string()
    .optional(),
  type: z.nativeEnum(ExamType, {
    required_error: "Exam type is required",
    invalid_type_error: "Exam type must be valid",
  }),
  price: z
    .number()
    .min(1, { message: "Price must be at least 1" }),
  features: z
    .array(z.string()),
  images: z
    .array(z.string()),
  examIds: z
    .array(z.string()),
  isActive: z
    .boolean()
});

export type TestSeriesFormValues = z.infer<typeof testSeriesFormSchema>;
