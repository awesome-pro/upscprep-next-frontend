import api from '@/lib/axios';
import { PaginatedResult } from '@/lib/pagination';
import { Course, CourseDetail, CourseList, CourseType, CreateCourseDto, UpdateCourseDto, CourseQueryParams } from '@/types/course';

const BASE_URL = '/courses';

export const courseService = {
  /**
   * Get all courses with optional type filter
   */
  async getCourses(type?: CourseType): Promise<CourseList[]> {
    const params = type ? { type } : {};
    return (await api.get(BASE_URL, { params })).data;
  },

  /**
   * Get paginated courses with optional type filter
   */
  async getPaginatedCourses(
    params: CourseQueryParams = {}
  ): Promise<PaginatedResult<CourseList>> {
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      search: params.search ? params.search : undefined,
      type: params.type ? params.type : undefined,
      subject: params.subject ? params.subject : undefined,
      isActive: params.isActive ? params.isActive : undefined,
      isPremium: params.isPremium ? params.isPremium : undefined,
    };
    return (await api.get(`${BASE_URL}/paginated`, { params: queryParams })).data;
  },

  /**
   * Get a course by ID
   */
  async getCourseById(id: string): Promise<CourseDetail> {
    return (await api.get(`${BASE_URL}/${id}`)).data;
  },

  /**
   * Create a new course
   */
  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    return (await api.post(BASE_URL, courseData)).data;
  },

  /**
   * Update a course
   */
  async updateCourse(id: string, courseData: UpdateCourseDto): Promise<Course> {
    return (await api.put(`${BASE_URL}/${id}`, courseData)).data;
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<{message: string}> {
    return (await api.delete(`${BASE_URL}/${id}`)).data;
  },

  /**
   * Bulk delete courses
   */
  async bulkDeleteCourses(courseIds: string[]): Promise<{message: string}> {
    return (await api.delete(`${BASE_URL}/bulk`, { data: { courseIds } })).data;
  },

  /**
   * Check if user has access to a course
   */
  async checkCourseAccess(id: string): Promise<{ hasAccess: boolean }> {
    return (await api.get(`${BASE_URL}/${id}/access`)).data;
  },

  /**
   * Get all courses created by the current teacher
   */
  async getTeacherCourses(): Promise<CourseList[]> {
    return (await api.get(`${BASE_URL}/teacher/my-courses`)).data;
  }
};

export default courseService;
