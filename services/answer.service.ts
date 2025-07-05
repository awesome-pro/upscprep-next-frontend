import api from '../lib/axios';
import { Answer, CreateAnswerDto, UpdateAnswerDto, EvaluateAnswerDto } from '../types/exams';

const BASE_URL = '/answers';

/**
 * Service for handling exam answers
 */
const answerService = {
  /**
   * Create a new answer for an attempt
   */
  async createAnswer(data: CreateAnswerDto): Promise<Answer> {
    return (await api.post(BASE_URL, data)).data;
  },

  /**
   * Get an answer by ID
   */
  async getAnswerById(id: string): Promise<Answer> {
    return (await api.get(`${BASE_URL}/${id}`)).data;
  },

  /**
   * Update an answer
   */
  async updateAnswer(id: string, data: UpdateAnswerDto): Promise<Answer> {
    return (await api.patch(`${BASE_URL}/${id}`, data)).data;
  },

  /**
   * Delete an answer
   */
  async deleteAnswer(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get all answers for a specific attempt
   */
  async getAnswersByAttempt(attemptId: string): Promise<Answer[]> {
    return (await api.get(`${BASE_URL}/attempt/${attemptId}`)).data;
  },

  /**
   * Evaluate an answer (teacher/evaluator only)
   */
  async evaluateAnswer(id: string, data: EvaluateAnswerDto): Promise<Answer> {
    return (await api.post(`${BASE_URL}/${id}/evaluate`, data)).data;
  },
};

export default answerService;
