import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import type { CourseLesson } from '@/types/models';
import { CreateLessonDto, UpdateLessonDto, LessonQueryParams } from '@/types/lesson';

export const lessonService = {
  /**
   * Get all lessons for a module
   */
  async getLessons(moduleId: string): Promise<CourseLesson[]> {
    return await api.get(`/modules/${moduleId}/lessons`).then((response) => response.data);
  },
  
  /**
   * Get paginated lessons for a module with search and filters
   */
  async getPaginatedLessons(
    moduleId: string,
    queryParams: LessonQueryParams = {}
  ): Promise<PaginatedResponse<CourseLesson>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (queryParams.page) params.append('page', queryParams.page.toString());
    if (queryParams.pageSize) params.append('pageSize', queryParams.pageSize.toString());
    if (queryParams.search) params.append('search', queryParams.search);
    if (queryParams.isPreview !== undefined) params.append('isPreview', queryParams.isPreview.toString());
    if (queryParams.isMandatory !== undefined) params.append('isMandatory', queryParams.isMandatory.toString());
    if (queryParams.orderBy) params.append('orderBy', queryParams.orderBy);
    if (queryParams.orderDirection) params.append('orderDirection', queryParams.orderDirection);
    
    return await api.get(`/modules/${moduleId}/lessons/paginated?${params.toString()}`).then((response) => response.data);
  },

  /**
   * Get a lesson by ID
   */
  async getLessonById(lessonId: string, moduleId: string): Promise<CourseLesson> {
    return await api.get(`/modules/${moduleId}/lessons/${lessonId}`).then((response) => response.data);
  },

  /**
   * Create a new lesson for a module
   */
  async createLesson(moduleId: string, lessonData: CreateLessonDto): Promise<CourseLesson> {
    return await api.post(`/modules/${moduleId}/lessons`, lessonData).then((response) => response.data);
  },

  /**
   * Update a lesson
   */
  async updateLesson(moduleId: string, lessonId: string, lessonData: UpdateLessonDto): Promise<CourseLesson> {
    return await api.put(`/modules/${moduleId}/lessons/${lessonId}`, lessonData).then((response) => response.data);
  },

  /**
   * Delete a lesson
   */
  async deleteLesson(moduleId: string, lessonId: string): Promise<{message: string}> {
    return await api.delete(`/modules/${moduleId}/lessons/${lessonId}`).then((response) => response.data);
  },
  
  /**
   * Bulk delete multiple lessons
   */
  async bulkDeleteLessons(moduleId: string, lessonIds: string[]): Promise<{message: string}> {
    return await api.delete(`/modules/${moduleId}/lessons`, {
      data: { ids: lessonIds }
    }).then((response) => response.data);
  }
};

export default lessonService;
