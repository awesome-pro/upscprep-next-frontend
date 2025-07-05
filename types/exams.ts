import { User } from "./user";

// Exam Types
export enum ExamType {
  PRELIMS = 'PRELIMS',
  MAINS = 'MAINS',
  MOCK_TEST = 'MOCK_TEST',
}

export enum TestType {
  SECTIONAL = 'SECTIONAL',
  MULTI_SECTIONAL = 'MULTI_SECTIONAL',
  FULL_LENGTH = 'FULL_LENGTH',
  CHAPTER_TEST = 'CHAPTER_TEST',
  MOCK_TEST = 'MOCK_TEST',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SUBMITTED = 'SUBMITTED',
  EVALUATED = 'EVALUATED',
  ABANDONED = 'ABANDONED',
}

// Access type for attempts
export enum AccessType {
  TEST_SERIES = 'TEST_SERIES',
  COURSE = 'COURSE',
  INDIVIDUAL = 'INDIVIDUAL',
}

// Question Types
export enum QuestionType {
  MCQ = 'MCQ',
  DESCRIPTIVE = 'DESCRIPTIVE',
}

// Marking scheme structure
export interface MarkingScheme {
  correct: number;
  incorrect: number;
}

// Difficulty enum
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Exam interfaces
export interface Exam {
  id: string;
  title: string;
  description?: string;
  type: ExamType;
  testType: TestType;
  subject?: string;
  testSeriesId?: string;
  fileUrls: string[];
  teacherId: string;
  duration: number; // in minutes
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: boolean;
  correctMark: number;
  incorrectMark: number;
  difficulty: Difficulty;
  tags?: string[];
  isActive: boolean;
  isFree: boolean;
  cost: number; // in paisa
  createdAt: string;
  updatedAt: string;
  teacher?: User;
  testSeries?: TestSeries;
  examCount?: number; // For API responses that include count
  questions?: Question[];
}

// Question interfaces
export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  questionNumber: number;
  text: string;
  marks: number;
  options: string[]; // For MCQ questions
  correctOption?: string; // For MCQ questions
  explanation?: string; // For MCQ questions
  expectedAnswerPoints: string[]; // For descriptive questions
  wordLimit?: number; // For descriptive questions
  modelAnswer?: string; // For descriptive questions
  difficulty: Difficulty;
  topic?: string;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exam?: Exam;
  answers: Answer[];
}

// Answer interfaces
export interface Answer {
  id: string;
  questionId: string;
  attemptId: string;
  
  // MCQ answer fields
  selectedOption?: string;
  
  // Descriptive answer fields
  answerText?: string;
  timeSpent: number;
  answerImageUrl?: string;
  
  // Evaluation fields
  marks?: number;
  feedback?: string;
  evaluationStatus?: string;
  evaluatedAt?: string;
  
  // Relations
  question?: Question;
  attempt?: Attempt;
  evaluator?: User;
  
  createdAt: string;
  updatedAt: string;
}

// Test Series interfaces
export interface TestSeries {
  id: string;
  title: string;
  description?: string;
  type: ExamType;
  price: number; // in paisa
  features?: string[];
  duration?: number; // in days
  isActive: boolean;
  totalTests?: number; // Total number of tests in the series
  createdAt: string;
  updatedAt: string;
  exams?: Exam[];
  teacher?: User;
  images?: string[];
  teacherId?: string;
  examCount?: number; // For API responses that include count
}

// Attempt interfaces
export interface Attempt {
  id: string;
  userId: string;
  examId: string;
  
  // Access tracking
  accessType: AccessType;
  enrollmentId?: string; // CourseEnrollment or TestSeriesEnrollment ID
  
  // Attempt status
  status: AttemptStatus;
  startTime: string;
  endTime?: string;
  submitTime?: string;
  
  // Results
  score?: number;
  maxScore: number;
  percentage?: number;
  rank?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  unattempted?: number;
  accuracy?: number;
  
  answerSheetUrl?: string;
  evaluationStatus?: string;
  feedback?: any; // JSON data
  evaluatedBy?: string;
  
  // Student responses
  timeSpent?: any; // JSON data
  
  // Relations
  user?: User;
  exam?: Exam;
  evaluator?: User;
  answers?: Answer[];
  
  createdAt: string;
  updatedAt: string;
}

// DTOs for Attempt
export interface CreateAttemptDto {
  examId: string;
  accessType: AccessType;
  enrollmentId?: string;
  status: AttemptStatus;
  timeSpent: number; // in seconds
}

export interface UpdateAttemptDto {
  accessType?: AccessType;
  enrollmentId?: string;
  status?: AttemptStatus;
  submitTime?: Date;
  endTime?: Date;
  score?: number;
  percentage?: number;
  rank?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  unattempted?: number;
  accuracy?: number;
  answerSheetUrl?: string;
  evaluationStatus?: string;
  feedback?: any; // JSON data
  evaluatedBy?: string;
  timeSpent?: number; // in seconds
}

// Answer Key interfaces
export interface AnswerKey {
  id: string;
  examId: string;
  version: string;
  answerData: any; // JSON data
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
  exam?: Exam;
}

// Query params for filtering and pagination
export interface ExamQueryParams {
  page?: number;
  pageSize?: number;
  type?: ExamType;
  testType?: TestType;
  subject?: string;
  teacherId?: string;
  testSeriesId?: string;
  difficulty?: string;
  tag?: string;
  isActive?: boolean;
  isFree?: boolean;
  search?: string;
}

export interface QuestionQueryParams {
  page?: number;
  pageSize?: number;
  examId?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  topic?: string;
  search?: string;
}

export interface TestSeriesQueryParams {
  page?: number;
  pageSize?: number;
  type?: ExamType;
  isActive?: boolean;
  teacherId?: string;
  search?: string;
}

export interface AttemptQueryParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  examId?: string;
  search?: string;
  status?: AttemptStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AnswerKeyQueryParams {
  page?: number;
  pageSize?: number;
  examId?: string;
  isOfficial?: boolean;
  search?: string;
}

// DTOs for Question
export interface CreateQuestionDto {
  examId: string;
  type: QuestionType;
  questionNumber: number;
  text: string;
  marks: number;
  options?: string[];
  correctOption?: string;
  explanation?: string;
  expectedAnswerPoints?: string[];
  wordLimit?: number;
  modelAnswer?: string;
  difficulty: Difficulty;
  topic?: string;
  imageUrls?: string[];
  isActive?: boolean;
}

export interface UpdateQuestionDto {
  type?: QuestionType;
  questionNumber?: number;
  text?: string;
  marks?: number;
  options?: string[];
  correctOption?: string;
  explanation?: string;
  expectedAnswerPoints?: string[];
  wordLimit?: number;
  modelAnswer?: string;
  difficulty?: Difficulty;
  topic?: string;
  imageUrls?: string[];
  isActive?: boolean;
}

// DTOs for Answer
export interface CreateAnswerDto {
  questionId: string;
  attemptId: string;
  selectedOption?: string;
  answerText?: string;
  answerImageUrl?: string;
}

export interface UpdateAnswerDto extends CreateAnswerDto {
  attemptId: string;
  selectedOption?: string;
  answerText?: string;
  wordCount?: number;
  answerImageUrl?: string;
}

export interface EvaluateAnswerDto {
  marks: number;
  feedback?: string;
  evaluationStatus?: string;
}

