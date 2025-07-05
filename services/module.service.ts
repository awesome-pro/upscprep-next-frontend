import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { CourseModule, CreateModuleDto, UpdateModuleDto, ModuleQueryParams } from '@/types/models';

export const moduleService = {
  /**
   * Get all modules for a course
   */
  async getModules(courseId: string): Promise<CourseModule[]> {
    return await api.get(`/courses/${courseId}/modules`).then((response) => response.data);
  },
  
  /**
   * Get paginated modules for a course with search and filters
   */
  async getPaginatedModules(
    courseId: string,
    queryParams: ModuleQueryParams = {}
  ): Promise<PaginatedResponse<CourseModule>> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (queryParams.page) params.append('page', queryParams.page.toString());
    if (queryParams.pageSize) params.append('pageSize', queryParams.pageSize.toString());
    if (queryParams.search) params.append('search', queryParams.search);
    if (queryParams.isActive !== undefined) params.append('isActive', queryParams.isActive.toString());
    if (queryParams.orderBy) params.append('orderBy', queryParams.orderBy);
    if (queryParams.orderDirection) params.append('orderDirection', queryParams.orderDirection);
    
    return await api.get(`/courses/${courseId}/modules/paginated?${params.toString()}`).then((response) => response.data);
  },

  /**
   * Get a module by ID
   */
  async getModuleById(courseId: string, moduleId: string): Promise<CourseModule> {
    return await api.get(`/courses/${courseId}/modules/${moduleId}`).then((response) => response.data);
  },

  /**
   * Create a new module for a course
   */
  async createModule(courseId: string, moduleData: CreateModuleDto): Promise<CourseModule> {
    return await api.post(`/courses/${courseId}/modules`, moduleData).then((response) => response.data);
  },

  /**
   * Update a module
   */
  async updateModule(courseId: string, moduleId: string, moduleData: UpdateModuleDto): Promise<CourseModule> {
    return await api.put(`/courses/${courseId}/modules/${moduleId}`, moduleData).then((response) => response.data);
  },

  /**
   * Delete a module
   */
  async deleteModule(courseId: string, moduleId: string): Promise<{message: string}> {
    return await api.delete(`/courses/${courseId}/modules/${moduleId}`).then((response) => response.data);
  },

  /**
   * Bulk delete multiple modules
   */
  async bulkDeleteModules(courseId: string, moduleIds: string[]): Promise<{message: string}> {
    return await api.delete(`/courses/${courseId}/modules/bulk`, { data: { moduleIds } })
      .then((response) => response.data);
  }
};

export default moduleService;
