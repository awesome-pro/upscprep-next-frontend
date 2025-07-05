import api from '@/lib/axios';
import { PaginatedResponse } from '@/lib/pagination';
import { CreateTodoDto, QueryTodoDto, TodoItem, TodoStatistics, UpdateTodoDto } from '@/types';

const BASE_URL = '/todos';

export const TodoService = {
  /**
   * Get all todos with optional filtering and pagination
   */
  async getTodos(query: QueryTodoDto = {}): Promise<PaginatedResponse<TodoItem>> {
    const { data } = await api.get(BASE_URL, { params: query });
    return data;
  },

  /**
   * Get a single todo by ID
   */
  async getTodoById(id: string): Promise<TodoItem> {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    return data;
  },

  /**
   * Create a new todo
   */
  async createTodo(todo: CreateTodoDto): Promise<TodoItem> {
    const { data } = await api.post(BASE_URL, todo);
    return data;
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, todo: UpdateTodoDto): Promise<TodoItem> {
    const { data } = await api.patch(`${BASE_URL}/${id}`, todo);
    return data;
  },

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Toggle the completion status of a todo
   */
  async toggleTodoCompletion(id: string): Promise<TodoItem> {
    const { data } = await api.patch(`${BASE_URL}/${id}/toggle`);
    return data;
  },

  /**
   * Get todo statistics
   */
  async getTodoStatistics(): Promise<TodoStatistics> {
    const { data } = await api.get(`${BASE_URL}/statistics`);
    return data;
  }
};
