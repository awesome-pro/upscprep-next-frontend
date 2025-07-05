import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { 
  Attempt, 
  AttemptQueryParams 
} from '@/types/exams';

const BASE_URL = '/attempts';

export const AttemptService = {
  // Get all attempts with pagination and filtering
  getAttempts: async (params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> => {
    const { data } = await api.get(BASE_URL, { params });
    return data;
  },

  // Get a single attempt by ID
  getAttemptById: async (id: string): Promise<Attempt> => {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    return data;
  },

  // Create a new attempt
  createAttempt: async (attemptData: { examId: string }): Promise<Attempt> => {
    const { data } = await api.post(BASE_URL, attemptData);
    return data;
  },

  // Update an existing attempt (submit answers)
  updateAttempt: async (id: string, attemptData: Partial<Attempt>): Promise<Attempt> => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, attemptData);
    return data;
  },

  // Submit an attempt for evaluation
  submitAttempt: async (id: string): Promise<Attempt> => {
    const { data } = await api.post(`${BASE_URL}/${id}/submit`);
    return data;
  },

  // Get attempts by user ID
  getAttemptsByUser: async (userId: string, params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> => {
    const { data } = await api.get(`${BASE_URL}/user/${userId}`, { params });
    return data;
  },

  // Get attempts by exam ID
  getAttemptsByExam: async (examId: string, params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> => {
    const { data } = await api.get(`${BASE_URL}/exam/${examId}`, { params });
    return data;
  },

  // Get attempts assigned for evaluation (for teachers)
  getAssignedAttempts: async (params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> => {
    const { data } = await api.get(`${BASE_URL}/assigned`, { params });
    return data;
  },

  // Evaluate an attempt (for teachers)
  evaluateAttempt: async (id: string, evaluationData: {
    score?: number;
    feedback?: any;
    evaluationStatus?: string;
  }): Promise<Attempt> => {
    const { data } = await api.post(`${BASE_URL}/${id}/evaluate`, evaluationData);
    return data;
  },

  // Upload answer sheet for an attempt
  uploadAnswerSheet: async (id: string, formData: FormData): Promise<Attempt> => {
    const { data } = await api.post(`${BASE_URL}/${id}/answer-sheet`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
};

export default AttemptService;
