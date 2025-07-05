import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

export interface UpdateStreakParams {
  studyMinutes?: number;
  testsAttempted?: number;
  lessonsCompleted?: number;
  questionsAnswered?: number;
  pointsEarned?: number;
}

export interface StreakData {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  totalDays: number;
  studyMinutes: number;
  testsAttempted: number;
  lessonsCompleted: number;
  questionsAnswered: number;
  pointsEarned: number;
  dailyActivities: Record<string, any>;
  weeklyStats: Record<string, any>;
  monthlyStats: Record<string, any>;
}

export const useStreak = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update user streak with activity
   */
  const updateStreak = async (params: UpdateStreakParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/streak', params);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update streak';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get user streak data
   */
  const getStreak = async (): Promise<StreakData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/streak');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get streak data';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateStreak,
    getStreak,
  };
};
