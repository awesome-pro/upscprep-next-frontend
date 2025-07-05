import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import {
  Question,
  QuestionQueryParams,
  CreateQuestionDto,
  UpdateQuestionDto
} from '@/types/exams';

const BASE_URL = '/questions';

export const QuestionService = {
  // Get all questions with pagination and filtering
  getQuestions: async (params: QuestionQueryParams): Promise<PaginatedResponse<Question>> => {
    return (await api.get(BASE_URL, { params })).data;
  },

  // Get a single question by ID
  getQuestionById: async (id: string): Promise<Question> => {
    return (await api.get(`${BASE_URL}/${id}`)).data;
  },

  // Get questions by exam ID
  getQuestionsByExam: async (examId: string, params?: QuestionQueryParams): Promise<PaginatedResponse<Question>> => {
    return (await api.get(`/exams/${examId}/questions`, { params })).data;
  },

  // Create a new question
  createQuestion: async (questionData: CreateQuestionDto): Promise<Question> => {
    return await api.post(BASE_URL, questionData).then((response) => response.data);
  },

  // Update an existing question
  updateQuestion: async (id: string, questionData: UpdateQuestionDto): Promise<Question> => {
    return await api.patch(`${BASE_URL}/${id}`, questionData).then((response) => response.data);
  },

  // Delete a question
  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Bulk create questions
  bulkCreateQuestions: async (examId: string, questions: CreateQuestionDto[]): Promise<{ count: number }> => {
    return await api.post(`/exams/${examId}/questions/bulk`, { questions }).then((response) => response.data);
  },
};

export default QuestionService;
