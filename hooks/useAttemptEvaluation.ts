import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import attemptService from '../services/attempt.service';
import answerService from '../services/answer.service';
import {
  Attempt,
  Answer,
  UpdateAttemptDto,
  EvaluateAnswerDto,
  AttemptStatus
} from '../types/exams';

interface UseAttemptEvaluationProps {
  attemptId?: string;
}

/**
 * Hook for evaluating exam attempts (for teachers/evaluators)
 */
export const useAttemptEvaluation = ({ attemptId }: UseAttemptEvaluationProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  /**
   * Load an attempt for evaluation
   */
  const loadAttemptForEvaluation = useCallback(async (id: string = attemptId!) => {
    if (!id) {
      setError('Attempt ID is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedAttempt = await attemptService.getAttemptById(id);
      setAttempt(loadedAttempt);
      
      // Load answers for this attempt
      const attemptAnswers = await answerService.getAnswersByAttempt(id);
      setAnswers(attemptAnswers);
      
      return loadedAttempt;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load attempt for evaluation';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  /**
   * Evaluate a single answer
   */
  const evaluateAnswer = useCallback(async (answerId: string, data: EvaluateAnswerDto) => {
    setLoading(true);
    setError(null);

    try {
      const evaluatedAnswer = await answerService.evaluateAnswer(answerId, data);
      
      // Update answers list
      setAnswers(prev => {
        const index = prev.findIndex(a => a.id === evaluatedAnswer.id);
        if (index >= 0) {
          return [...prev.slice(0, index), evaluatedAnswer, ...prev.slice(index + 1)];
        } else {
          return prev;
        }
      });

      return evaluatedAnswer;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to evaluate answer';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Complete the evaluation of an attempt
   */
  const completeEvaluation = useCallback(async (feedback?: any) => {
    if (!attempt?.id) {
      setError('No active attempt found');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateAttemptDto = {
        status: AttemptStatus.EVALUATED,
        evaluationStatus: 'COMPLETED'
      };

      if (feedback) {
        updateData.feedback = feedback;
      }

      const evaluatedAttempt = await attemptService.updateAttempt(attempt.id, updateData);
      setAttempt(evaluatedAttempt);
      toast.success('Evaluation completed successfully!');
      return evaluatedAttempt;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to complete evaluation';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attempt]);

  /**
   * Get all attempts assigned to the current teacher for evaluation
   */
  const getMyEvaluations = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptService.getMyEvaluations({ page, pageSize });
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch evaluations';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    attempt,
    answers,
    loadAttemptForEvaluation,
    evaluateAnswer,
    completeEvaluation,
    getMyEvaluations
  };
};

export default useAttemptEvaluation;
