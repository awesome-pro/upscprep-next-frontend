import { z } from "zod";
import { Difficulty, ExamType, TestType } from "@/types/exams";

export const examFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  type: z.nativeEnum(ExamType, {
    required_error: "Please select an exam type.",
  }),
  testType: z.nativeEnum(TestType, {
    required_error: "Please select a test type.",
  }),
  subject: z.string().optional(),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
  fileUrls: z.array(z.string()),
  totalMarks: z.number().min(1, {
    message: "Total marks must be at least 1.",
  }),
  totalQuestions: z.number().min(1, {
    message: "Total questions must be at least 1.",
  }),
  isActive: z.boolean(),
  isFree: z.boolean(),
  negativeMarking: z.boolean(),
  correctMark: z.number().min(0),
  incorrectMark: z.number().negative(),
  difficulty: z.nativeEnum(Difficulty, {
    required_error: "Please select a difficulty level.",
  }),
  tags: z.array(z.string()).optional(),
  testSeriesId: z.string().optional(),
  questionData: z.any().optional(),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;
