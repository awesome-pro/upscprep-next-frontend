import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { EntityType } from '@/types/progress';

export interface UpdateProgressParams {
  entityId: string;
  entityType: EntityType;
  timeSpent?: number;
  lastPosition?: number;
  isCompleted?: boolean;
  accuracy?: number;
  score?: number;
  metadata?: Record<string, any>;
}

export interface ProgressSummary {
  totalEntities: number;
  totalCompleted: number;
  totalTimeSpentSeconds: number;
  byEntityType: Record<string, {
    total: number;
    completed: number;
    timeSpentSeconds: number;
  }>;
}

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update progress for an entity
   */
  const updateProgress = async (params: UpdateProgressParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/progress', params);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update progress';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get progress for a specific entity
   */
  const getProgress = async (entityId: string, entityType: EntityType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/progress/entity/${entityId}/${entityType}`);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get progress';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all progress by entity type
   */
  const getAllProgressByType = async (entityType: EntityType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/progress/type/${entityType}`);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get progress data';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get progress summary across all entity types
   */
  const getProgressSummary = async (): Promise<ProgressSummary | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/progress/summary');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get progress summary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateProgress,
    getProgress,
    getAllProgressByType,
    getProgressSummary,
  };
};
