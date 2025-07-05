import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { 
  AnswerKey, 
  AnswerKeyQueryParams 
} from '@/types/exams';

const BASE_URL = '/answer-keys';

export const AnswerKeyService = {
  // Get all answer keys with pagination and filtering
  getAnswerKeys: async (params: AnswerKeyQueryParams): Promise<PaginatedResponse<AnswerKey>> => {
    const { data } = await api.get(BASE_URL, { params });
    return data;
  },

  // Get a single answer key by ID
  getAnswerKeyById: async (id: string): Promise<AnswerKey> => {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    return data;
  },

  // Create a new answer key
  createAnswerKey: async (answerKeyData: Partial<AnswerKey>): Promise<AnswerKey> => {
    const { data } = await api.post(BASE_URL, answerKeyData);
    return data;
  },

  // Update an existing answer key
  updateAnswerKey: async (id: string, answerKeyData: Partial<AnswerKey>): Promise<AnswerKey> => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, answerKeyData);
    return data;
  },

  // Delete an answer key
  deleteAnswerKey: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get answer keys by exam ID
  getAnswerKeysByExam: async (examId: string): Promise<AnswerKey[]> => {
    const { data } = await api.get(`${BASE_URL}/exam/${examId}`);
    return data;
  },

  // Get official answer key for an exam
  getOfficialAnswerKey: async (examId: string): Promise<AnswerKey> => {
    const { data } = await api.get(`${BASE_URL}/exam/${examId}/official`);
    return data;
  }
};

export default AnswerKeyService;
