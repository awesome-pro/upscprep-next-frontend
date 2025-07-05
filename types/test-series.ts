import { ExamType } from './enums';

export interface TestSeriesDto {
  id: string;
  title: string;
  description: string | null;
  type: ExamType;
  price: number;
  duration: number;
  features: string[];
  totalTests: number;
  isActive: boolean;
  teacherId: string;
  teacherName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestSeriesListDto {
  id: string;
  title: string;
  description: string | null;
  type: ExamType;
  price: number;
  duration: number;
  features: string[];
  totalTests: number;
  isActive: boolean;
  teacherName: string | null;
  isPurchased: boolean;
}

export interface TestSeriesExamDto {
  id: string;
  title: string;
  description: string | null;
  type: ExamType;
  testType: string;
  subject: string | null;
  duration: number;
  totalMarks: number;
  totalQuestions: number;
  difficulty: string | null;
  isActive: boolean;
  isFree: boolean;
  isAccessible: boolean;
}

export interface TestSeriesDetailDto extends TestSeriesDto {
  isPurchased: boolean;
  purchaseId?: string;
  validTill?: Date;
  exams: TestSeriesExamDto[];
}
