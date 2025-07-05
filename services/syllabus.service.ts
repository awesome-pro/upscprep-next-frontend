import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { CreateSyllabusDto, QuerySyllabusDto, Syllabus, UpdateSyllabusDto } from '@/types';

const BASE_URL = '/syllabus';

export const SyllabusService = {
  /**
   * Get all syllabuses with optional filtering and pagination
   */
  async getSyllabuses(query: QuerySyllabusDto = {}): Promise<PaginatedResponse<Syllabus>> {
    const { data } = await api.get(BASE_URL, { params: query });
    return data;
  },

  /**
   * Get a single syllabus by ID
   */
  async getSyllabusById(id: string): Promise<Syllabus> {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    return data;
  },

  /**
   * Create a new syllabus
   */
  async createSyllabus(syllabus: CreateSyllabusDto): Promise<Syllabus> {
    const { data } = await api.post(BASE_URL, syllabus);
    return data;
  },

  /**
   * Update an existing syllabus
   */
  async updateSyllabus(id: string, syllabus: UpdateSyllabusDto): Promise<Syllabus> {
    const { data } = await api.patch(`${BASE_URL}/${id}`, syllabus);
    return data;
  },

  /**
   * Delete a syllabus
   */
  async deleteSyllabus(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get syllabuses by teacher ID
   */
  async getSyllabusesByTeacher(query: QuerySyllabusDto = {}): Promise<PaginatedResponse<Syllabus>> {
    const { data } = await api.get(`${BASE_URL}/teacher`, { params: query });
    return data;
  },

  /**
   * Search syllabuses by term
   */
  async searchSyllabuses(term: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Syllabus>> {
    const { data } = await api.get(`${BASE_URL}/search`, { 
      params: { term, page, pageSize } 
    });
    return data;
  }
};
