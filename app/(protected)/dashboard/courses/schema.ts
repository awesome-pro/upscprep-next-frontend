import * as z from "zod";
import { CourseType } from "@/types/enums";

export const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  type: z.nativeEnum(CourseType, {
    required_error: "Course type is required",
    invalid_type_error: "Course type must be valid",
  }),
  subject: z
    .string()
    .min(1, { message: "Subject is required" }),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number" }),
  duration: z
    .number()
    .int()
    .min(1, { message: "Duration must be at least 1 hour" }),
  features: z
    .array(z.string()),
  images: z
    .array(z.string()),
  isActive: z
    .boolean(),
  isPremium: z
    .boolean()
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
