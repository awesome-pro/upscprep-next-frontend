import * as z from "zod";

export const moduleFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .nullable(),
  order: z
    .number()
    .int()
    .positive({ message: "Order must be a positive number" }),
  isActive: z
    .boolean(),
  images: z
    .array(z.string())
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;
