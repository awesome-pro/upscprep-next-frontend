import { CourseType, OrderDirection } from './enums';

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  subject: string;
  price: number;
  duration: number;
  features: string[];
  images?: string[];
  teacherId: string;
  teacherName?: string;
  isActive: boolean;
  isPremium?: boolean;
  totalStudents: number;
  totalModules: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail extends Course {
  modules: CourseModule[];
  isPurchased?: boolean;
  purchaseId?: string;
  validTill?: string;
}

// Module Types
export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  images?: string[];
  order: number;
  isActive: boolean;
  lessons?: CourseLesson[];
  lessonCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Lesson Types
export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  order: number;
  textContent: string;
  videoUrls: string[];
  videoDuration?: number | null;
  fileUrls: string[];
  quizData?: any;
  isPreview: boolean;
  isMandatory: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query Parameters
export interface CourseQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: CourseType;
  subject?: string;
  isActive?: boolean;
  isPremium?: boolean;
}

// Using string literals for orderBy to allow compatibility with specific enum types
export interface ModuleQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  orderBy?: 'title' | 'order' | 'createdAt' | string;
  orderDirection?: OrderDirection;
}

export interface LessonQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isPreview?: boolean;
  isMandatory?: boolean;
  orderBy?: 'title' | 'order' | 'createdAt' | string;
  orderDirection?: OrderDirection;
}

// DTO Types for Create/Update Operations
export interface CreateCourseDto {
  title: string;
  description: string;
  type: CourseType;
  subject: string;
  price: number;
  duration?: number;
  features: string[];
  isPremium?: boolean;
  isActive?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  type?: CourseType;
  subject?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isPremium?: boolean;
  isActive?: boolean;
}

export interface CreateModuleDto {
  title: string;
  description?: string | null;
  order?: number | null;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateModuleDto {
  title?: string;
  description?: string | null;
  order?: number | null;
  isActive?: boolean;
  images?: string[];
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  order?: number;
  isPreview?: boolean;
  isMandatory?: boolean;
  videoDuration?: number;
  textContent?: string;
  videoUrls?: string[];
  fileUrls?: string[];
  quizData?: any;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
  order?: number;
  isPreview?: boolean;
  isMandatory?: boolean;
  videoDuration?: number;
  textContent?: string;
  videoUrls?: string[];
  fileUrls?: string[];
  quizData?: any;
}
