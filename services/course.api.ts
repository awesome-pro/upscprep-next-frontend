import { api } from "@/lib/axios";
import { CourseListDto, CourseDetailDto } from "@/types/courses";
import { CourseType } from "@/types/enums";

export const coursesApi = {
  // Get all courses with optional user context
  getAllCourses: async (): Promise<CourseListDto[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get courses by type with optional user context
  getCoursesByType: async (type: CourseType): Promise<CourseListDto[]> => {
    const response = await api.get(`/courses?type=${type}`);
    return response.data;
  },

  // Get course details by ID with optional user context
  getCourseById: async (id: string): Promise<CourseDetailDto> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Check if user has access to a course (requires authentication)
  checkCourseAccess: async (id: string): Promise<boolean> => {
    const response = await api.get(`/courses/${id}/access`);
    return response.data;
  }
};