// Import types
import { ExamFormValues } from '@/app/(protected)/dashboard/exams/components/exam-form-schema';
import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { 
  Exam, 
  ExamQueryParams, 
} from '@/types/exams';

const BASE_URL = '/exams';

export const ExamService = {
  // Get all exams with pagination and filtering
  getExams: async (params: ExamQueryParams): Promise<PaginatedResponse<Exam>> => {
    return (await api.get(BASE_URL, { params })).data;  
  },

  // Get a single exam by ID
  getExamById: async (id: string): Promise<Exam> => {
    return (await api.get(`${BASE_URL}/${id}`)).data;
  },

  // Create a new exam
  createExam: async (examData: ExamFormValues): Promise<Exam> => {
    return await api.post(BASE_URL, examData).then((response) => response.data);
  },

  // Update an existing exam
  updateExam: async (id: string, examData: ExamFormValues): Promise<Exam> => {
    return await api.patch(`${BASE_URL}/${id}`, examData).then((response) => response.data);
  },

  // Delete an exam
  deleteExam: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get exams by test series ID
  getExamsByTestSeries: async (testSeriesId: string, params: ExamQueryParams): Promise<PaginatedResponse<Exam>> => {
    return await api.get(`${BASE_URL}/test-series/${testSeriesId}`, { params }).then((response) => response.data);
  },

  // Get exams by teacher ID
  getExamsByTeacher: async (teacherId: string, params: ExamQueryParams): Promise<PaginatedResponse<Exam>> => {
    return await api.get(`${BASE_URL}/teacher/${teacherId}`, { params }).then((response) => response.data);
  },

  // Bulk delete exams
  bulkDeleteExams: async (examIds: string[]): Promise<void> => {
    await api.delete(`${BASE_URL}/bulk`, { data: { ids: examIds } });
  },
};

export default ExamService;
