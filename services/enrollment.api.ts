import api from '@/lib/axios';
import { CourseEnrollment, EnrollmentWithCourse, UpdateLessonProgressDto } from '@/types/enrollment';

const BASE_URL = '/enrollments';

const enrollmentApi = {
  // Get all enrollments for the current user
  getUserEnrollments: () => api.get<EnrollmentWithCourse[]>(`${BASE_URL}/my`),
  
  // Get all enrollment IDs for the current user
  getUserEnrollmentIds: () => api.get<string[]>(`${BASE_URL}/my/ids`),
  
  // Get all enrollments for a specific course (requires TEACHER or ADMIN role)
  getCourseEnrollments: (courseId: string) => 
    api.get<EnrollmentWithCourse[]>(`${BASE_URL}/course/${courseId}`),
  
  // Get all enrollment IDs for a specific course (requires TEACHER or ADMIN role)
  getCourseEnrollmentIds: (courseId: string) => 
    api.get<string[]>(`${BASE_URL}/course/${courseId}/ids`),
  
  // Get enrollment by ID
  getEnrollmentById: (id: string) => api.get<CourseEnrollment>(`${BASE_URL}/${id}`),
  
  // Update lesson progress
  updateLessonProgress: (enrollmentId: string, lessonId: string, data: UpdateLessonProgressDto) => 
    api.patch(`${BASE_URL}/${enrollmentId}/lessons/${lessonId}/progress`, data),
  
  // Get enrollment statistics for a course (requires TEACHER or ADMIN role)
  getCourseEnrollmentStats: (courseId: string) => 
    api.get(`${BASE_URL}/course/${courseId}/stats`),
};

export default enrollmentApi;
