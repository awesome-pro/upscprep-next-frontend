import api from '@/lib/axios';
import { 
  TestSeriesEnrollment, 
  TestSeriesEnrollmentWithTestSeries, 
  TestSeriesEnrollmentStats,
  UpdateTestSeriesEnrollmentDto 
} from '@/types/test-series-enrollment';

const BASE_URL = '/test-series-enrollments';

const testSeriesEnrollmentApi = {
  // Get all test series enrollments for the current user
  getUserEnrollments: () => 
    api.get<TestSeriesEnrollmentWithTestSeries[]>(`${BASE_URL}/my`),
  
  // Get all test series enrollment IDs for the current user
  getUserEnrollmentIds: () => 
    api.get<string[]>(`${BASE_URL}/my/ids`),
  
  // Get all enrollments for a specific test series (requires TEACHER or ADMIN role)
  getTestSeriesEnrollments: (testSeriesId: string) => 
    api.get<TestSeriesEnrollmentWithTestSeries[]>(`${BASE_URL}/test-series/${testSeriesId}`),
  
  // Get all enrollment IDs for a specific test series (requires TEACHER or ADMIN role)
  getTestSeriesEnrollmentIds: (testSeriesId: string) => 
    api.get<string[]>(`${BASE_URL}/test-series/${testSeriesId}/ids`),
  
  // Get enrollment by ID
  getEnrollmentById: (id: string) => 
    api.get<TestSeriesEnrollment>(`${BASE_URL}/${id}`),
  
  // Update test series enrollment
  updateEnrollment: (id: string, data: UpdateTestSeriesEnrollmentDto) => 
    api.patch<TestSeriesEnrollment>(`${BASE_URL}/${id}`, data),
  
  // Get enrollment statistics for a test series (requires TEACHER or ADMIN role)
  getTestSeriesEnrollmentStats: (testSeriesId: string) => 
    api.get<TestSeriesEnrollmentStats>(`${BASE_URL}/test-series/${testSeriesId}/stats`),
};

export default testSeriesEnrollmentApi;
