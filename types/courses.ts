// This file is deprecated - import from './course.ts' instead
// Re-exporting for backward compatibility

import { CourseType } from './enums';
import type { 
  Course, 
  CourseDetail, 
  CourseModule, 
  CourseLesson 
} from './models';

// Re-export with Dto suffix for backward compatibility
export type CourseDto = Course;
export type CourseDetailDto = CourseDetail;
export type CourseModuleDto = CourseModule;
export type CourseLessonDto = CourseLesson;

// Special case for CourseListDto which has a slightly different structure
export interface CourseListDto {
  id: string;
  title: string;
  description: string | null;
  type: CourseType;
  subject: string;
  price: number;
  duration: number;
  features: string[];
  teacherName: string;
  isPurchased: boolean;
}

