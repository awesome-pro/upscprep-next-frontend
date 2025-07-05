import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { 
  TestSeries, 
  TestSeriesQueryParams, 
  Exam
} from '@/types/exams';

const BASE_URL = '/test-series';

export const TestSeriesService = {
  // Get all test series with pagination and filtering
  getTestSeries: async (params: TestSeriesQueryParams): Promise<PaginatedResponse<TestSeries>> => {
    const { data } = await api.get(BASE_URL, { params });
    return data;
  },

  // Get a single test series by ID
  getTestSeriesById: async (id: string): Promise<TestSeries> => {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    return data;
  },

  // Create a new test series
  createTestSeries: async (testSeriesData: Partial<TestSeries>): Promise<TestSeries> => {
    const { data } = await api.post(BASE_URL, testSeriesData);
    return data;
  },

  // Update an existing test series
  updateTestSeries: async (id: string, testSeriesData: Partial<TestSeries>): Promise<TestSeries> => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, testSeriesData);
    return data;
  },

  // Delete a test series
  deleteTestSeries: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get test series by teacher ID
  getTestSeriesByTeacher: async (teacherId: string, params: TestSeriesQueryParams): Promise<PaginatedResponse<TestSeries>> => {
    const { data } = await api.get(`${BASE_URL}/teacher/${teacherId}`, { params });
    return data;
  },

  // Add an exam to a test series
  addExamToTestSeries: async (testSeriesId: string, examId: string): Promise<TestSeries> => {
    const { data } = await api.post(`${BASE_URL}/${testSeriesId}/exams/${examId}`);
    return data;
  },

  // Remove an exam from a test series
  removeExamFromTestSeries: async (testSeriesId: string, examId: string): Promise<TestSeries> => {
    const { data } = await api.delete(`${BASE_URL}/${testSeriesId}/exams/${examId}`);
    return data;
  },

  // Get all exams in a test series
  getExamsInTestSeries: async (testSeriesId: string): Promise<Exam[]> => {
    const { data } = await api.get(`${BASE_URL}/${testSeriesId}/exams`);
    return data;
  }
};

export default TestSeriesService;
