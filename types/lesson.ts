// Re-export all lesson types from the unified models file
import { OrderDirection } from './enums';
import type {
  CourseLesson,
  LessonQueryParams,
  CreateLessonDto,
  UpdateLessonDto
} from './models';

// Export enums
export { OrderDirection };

// Define LessonOrderBy enum here since it's specific to the lesson page
export enum LessonOrderBy {
  TITLE = 'title',
  ORDER = 'order',
  CONTENT_TYPE = 'contentType',
  CREATED_AT = 'createdAt',
}

// Export types
export type {
  CourseLesson as Lesson,
  LessonQueryParams,
  CreateLessonDto,
  UpdateLessonDto
};

// For backward compatibility
export type LessonList = CourseLesson;

