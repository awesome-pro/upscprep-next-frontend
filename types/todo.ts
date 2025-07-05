export interface TodoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStatistics {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface CreateTodoDto {
  title: string;
  description: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface QueryTodoDto {
  title?: string;
  isCompleted?: boolean;
  page?: number;
  pageSize?: number;
}