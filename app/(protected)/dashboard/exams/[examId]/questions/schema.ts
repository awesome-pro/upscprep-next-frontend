import * as z from "zod";
import { QuestionType, Difficulty } from "@/types/exams";

// Schema for creating and updating questions
export const questionFormSchema = z.object({
  // Required fields
  examId: z.string({
    required_error: "Exam ID is required",
  }),
  type: z.nativeEnum(QuestionType, {
    required_error: "Question type is required",
  }),
  questionNumber: z.number({
    required_error: "Question number is required",
  }).int().positive(),
  text: z.string({
    required_error: "Question text is required",
  }).min(1, { message: "Question text is required" }),
  marks: z.number({
    required_error: "Marks are required",
  }).int().positive(),
  difficulty: z.nativeEnum(Difficulty, {
    required_error: "Difficulty level is required",
  }),
  
  // Optional fields
  topic: z.string().optional(),
  imageUrls: z.array(z.string()),
  isActive: z.boolean(),
  
  // MCQ specific fields
  options: z.array(z.string()).optional(),
  correctOption: z.string().optional(),
  explanation: z.string().optional(),
  
  // Descriptive specific fields
  expectedAnswerPoints: z.array(z.string()).optional(),
  wordLimit: z.number().int().positive().optional(),
  modelAnswer: z.string().optional(),
}).refine((data) => {
  // For MCQ questions, options and correctOption are required
  if (data.type === QuestionType.MCQ) {
    return (
      data.options && 
      data.options.length >= 2 && 
      data.correctOption
    );
  }
  return true;
}, {
  message: "MCQ questions require at least 2 options and a correct option",
  path: ["options"],
}).refine((data) => {
  // For MCQ questions, correctOption must be one of the options
  if (data.type === QuestionType.MCQ && data.correctOption && data.options) {
    return data.options.includes(data.correctOption);
  }
  return true;
}, {
  message: "Correct option must be one of the provided options",
  path: ["correctOption"],
}).refine((data) => {
  // For descriptive questions, expectedAnswerPoints or modelAnswer should be provided
  if (data.type === QuestionType.DESCRIPTIVE) {
    return (
      (data.expectedAnswerPoints && data.expectedAnswerPoints.length > 0) ||
      (data.modelAnswer && data.modelAnswer.trim().length > 0)
    );
  }
  return true;
}, {
  message: "Descriptive questions require either expected answer points or a model answer",
  path: ["expectedAnswerPoints"],
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
