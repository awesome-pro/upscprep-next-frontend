import api from '@/lib/axios';
import { PaginatedResult } from '@/lib/pagination';
import { CourseEnrollment, EnrollmentWithCourse, EnrollmentWithProgress } from '@/types/enrollment';

export const enrollmentService = {
  /**
   * Get all enrollments for the current user
   */
  async getUserEnrollments(): Promise<EnrollmentWithCourse[]> {
    const { data } = await api.get('/enrollments/user');
    return data;
  },

  /**
   * Get paginated enrollments for the current user
   */
  async getPaginatedUserEnrollments(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<EnrollmentWithCourse>> {
    const params = { page, limit };
    return (await api.get('/enrollments/user/paginated', { params })).data;
  },

  /**
   * Get enrollment by ID
   */
  async getEnrollmentById(enrollmentId: string): Promise<EnrollmentWithProgress> {
    return (await api.get(`/enrollments/${enrollmentId}`)).data;
  },

  /**
   * Get enrollment for a specific course
   */
  async getEnrollmentByCourseId(courseId: string): Promise<CourseEnrollment> {
    return (await api.get(`/enrollments/course/${courseId}`)).data;
  },

  /**
   * Enroll in a course (usually after purchase)
   */
  async enrollInCourse(courseId: string, purchaseId?: string): Promise<CourseEnrollment> {
    return (await api.post('/enrollments', { courseId, purchaseId })).data;
  }
};

export default enrollmentService;
