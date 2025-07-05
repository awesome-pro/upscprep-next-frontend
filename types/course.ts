// Re-export all course types from the unified models file
import { CourseType } from './enums';
import type {
  Course,
  CourseDetail,
  CourseModule,
  CourseLesson,
  CourseQueryParams,
  CreateCourseDto,
  UpdateCourseDto,
  CreateModuleDto,
  UpdateModuleDto,
  CreateLessonDto,
  UpdateLessonDto
} from './models';

// Export all types
export { CourseType };
export type {
  Course,
  CourseDetail,
  CourseModule,
  CourseLesson,
  CourseQueryParams,
  CreateCourseDto,
  UpdateCourseDto,
  CreateModuleDto,
  UpdateModuleDto,
  CreateLessonDto,
  UpdateLessonDto
};

// For backward compatibility
export type CourseList = Course;

