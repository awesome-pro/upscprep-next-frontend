import { PaginatedResponse } from '@/lib/pagination';
import api from '../lib/axios';
import { Attempt, AttemptQueryParams, CreateAttemptDto, UpdateAttemptDto } from '../types/exams';

const BASE_URL = '/attempts';

/**
 * Service for handling exam attempts
 */
const attemptService = {
  /**
   * Create a new attempt for an exam
   */
  async createAttempt(data: CreateAttemptDto): Promise<Attempt> {
    return (await api.post(BASE_URL, data)).data;
  },

  /**
   * Get all attempts with pagination and filtering (admin/teacher only)
   */
  async getAllAttempts(params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> {
    return (await api.get(BASE_URL, { params })).data;
  },

  /**
   * Get an attempt by ID
   */
  async getAttemptById(id: string): Promise<Attempt> {
    return (await api.get(`${BASE_URL}/${id}`)).data;
  },

  /**
   * Update an attempt
   */
  async updateAttempt(id: string, data: UpdateAttemptDto): Promise<Attempt> {
    return (await api.patch(`${BASE_URL}/${id}`, data)).data;
  },

  /**
   * Delete an attempt
   */
  async deleteAttempt(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get all attempts by the logged-in user
   */
  async getMyAttempts(params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> {
    return (await api.get(`${BASE_URL}/user/my-attempts`, { params })).data;
  },

  /**
   * Get all attempts for a specific exam (admin/teacher only)
   */
  async getAttemptsByExam(examId: string, params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> {
    return (await api.get(`${BASE_URL}/exam/${examId}`, { params })).data;
  },

  /**
   * Get all attempts assigned to the logged-in teacher for evaluation
   */
  async getMyEvaluations(params: AttemptQueryParams): Promise<PaginatedResponse<Attempt>> {
    return (await api.get(`${BASE_URL}/evaluator/my-evaluations`, { params })).data;
  },

  /**
   * Assign an attempt to a teacher for evaluation (admin only)
   */
  async assignAttemptToEvaluator(attemptId: string, evaluatorId: string): Promise<Attempt> {
    return (await api.post(`${BASE_URL}/${attemptId}/assign/${evaluatorId}`)).data;
  },

  /**
   * Evaluate an attempt (auto-grade MCQs and mark as COMPLETED)
   */
  async evaluateAttempt(attemptId: string): Promise<Attempt> {
    return (await api.post(`${BASE_URL}/${attemptId}/evaluate`)).data;
  },
};

export default attemptService;
